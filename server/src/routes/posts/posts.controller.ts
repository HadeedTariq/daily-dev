import { pool, queryDb } from "@/db/connect";
import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";
import sanitizeHtml from "sanitize-html";
import nlp from "compromise";
import removeMd from "remove-markdown";

class PostController {
  constructor() {
    this.getPosts = this.getPosts.bind(this);
    this.getPostBySlug = this.getPostBySlug.bind(this);
    this.getMyPosts = this.getMyPosts.bind(this);
    this.getUserPosts = this.getUserPosts.bind(this);
    this.getPostComments = this.getPostComments.bind(this);
    this.createPost = this.createPost.bind(this);
    this.editPost = this.editPost.bind(this);
    this.upvotePost = this.upvotePost.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.commentOnPost = this.commentOnPost.bind(this);
    this.replyToComment = this.replyToComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateReply = this.updateReply.bind(this);
    this.upvoteComment = this.upvoteComment.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.deleteCommentReply = this.deleteCommentReply.bind(this);
  }

  getTags = () => {
    const res = [
      "software-engineering",
      "backend-development",
      "frontend-development",
      "full-stack-development",
      "web-development",
      "mobile-development",
      "cloud-computing",
      "artificial-intelligence",
      "machine-learning",
      "data-science",
      "data-engineering",
      "devops",
      "agile-methodology",
      "scrum",
      "test-driven-development",
      "unit-testing",
      "integration-testing",
      "continuous-integration",
      "continuous-deployment",
      "version-control",
      "git",
      "docker",
      "kubernetes",
      "microservices",
      "restful-api",
      "graphql",
      "nodejs",
      "express",
      "reactjs",
      "vuejs",
      "angular",
      "typescript",
      "python",
      "java",
      "ruby-on-rails",
      "cplusplus",
      "go-programming-language",
      "cloud-native",
      "serverless-architecture",
      "cybersecurity",
      "blockchain-technology",
      "database-management",
      "sql",
      "nosql",
      "mongodb",
      "postgresql",
      "mysql",
      "data-structures",
      "algorithms",
    ];
    return res;
  };

  detectTags = (content: string) => {
    const predefinedTags = this.getTags();
    const doc = nlp(removeMd(content));
    const nouns = doc.nouns().out("array");
    const adjectives = doc.adjectives().out("array");
    const acronyms = doc.acronyms().out("array");
    const adverbs = doc.adverbs().out("array");
    const tags = [
      ...new Set([...nouns, ...adjectives, ...acronyms, ...adverbs]),
    ];

    return tags.reduce((acc: string[], keyword: any) => {
      const tag = predefinedTags.includes(
        keyword.toLowerCase().split(" ").join("-")
      );
      if (tag) {
        acc.push(keyword.toLowerCase().split(" ").join("-"));
      }
      return acc;
    }, []);
  };

