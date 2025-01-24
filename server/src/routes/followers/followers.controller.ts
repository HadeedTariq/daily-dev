import { queryDb, runIndependentTransaction } from "@/db/connect";
import { NextFunction, Request, Response } from "express";

class FollowersController {
  constructor() {
    this.followUser = this.followUser.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.unfollowUser = this.unfollowUser.bind(this);
    this.updateNotificationStatus = this.updateNotificationStatus.bind(this);
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
        {
          query:
            "INSERT INTO follow_notifications (user_id, actor_id, action_type) VALUES ($1, $2, $3)",
          params: [Number(followedId), followerId, "follow"],
        },
      ]);

      res.status(201).json({ message: "User followed successfully." });
    } catch (error: any) {
      if (error.constraint === "followers_follower_id_fkey") {
        return res.status(400).json({ message: "Follower does not exist." });
      }
      if (error.code === "23503") {
        console.error(
          "Foreign key violation: The followed user does not exist."
        );

        res.status(400).json({
          message: "The followed user does not exist.",
        });
      }

      next(error);
    }
  }

  async unfollowUser(req: Request, res: Response, next: NextFunction) {
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
          .json({ message: "Users cannot follow and unfollow themselves." });
      }

      const { rows: existingFollow } = await queryDb(
        "SELECT 1 FROM followers WHERE follower_id = $1 AND followed_id = $2",
        [followerId, Number(followedId)]
      );

      if (existingFollow.length < 1) {
        return res
          .status(400)
          .json({ message: "You doesn't follow this user" });
      }

      await runIndependentTransaction([
        {
          query:
            "DELETE FROM followers WHERE follower_id =$1 AND followed_id=$2",
          params: [followerId, Number(followedId)],
        },
        {
          query:
            "UPDATE user_stats SET following = following - 1 WHERE user_id = $1",
          params: [followerId],
        },
        {
          query:
            "INSERT INTO follow_notifications (user_id, actor_id, action_type) VALUES ($1, $2, $3)",
          params: [Number(followedId), followerId, "unfollow"],
        },
      ]);

      res.status(201).json({ message: "User un-followed successfully." });
    } catch (error: any) {
      if (error.code === "23503") {
        return res.status(400).json({
          message: "The user you're trying to unfollow does not exist.",
        });
      }
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
  async updateNotificationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.body.user.id;

      const query = `
        UPDATE follow_notifications
        SET is_read = True
        WHERE  user_id = $1
        RETURNING id;
      `;

      const { rows } = await queryDb(query, [userId]);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Notification not found or does not belong to the user.",
        });
      }

      return res.status(200).json({
        message: "Notification status updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user.id;

      const { rows: notifications } = await queryDb(
        `
        WITH user_notifications AS (
            SELECT * 
            FROM follow_notifications f_n
            WHERE f_n.user_id = $1
        )
          SELECT
              n.*,
              JSON_BUILD_OBJECT(
                  'username', u.username,
                  'avatar', u.avatar,
                  'name', u.name
              ) AS actor_details
          FROM user_notifications n
          INNER JOIN users u ON u.id = n.actor_id;

        `,
        [userId]
      );

      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  }
}

export const followersController = new FollowersController();
