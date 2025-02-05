import { queryDb, runIndependentTransaction } from "@/db/connect";
import { NextFunction, Request, Response } from "express";

class FollowersController {
  constructor() {
    this.followUser = this.followUser.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
    this.getUserFollowers = this.getUserFollowers.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.getUserFollowing = this.getUserFollowing.bind(this);
    this.getFollowingsPosts = this.getFollowingsPosts.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.unfollowUser = this.unfollowUser.bind(this);
    this.updateNotificationStatus = this.updateNotificationStatus.bind(this);
  }
  async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { followedId } = req.body;
      let { followerId } = req.body;
      console.log(Date.now().toLocaleString());

      if (!followedId || isNaN(followedId)) {
        return res
          .status(400)
          .json({ message: "Valid followedId is required." });
      }
      followerId = Number(followerId);

      // const followerId = Number(req.body.user.id);

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
            "UPDATE user_stats SET following = following + 1 WHERE user_id = $1",
          params: [followerId],
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
      console.log(error.message);

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
            "UPDATE user_stats SET followers = followers - 1 WHERE user_id = $1",
          params: [Number(followedId)],
        },
        {
          query:
            "DELETE FROM follow_notifications WHERE user_id = $1 AND actor_id = $2",
          params: [Number(followedId), followerId],
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

  async getUserFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      if (!userId || isNaN(userId as any)) {
        return res.status(400).json({ message: "User ID is required." });
      }

      const { rows: followers } = await queryDb(
        `
       WITH user_followers AS (
            SELECT 
                follower_id, 
                followed_id
            FROM followers
            WHERE followed_id = $1
        )
          SELECT 
              u.id, 
              u.username, 
              u.name, 
              u.avatar,
              EXISTS (
                  SELECT 1 
                  FROM followers f_f
                  WHERE f_f.follower_id = $2 
                    AND f_f.followed_id = uf.follower_id
              ) AS current_user_follow
          FROM user_followers uf
          INNER JOIN users u 
              ON u.id = uf.follower_id;
        `,
        [Number(userId), req.body.user.id]
      );

      res.status(200).json(followers);
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
            SELECT 
                follower_id, 
                followed_id
            FROM followers
            WHERE followed_id = $1
        )
          SELECT 
              u.id, 
              u.username, 
              u.name, 
              u.avatar,
              EXISTS (
                  SELECT 1 
                  FROM followers f_f
                  WHERE f_f.follower_id = $1 
                    AND f_f.followed_id = uf.follower_id
              ) AS current_user_follow
          FROM user_followers uf
          INNER JOIN users u 
              ON u.id = uf.follower_id;

        `,
        [userId]
      );

      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  }

  async getFollowingsPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user.id;
      const { pageSize, lastId } = req.query;

      const { rows: followingsPosts } = await queryDb(
        `
         WITH user_followings AS (
              SELECT 
                  follower_id, 
                  followed_id
              FROM followers
              WHERE follower_id = $1
          ),
          user_followings_posts AS (
              SELECT 
                  p.id,
                  p.title,
                  p.thumbnail,
                  p.content,
                  p.slug,
                  p.created_at,
                  p.squad_id,
                  p.tags,
                  p.author_id
              FROM posts p
              INNER JOIN user_followings u_f ON p.author_id = u_f.followed_id
          )
          SELECT 
              p.id,
              p.title,
              p.thumbnail,
              p.content,
              p.tags,
              p.slug,
              p.created_at,
              p_v.upvotes AS upvotes,
              p_vw.views AS views,
              JSON_BUILD_OBJECT(
                  'squad_thumbnail', p_sq.thumbnail,
                  'squad_handle', p_sq.squad_handle
              ) AS squad_details,
              JSON_BUILD_OBJECT(
                  'author_avatar', u.avatar,
                  'author_name', u.name,
                  'author_username', u.username,
                  'author_id', u.id
              ) AS author_details,
              EXISTS (
                  SELECT 1 
                  FROM user_upvotes u_u_v 
                  WHERE u_u_v.user_id = $1 
                    AND u_u_v.post_id = p.id
              ) AS current_user_upvoted
          FROM user_followings_posts p
          INNER JOIN post_upvotes p_v 
              ON p.id = p_v.post_id
          INNER JOIN post_views p_vw 
              ON p.id = p_vw.post_id
          INNER JOIN squads p_sq 
              ON p.squad_id = p_sq.id
          INNER JOIN users u 
              ON p.author_id = u.id
          where p.id > $3
          ORDER BY p.id asc
          LIMIT $2;
        `,
        [userId, pageSize ? Number(pageSize) : 8, lastId ? Number(lastId) : 0]
      );

      res.status(200).json({ posts: followingsPosts });
    } catch (error) {
      next(error);
    }
  }
  async getUserFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      if (!userId || isNaN(userId as any)) {
        return res.status(400).json({ message: "User ID is required." });
      }

      const { rows: followings } = await queryDb(
        `
          WITH user_followings AS (
            SELECT follower_id, followed_id
            FROM followers
            WHERE follower_id = $1
          )
          SELECT u.id, u.username, u.name, u.avatar,
           EXISTS (
                  SELECT 1 
                  FROM followers f_f
                  WHERE f_f.follower_id = $2 
                    AND f_f.followed_id = uf.followed_id
              ) AS current_user_follow
          FROM user_followings uf
          INNER JOIN users u ON u.id = uf.followed_id
        `,
        [Number(userId), req.body.user.id]
      );

      res.status(200).json(followings);
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
