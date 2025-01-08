import { queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";
import sanitizeHtml from "sanitize-html";

class PostController {
  constructor() {
    this.getPosts = this.getPosts.bind(this);
    this.getPostsTags = this.getPostsTags.bind(this);
    this.createPost = this.createPost.bind(this);
    this.createTag = this.createTag.bind(this);
    this.editPost = this.editPost.bind(this);
    this.upvotePost = this.upvotePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  async getPostsTags(req: Request, res: Response, next: NextFunction) {
    const query = `
        SELECT * 
        FROM tags 
      `;
    const { rows } = await queryDb(query);
    res.status(200).json({ tags: rows });
  }
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = `
      SELECT 
          p.id,
          p.title,
          p.thumbnail,
          p.created_at,
          JSON_AGG(t.name) FILTER (WHERE t.id IS NOT NULL) AS tags,
          p_v.upvotes AS upvotes,
          p_vw.views AS views,
          JSON_BUILD_OBJECT(
              'squad_thumbnail', p_sq.thumbnail,
              'squad_handle', p_sq.squad_handle
          ) AS squad_details,
          JSON_BUILD_OBJECT(
              'author_avatar', u.avatar
          ) AS author_details,
          EXISTS (
              SELECT 1 
              FROM user_upvotes u_u_v 
              WHERE u_u_v.user_id = $1 
                AND u_u_v.post_id = p.id
          ) AS current_user_upvoted
      FROM posts p
      LEFT JOIN post_tags p_t ON p.id = p_t.post_id
      LEFT JOIN tags t ON p_t.tag_id = t.id
      INNER JOIN post_upvotes p_v ON p.id = p_v.post_id
      INNER JOIN post_views p_vw ON p.id = p_vw.post_id
      INNER JOIN squads p_sq ON p.squad_id = p_sq.id
      INNER JOIN users u ON p.author_id = u.id
      GROUP BY 
          p.id, p.title, p.thumbnail, p.created_at, 
          p_v.upvotes, p_vw.views, 
          p_sq.thumbnail, p_sq.squad_handle, 
          u.avatar;
  `;

      const { rows } = await queryDb(query, [req.body.user.id]);

      res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    const { title, content, tags, thumbnail, squad } = req.body;

    if (!title || !content || !thumbnail || !squad || !Array.isArray(tags)) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (tags.length > 3) {
      return res.status(400).json({ message: "Maximum 3 tags are allowed." });
    }

    const { rows: isSquadMember } = await queryDb(
      `SELECT 1 FROM squad_members WHERE squad_id = $1 AND user_id = $2`,
      [Number(squad), Number(req.body.user.id)]
    );

    if (isSquadMember.length < 1) {
      return res
        .status(403)
        .json({ message: "You are not a member of this squad." });
    }

    const postQuery = `
      INSERT INTO posts (title, content, thumbnail, author_id, squad_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const { rows: postRows } = await queryDb(postQuery, [
      title,
      sanitizedContent,
      thumbnail,
      Number(req.body.user.id),
      Number(squad),
    ]);

    const postId = postRows[0].id;

    const postTagValues = tags
      .map((tag: { id: number }) => `(${postId}, ${tag.id})`)
      .join(", ");

    const insertPostTagsQuery = `
      INSERT INTO post_tags (post_id, tag_id)
      VALUES ${postTagValues};
    `;

    await queryDb(insertPostTagsQuery);

    await queryDb(
      `INSERT INTO post_upvotes (post_id, upvotes) VALUES ($1, $2)`,
      [postId, 0]
    );

    await queryDb(`INSERT INTO post_views (post_id, upvotes) VALUES ($1, $2)`, [
      postId,
      0,
    ]);

    res.status(201).json({ message: "Post created successfully." });
  }

  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Tag name is required." });
      }

      const tagQuery = `
        INSERT INTO tags (name)
        VALUES ($1)
        RETURNING id, name
      `;

      const { rows } = await queryDb(tagQuery, [name.toLowerCase()]);
      res.status(201).json({
        message: "Tag created successfully.",
        newTag: rows[0],
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        error.message = "Tag Already exists";
      }
      next(error);
    }
  }

  // Edit a post
  async editPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { title, content, tags } = req.body;

    try {
      if (title || content) {
        const updatePostQuery = `
          UPDATE posts
          SET title = COALESCE($1, title),
              content = COALESCE($2, content)
          WHERE id = $3
          RETURNING *;
        `;
        const { rows: updatedRows } = await queryDb(updatePostQuery, [
          title,
          content,
          postId,
        ]);

        if (updatedRows.length === 0) {
          return res.status(404).json({ message: "Post not found." });
        }
      }

      if (tags && Array.isArray(tags)) {
        const tagValues = tags.map((tag: string) => `('${tag}')`).join(", ");
        const insertTagsQuery = `
          INSERT INTO tags (name)
          VALUES ${tagValues}
          ON CONFLICT (name) DO NOTHING
          RETURNING id, name;
        `;
        const { rows: tagRows } = await queryDb(insertTagsQuery);

        const deleteOldTagsQuery = `
          DELETE FROM post_tags WHERE post_id = $1;
        `;
        await queryDb(deleteOldTagsQuery, [postId]);

        const postTagValues = tagRows
          .map((tag: { id: number }) => `(${postId}, ${tag.id})`)
          .join(", ");
        const insertPostTagsQuery = `
          INSERT INTO post_tags (post_id, tag_id)
          VALUES ${postTagValues};
        `;
        await queryDb(insertPostTagsQuery);
      }

      res.status(200).json({ message: "Post updated successfully." });
    } catch (error) {
      next(error);
    }
  }

  async upvotePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    try {
      const userId = req.body.user.id;

      const { rows } = await queryDb(
        `SELECT 1 FROM user_upvotes WHERE post_id = $1 AND user_id = $2`,
        [Number(postId), userId]
      );

      if (rows.length > 0) {
        await queryDb(
          `UPDATE post_upvotes 
           SET upvotes = upvotes - 1 
           WHERE post_id = $1 AND upvotes > 0`,
          [Number(postId)]
        );
        await queryDb(
          `DELETE FROM user_upvotes 
           WHERE post_id = $1 AND user_id = $2`,
          [Number(postId), userId]
        );
        return res.status(200).json({ message: "Upvote removed." });
      }

      await queryDb(
        `UPDATE post_upvotes 
         SET upvotes = upvotes + 1 
         WHERE post_id = $1`,
        [Number(postId)]
      );
      await queryDb(
        `INSERT INTO user_upvotes (post_id, user_id) 
         VALUES ($1, $2)`,
        [Number(postId), userId]
      );

      return res.status(200).json({ message: "Post upvoted successfully." });
    } catch (error) {
      console.error("Error upvoting post:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while upvoting the post." });
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;

    try {
      const deletePostQuery = `
        DELETE FROM posts WHERE id = $1 RETURNING *;
      `;
      const { rows } = await queryDb(deletePostQuery, [postId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Post not found." });
      }

      res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