  async getPosts(req: Request, res: Response, next: NextFunction) {
    const { pageSize, cursor, sortingOrder } = req.query;

    const allowedSortingOrders = ["id", "", "upvotes", "views"];

    if (!allowedSortingOrders.includes(String(sortingOrder))) {
      return res.status(400).json({
        message:
          "Invalid sorting order. Allowed values: 'id', '', 'upvotes', 'views'.",
      });
    }

    try {
      let query = "";

      if (sortingOrder === "id" || sortingOrder === "") {
        query = `
        WITH paginated_posts AS (
            SELECT id
            FROM posts
            where id > $2
            ORDER BY id ASC
            LIMIT $3
        )
        SELECT 
            p.id,
            p.title,
            p.thumbnail,
            p.content,
            p.slug,
            p.tags,
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
        FROM paginated_posts pp
        JOIN posts p ON pp.id = p.id
        JOIN post_upvotes p_v ON p.id = p_v.post_id
        JOIN post_views p_vw ON p.id = p_vw.post_id
        JOIN squads p_sq ON p.squad_id = p_sq.id
        JOIN users u ON p.author_id = u.id
        ORDER BY p.id;
    `;
        const { rows } = await queryDb(query, [
          req.body.user.id,
          cursor,
          pageSize ? pageSize : 1,
        ]);

        return res.status(200).json({ posts: rows });
      }

      if (sortingOrder === "upvotes") {
        query = `
         WITH paginated_posts AS (
             SELECT p.id, p_v.upvotes
              FROM posts p
              INNER JOIN post_upvotes p_v ON p.id = p_v.post_id
              WHERE (p_v.upvotes < $2 OR (p_v.upvotes = $2 AND p.id < $3))  
              ORDER BY p_v.upvotes DESC, p.id DESC 
              LIMIT $4
          )
          SELECT 
              p.id,
              p.title,
              p.thumbnail,
              p.content,
              p.slug,
              p.tags,
              p.created_at,
              pp.upvotes AS upvotes,
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
          FROM paginated_posts pp
          JOIN posts p ON pp.id = p.id
          JOIN post_views p_vw ON p.id = p_vw.post_id
          JOIN squads p_sq ON p.squad_id = p_sq.id
          JOIN users u ON p.author_id = u.id
          ORDER BY pp.upvotes DESC;
    `;
        const upvotes = cursor?.toString().split(",")[0].split(":")[1];
        const postId = cursor?.toString().split(",")[1].split(":")[1];
        const { rows } = await queryDb(query, [
          req.body.user.id,
          upvotes,
          postId,
          pageSize ? pageSize : 1,
        ]);

        return res.status(200).json({ posts: rows });
      }
      if (sortingOrder === "views") {
        query = `
             WITH paginated_posts AS (
                  SELECT 
                  p.id,
                  p_vw.views,
                  p_v.upvotes AS upvotes
                  FROM posts p
                  INNER JOIN post_views p_vw ON p.id = p_vw.post_id
                  JOIN post_upvotes p_v ON p.id = p_v.post_id
                  WHERE (p_vw.views < $2 OR (p_vw.views = $2 AND p.id < $3))  
                  ORDER BY p_vw.views DESC, p.id DESC 
                  LIMIT $4
              )
              SELECT
                  p.id,
                  p.title,
                  p.thumbnail,
                  p.content,
                  p.slug,
                  p.tags,
                  p.created_at,
                  pp.views AS views,
                  pp.upvotes AS upvotes,
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
              FROM paginated_posts pp
              JOIN posts p ON pp.id = p.id
              JOIN post_views p_vw ON p.id = p_vw.post_id
              JOIN squads p_sq ON p.squad_id = p_sq.id
              JOIN users u ON p.author_id = u.id
              ORDER BY pp.views DESC;
        `;

        const views = cursor?.toString().split(",")[0].split(":")[1];
        const postId = cursor?.toString().split(",")[1].split(":")[1];

        const { rows } = await queryDb(query, [
          req.body.user.id,
          views,
          postId,
          pageSize ? pageSize : 1,
        ]);

        return res.status(200).json({ posts: rows });
      }
    } catch (error) {
      next(error);
    }
  }
  async getPostBySlug(req: Request, res: Response, next: NextFunction) {
    const { postSlug } = req.query;
    if (!postSlug) {
      return res.status(400).json({ message: "Post Slug is required." });
    }
    try {
      const query = `
      with required_post as(
      select  
          r_p.id,
          r_p.title,
          r_p.thumbnail,
          r_p.content,
          r_p.slug,
          r_p.created_at,
          r_p.tags,
          r_p.squad_id,
          r_p.author_id
      from posts r_p where r_p.slug = $2
      )
      SELECT 
          p.*,
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
      FROM required_post p
      INNER JOIN post_upvotes p_v ON p.id = p_v.post_id
      INNER JOIN post_views p_vw ON p.id = p_vw.post_id
      INNER JOIN squads p_sq ON p.squad_id = p_sq.id
      INNER JOIN users u ON p.author_id = u.id
  `;

      const { rows } = await queryDb(query, [req.body.user.id, postSlug]);

      res.status(200).json(rows[0]);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      next(error);
    }
  }

  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.query;
    if (!userId || isNaN(userId as any)) {
      return res.status(400).json({ message: "User ID is required." });
    }
    try {
      const query = `
      WITH user_posts AS (
        SELECT  
            p.id,
            p.thumbnail,
            p.title,
            p.content,
            p.slug,
            p.created_at,
            p.squad_id
        FROM posts p
        WHERE p.author_id = $1
      )
      SELECT 
            p.*,
            JSON_BUILD_OBJECT(
                'squad_thumbnail', p_sq.thumbnail,
                'squad_handle', p_sq.squad_handle
            ) AS squad_details
        FROM user_posts p
        INNER JOIN squads p_sq ON p.squad_id = p_sq.id;
  `;

      const { rows } = await queryDb(query, [Number(userId)]);

      res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }
  async getMyPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = `
      WITH user_posts AS (
        SELECT  
            p.id,
            p.thumbnail,
            p.title,
            p.content,
            p.slug,
            p.created_at,
            p.squad_id
        FROM posts p
        WHERE p.author_id = $1
      )
      SELECT 
            p.*,
            JSON_BUILD_OBJECT(
                'squad_thumbnail', p_sq.thumbnail,
                'squad_handle', p_sq.squad_handle
            ) AS squad_details
        FROM user_posts p
        INNER JOIN squads p_sq ON p.squad_id = p_sq.id;
  `;

