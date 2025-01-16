import { queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";
import sanitizeHtml from "sanitize-html";

class PostController {
  constructor() {
    this.getPosts = this.getPosts.bind(this);
    this.getPostsTags = this.getPostsTags.bind(this);
    this.getPostComments = this.getPostComments.bind(this);
    this.createPost = this.createPost.bind(this);
    this.createTag = this.createTag.bind(this);
    this.editPost = this.editPost.bind(this);
    this.upvotePost = this.upvotePost.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.commentOnPost = this.commentOnPost.bind(this);
    this.replyToComment = this.replyToComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateReply = this.updateReply.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.deleteCommentReply = this.deleteCommentReply.bind(this);
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
          p.content,
          p.slug,
          p.created_at,
          JSON_AGG(t.name) FILTER (WHERE t.id IS NOT NULL) AS tags,
          p_v.upvotes AS upvotes,
          p_vw.views AS views,
          JSON_BUILD_OBJECT(
              'squad_thumbnail', p_sq.thumbnail,
              'squad_handle', p_sq.squad_handle
          ) AS squad_details,
          JSON_BUILD_OBJECT(
              'author_avatar', u.avatar,
              'author_name', u.name,
              'author_username', u.username
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
          u.avatar,u.username,u.name;
  `;

      const { rows } = await queryDb(query, [req.body.user.id]);

      res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    try {
      const commentsQuery = `
      WITH current_post_comments AS (
        SELECT * 
        FROM post_comments 
        WHERE post_id = $1
      )
      SELECT 
          c.content,
          c.created_at,
          c.updated_at,
          c.edited,
          c.id,
          JSON_BUILD_OBJECT(
              'name', u.name,
              'username', u.username,
              'avatar', u.avatar,
              'id', u.id
          ) AS user_details,
          COALESCE(
              JSON_AGG(
                  JSON_BUILD_OBJECT(
                      'id', c_r.id,
                      'content', c_r.content,
                      'created_at', c_r.created_at,
                      'updated_at', c_r.updated_at,
                      'edited', c_r.edited,
                      'sender_details', JSON_BUILD_OBJECT(
                          'name', s_d.name,
                          'username', s_d.username,
                          'avatar', s_d.avatar,
                          'id', s_d.id
                      ),
                      'recipient_details', JSON_BUILD_OBJECT(
                          'name', r_d.name,
                          'username', r_d.username,
                          'avatar', r_d.avatar,
                          'id', r_d.id
                      )
                  )
              ) FILTER (WHERE c_r.id IS NOT NULL), '[]'
          ) AS replies
      FROM current_post_comments c
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN comment_replies c_r ON c.id = c_r.comment_id
      LEFT JOIN users s_d ON s_d.id = c_r.sender_id
      LEFT JOIN users r_d ON r_d.id = c_r.recipient_id
      GROUP BY 
          c.id, 
          c.content, 
          c.created_at, 
          c.updated_at, 
          c.edited, 
          u.id, 
          u.name, 
          u.username, 
          u.avatar;
      `;

      const { rows: comments } = await queryDb(commentsQuery, [Number(postId)]);

      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching post comments:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching the comments." });
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
      return res.status(400).json({ message: "Post ID is required." });
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
        .json({ message: "An error occurred while upvoting the post." });
    }
  }
  async commentOnPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { content } = req.body;

    if (!postId || !content) {
      return res
        .status(400)
        .json({ message: "Post ID and content are required." });
    }

    try {
      const userId = req.body.user.id;

      await queryDb(
        `INSERT INTO post_comments (post_id, user_id, content) 
         VALUES ($1, $2, $3)`,
        [Number(postId), userId, content]
      );

      return res.status(201).json({ message: "Comment added successfully." });
    } catch (error) {
      console.error("Error creating comment:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while adding the comment." });
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required." });
    }

    try {
      await queryDb(
        `DELETE FROM post_comments WHERE id = $1 AND user_id = $2`,
        [Number(commentId), req.body.user.id]
      );

      return res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the comment." });
    }
  }
  async deleteCommentReply(req: Request, res: Response, next: NextFunction) {
    const { commentId, replyId } = req.params;

    if (!commentId || !replyId) {
      return res
        .status(404)
        .json({ message: "Comment and Reply Id is required" });
    }

    try {
      await queryDb(
        `DELETE FROM comment_replies WHERE id = $1 AND comment_id=$2 AND sender_id = $3`,
        [Number(replyId), Number(commentId), req.body.user.id]
      );

      return res.status(200).json({ message: "Reply deleted successfully." });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the reply." });
    }
  }
  async updateComment(req: Request, res: Response, next: NextFunction) {
    const { content, commentId } = req.body;

    if (!commentId || !content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Comment ID and valid content are required." });
    }

    try {
      const userId = req.body.user.id;

      const { rowCount } = await queryDb(
        `UPDATE post_comments 
         SET content = $1, updated_at = CURRENT_TIMESTAMP, edited = TRUE 
         WHERE id = $2 AND user_id = $3`,
        [content.trim(), Number(commentId), userId]
      );

      if (rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Comment not found or not authorized to update." });
      }

      return res.status(200).json({ message: "Comment updated successfully." });
    } catch (error) {
      console.error("Error updating comment:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the comment." });
    }
  }

  async updateReply(req: Request, res: Response, next: NextFunction) {
    const { content, replyId } = req.body;

    if (!replyId || !content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Reply ID and valid content are required." });
    }

    try {
      const userId = req.body.user.id;

      const { rowCount } = await queryDb(
        `UPDATE comment_replies 
         SET content = $1, updated_at = CURRENT_TIMESTAMP, edited = TRUE 
         WHERE id = $2 AND sender_id = $3`,
        [content.trim(), Number(replyId), userId]
      );

      if (rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Reply not found or not authorized to update." });
      }

      return res.status(200).json({ message: "Reply updated successfully." });
    } catch (error) {
      console.error("Error updating reply:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the reply." });
    }
  }

  async replyToComment(req: Request, res: Response, next: NextFunction) {
    const { commentId } = req.params;
    const { content, receiverId } = req.body;

    if (!commentId || !content || !receiverId) {
      return res.status(400).json({
        message: "Comment ID, content, and receiver ID are required.",
      });
    }

    try {
      const senderId = req.body.user.id;
      if (receiverId === senderId) {
        return res
          .status(404)
          .json({ message: "You can't reply on your own comment" });
      }
      console.log(Number(commentId), senderId, Number(receiverId), content);

      await queryDb(
        `INSERT INTO comment_replies (comment_id, sender_id, recipient_id, content) 
         VALUES ($1, $2, $3, $4)`,
        [Number(commentId), senderId, Number(receiverId), content]
      );

      return res.status(201).json({ message: "Reply added successfully." });
    } catch (error) {
      console.error("Error replying to comment:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while adding the reply." });
    }
  }

  async viewPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    try {
      const userId = req.body.user.id;

      const { rows } = await queryDb(
        `SELECT 1 FROM user_views WHERE post_id = $1 AND user_id = $2`,
        [Number(postId), userId]
      );

      if (rows.length > 0) {
        return res.status(204).json({});
      }

      await queryDb(
        `UPDATE post_views
         SET views = views + 1 
         WHERE post_id = $1`,
        [Number(postId)]
      );
      await queryDb(
        `INSERT INTO user_views (post_id, user_id) 
         VALUES ($1, $2)`,
        [Number(postId), userId]
      );

      return res.status(200).json({ message: "Post viewed successfully." });
    } catch (error) {
      console.error("Error upvoting post:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while upvoting the post." });
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
