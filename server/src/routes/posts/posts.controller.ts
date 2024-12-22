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
        SELECT p.id, p.title, p.content, p.created_at, 
               json_agg(t.name) AS tags
        FROM posts p
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        GROUP BY p.id
      `;
      const { rows } = await queryDb(query);
      res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    const { title, content, tags, thumbnail } = req.body;

    if (!title || !content || !thumbnail || !Array.isArray(tags)) {
      return res.status(400).json({
        message: "Title, content, thumbnail and tags are required.",
      });
    }

    if (tags.length > 3) {
      return res.status(400).json({ message: "Maximum 3 tags are allowed." });
    }

    const postQuery = `
        INSERT INTO posts (title, content,thumbnail,author_id)
        VALUES ($1, $2,$3, $4)
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
      req.body.user.id,
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

  // Delete a post
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
