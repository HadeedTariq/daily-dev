import { queryDb, runIndependentTransaction } from "@/db/connect";
import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

class FollowersController {
  constructor() {
    this.followUser = this.followUser.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.unfollowUser = this.unfollowUser.bind(this);
  }
  async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { followedId } = req.body;

      if (!followedId || isNaN(followedId)) {
        return res
          .status(400)
          .json({ message: "Valid followedId is required." });
      }

      const followerId = Number(req.body.user.id);

      if (followerId === Number(followedId)) {
        return res
          .status(400)
          .json({ message: "Users cannot follow themselves." });
      }

      const { rows: existingFollow } = await queryDb(
        "SELECT 1 FROM followers WHERE follower_id = $1 AND followed_id = $2",
        [followerId, Number(followedId)]
      );

      if (existingFollow.length > 0) {
        return res
          .status(400)
          .json({ message: "Already following this user." });
      }

      const { rows: userExists } = await queryDb(
        "SELECT 1 FROM users WHERE id = $1",
        [Number(followedId)]
      );

      if (userExists.length === 0) {
        return res
          .status(404)
          .json({ message: "User to follow does not exist." });
      }

      await runIndependentTransaction([
        {
          query:
            "INSERT INTO followers (follower_id, followed_id) VALUES ($1, $2)",
          params: [followerId, Number(followedId)],
        },
        {
          query:
            "UPDATE user_stats SET followers = followers + 1 WHERE user_id = $1",
          params: [Number(followedId)],
        },
      ]);

      res.status(201).json({ message: "User followed successfully." });
    } catch (error: any) {
      if (error.constraint === "followers_follower_id_fkey") {
        return res.status(400).json({ message: "Follower does not exist." });
      }

      next(error);
    }
  }

  // Unfollow a user
  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { followerId, followedId } = req.body;

      // Input validation
      if (!followerId || !followedId) {
        return res
          .status(400)
          .json({ message: "followerId and followedId are required." });
      }

      // Sanitize input
      const sanitizedFollowerId = sanitizeHtml(followerId.toString());
      const sanitizedFollowedId = sanitizeHtml(followedId.toString());

      // Delete follow record
      const result = await queryDb(
        "DELETE FROM followers WHERE follower_id = $1 AND followed_id = $2",
        [sanitizedFollowerId, sanitizedFollowedId]
      );

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Follow relationship not found." });
      }

      res.status(200).json({ message: "User unfollowed successfully." });
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user.id;

      const { rows: followers } = await queryDb(
        `
          WITH user_followers AS (
            SELECT follower_id, followed_id
            FROM followers
            WHERE followed_id = $1
          )
          SELECT u.id, u.username, u.name, u.avatar
          FROM user_followers uf
          INNER JOIN users u ON u.id = uf.follower_id
        `,
        [userId]
      );

      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  }

  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user.id;

      const { rows: followings } = await queryDb(
        `
          WITH user_followings AS (
            SELECT follower_id, followed_id
            FROM followers
            WHERE follower_id = $1
          )
          SELECT u.id, u.username, u.name, u.avatar
          FROM user_followings uf
          INNER JOIN users u ON u.id = uf.followed_id
        `,
        [userId]
      );

      res.status(200).json(followings);
    } catch (error) {
      next(error);
    }
  }

  // Get follow/unfollow notifications
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      // Input validation
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }

      // Sanitize input
      const sanitizedUserId = sanitizeHtml(userId);

      // Query notifications
      const notifications = await queryDb(
        `SELECT n.id, n.follower_id, u.username AS follower_name, u.profile_picture, 
                n.action, n.created_at, n.is_read
         FROM follow_unfollow_notifications n
         INNER JOIN users u ON n.follower_id = u.id
         WHERE n.user_id = $1
         ORDER BY n.created_at DESC`,
        [sanitizedUserId]
      );

      res.status(200).json({ notifications });
    } catch (error) {
      next(error);
    }
  }
}

export const followersController = new FollowersController();