      const { rows } = await queryDb(query, [req.body.user.id]);

      res.status(200).json({ posts: rows });
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { pageSize, pageNumber } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    try {
      const commentsQuery = `
      WITH current_post_comments AS (
            SELECT * 
            FROM post_comments p_c
            WHERE p_c.post_id = $1
            order by p_c.id 
            limit $3 offset ($4 - 1) * $3
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
              EXISTS (
                  SELECT 1 
                  FROM comment_upvotes c_u_v 
                  WHERE c_u_v.user_id = $2 
                    AND c_u_v.comment_id = c.id
              ) AS current_user_upvoted,
              COALESCE(
                  (SELECT COUNT(*) 
                  FROM comment_upvotes c_u_v_n 
                  WHERE c_u_v_n.comment_id = c.id), 
                  0
              ) AS total_upvotes,
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
              u.avatar
          order by c.id;
      `;

      const { rows: comments } = await queryDb(commentsQuery, [
        Number(postId),
        req.body.user.id,
        pageSize ? pageSize : 8,
        pageNumber ? pageNumber : 1,
      ]);

      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching post comments:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching the comments." });
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    const { title, content, thumbnail, squad } = req.body;

    if (!title || !content || !thumbnail || !squad) {
      return res.status(400).json({ message: "Please fill all the fields" });
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

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const tags = this.detectTags(sanitizedContent);
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const postQuery = `
      INSERT INTO posts (title, content, thumbnail, author_id, squad_id, slug,tags)
      VALUES ($1, $2, $3, $4, $5, $6,$7)
      RETURNING id;
  `;

      const { rows: postRows } = await client.query(postQuery, [
        title,
        sanitizedContent,
        thumbnail,
        Number(req.body.user.id),
        Number(squad),
        slug,
        tags,
      ]);

      const postId = postRows[0].id;

      await client.query(
        `INSERT INTO post_upvotes (post_id, upvotes) VALUES ($1, $2)`,
        [postId, 0]
      );

      await client.query(
        `INSERT INTO post_views (post_id, views) VALUES ($1, $2)`,
        [postId, 0]
      );

      await client.query("COMMIT");
      res.status(201).json({ message: "Post created successfully." });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction failed and rolled back:", error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the post." });
    } finally {
      client.release();
      console.log("Database client released");
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

  async upvoteComment(req: Request, res: Response, next: NextFunction) {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required." });
    }

    try {
      const userId = req.body.user.id;

      const { rows } = await queryDb(
        `SELECT 1 FROM comment_upvotes WHERE comment_id = $1 AND user_id = $2`,
        [Number(commentId), userId]
      );

      if (rows.length > 0) {
        await queryDb(
          `DELETE FROM comment_upvotes 
           WHERE comment_id = $1 AND user_id = $2`,
          [Number(commentId), userId]
        );
        return res.status(200).json({ message: "Upvote removed." });
      }
      await queryDb(
        `INSERT INTO comment_upvotes (comment_id, user_id) 
         VALUES ($1, $2)`,
        [Number(commentId), userId]
      );

      return res.status(200).json({ message: "Comment upvoted successfully." });
    } catch (error) {
      console.error("Error upvoting comment:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while upvoting the comment." });
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
        DELETE FROM posts WHERE id = $1 AND author_id = $2 returning id;
      `;
      const { rows } = await queryDb(deletePostQuery, [
        postId,
        req.body.user.id,
      ]);

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
