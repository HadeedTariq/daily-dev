## **Backend Documentation**

### **Overview**

The backend of **Daily Dev Clone** is built using **Node.js** and **Express**, providing RESTful APIs for authentication, profile management, post creation, squad collaboration, and more. It uses **PostgreSQL** for database management and **JWT** for authentication.

---

### **Features**

#### **Authentication**

- **Register**: User registration with email verification.
- **Verify**: Email verification for account activation.
- **Login**: Secure login functionality with JWT.
- **OAuth**: GitHub OAuth integration.

#### **Profile**

- **Profile Management**: APIs for creating, updating, and fetching user profiles.
- **ReadMe Editor**: Backend support for ReadMe content storage and retrieval.
- **Streak Tracking**: Logic to calculate and update user streaks.

#### **Posts**

- **Post Creation**: APIs for creating, editing, and deleting posts.
- **Comments**: APIs for adding, updating, and deleting comments and replies.
- **Upvotes**: APIs for upvoting posts and comments.
- **Views**: Track post views.

#### **Squads**

- **Squad Creation**: APIs for creating and managing squads.
- **Role Management**: APIs for updating squad roles (admin, moderator, member).
- **Post Creation in Squads**: APIs for creating posts within squads.
- **Join/Leave Squad**: APIs for joining or leaving squads.

#### **Followers/Following**

- **Follow/Unfollow**: APIs for following and unfollowing users.
- **Notifications**: APIs for fetching and marking notifications as read.

---

### **Tech Stack**

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT, GitHub OAuth
- **Caching**: Redis
- **API Documentation**: Swagger

---

### **Folder Structure**

```
src/
├── types/           # TypeScript types and interfaces
├── utils/           # Utility functions and helpers
├── common/          # Common utilities (error handling, constants)
├── db/              # Database connection and query logic
├── api/             # Business logic for different API modules
├── api-docs/        # Swagger API documentation
├── routes/          # API route handlers
└── index.ts         # Server entry point
```

---

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/HadeedTariq/daily-dev
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file and add the following:

   ```env
   # Common Settings
   COMMON_RATE_LIMIT_MAX_REQUESTS=100
   COMMON_RATE_LIMIT_WINDOW_MS=60000
   CORS_ORIGIN=*

   # Server Configuration
   HOST=localhost
   NODE_ENV=development
   PORT=3000
   SERVER_DOMAIN=http://localhost:3000

   # Authentication Secrets
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
   JWT_ACCESS_TOKEN_SECRET=your_access_token_secret

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Session Secret
   SESSION_SECRET=your_session_secret

   # Password Hashing
   PASSWORD_SALT=10

   # Email Configuration
   NODE_MAILER_USER=your_email@example.com
   NODE_MAILER_PASSWORD=your_email_password

   # Database Configuration (Aiven PostgreSQL)
   DATABASE_URL=postgres://user:password@localhost:5432/your_database  # I use Aiven as a database
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password

   # Redis Configuration
   REDIS_URL=redis://localhost:6379
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

---

### **API Documentation**

The backend APIs are documented using **Swagger**. To access the API docs:

1. Start the server.
2. Navigate to `http://localhost:3000/api`.

---

### **Database Schema**

The database schema consists of the following tables:

#### **Users & Authentication**

- `users`: Stores user information.
- `social_links`: Stores user social media links.
- `about`: Stores user profile details.
- `user_stats`: Tracks user activity and achievements.
- `streaks`: Stores user streak data.
- `user_views`: Tracks user profile views.
- `user_upvotes`: Tracks upvotes given by users.

#### **Posts & Interactions**

- `posts`: Stores user posts.
- `tags`: Stores tags for categorization.
- `post_tags`: Many-to-many relation between posts and tags.
- `post_comments`: Stores comments on posts.
- `comment_replies`: Stores replies to comments.
- `post_upvotes`: Tracks upvotes on posts.
- `comment_upvotes`: Tracks upvotes on comments.
- `post_views`: Tracks the number of views on posts.

#### **Squads & Collaboration**

- `squads`: Stores squad details.
- `squad_members`: Tracks users who joined squads.

#### **Social Features**

- `followers`: Tracks user followers.
- `follow_notifications`: Stores notifications related to follows.

---

## **API Endpoints**

### **Authentication**

- `POST /auth/register`: Register a new user.
- `POST /auth/verify`: Verify user email.
- `POST /auth/login`: User login.
- `POST /auth/oauth/github`: GitHub OAuth integration.

---

### **Posts**

- `GET /posts`: Get all posts.
- `GET /posts/me`: Get my posts.
- `GET /posts/user/:userId`: Get posts by a specific user.
- `GET /posts/:slug`: Get post by slug.
- `GET /posts/tags`: Get post tags.
- `POST /posts`: Create a post.
- `POST /posts/tags`: Create a tag.
- `POST /posts/:postId/comments`: Comment on a post.
- `POST /posts/comments/:commentId/replies`: Reply to a comment.
- `PUT /posts/comments/:commentId`: Update a comment.
- `PUT /posts/replies/:replyId`: Update a reply.
- `POST /posts/comments/:commentId/upvote`: Upvote a comment.
- `PUT /posts/:postId`: Edit a post.
- `POST /posts/:postId/upvote`: Upvote a post.
- `GET /posts/:postId/views`: View a post.
- `DELETE /posts/comments/:commentId`: Delete a comment.
- `DELETE /posts/replies/:replyId`: Delete a reply.
- `DELETE /posts/:postId`: Delete a post.

---

### **Profile**

- `GET /profile`: Get my profile.
- `GET /profile/:username`: Get user profile by username.
- `GET /profile/squads`: Get my joined squads.
- `GET /profile/:username/squads`: Get user’s joined squads.
- `PUT /profile`: Edit profile.
- `PUT /profile/readme`: Handle ReadMe updates.
- `PUT /profile/streak`: Update streak.

---

### **Squads**

- `POST /squads`: Create a squad.
- `GET /squads/me`: Get my squads.
- `GET /squads/:squadId`: Get squad details.
- `GET /squads`: Get all squads.
- `POST /squads/:squadId/join`: Join a squad.
- `POST /squads/:squadId/leave`: Leave a squad.
- `PUT /squads/:squadId`: Edit squad (Admin).
- `PUT /squads/:squadId/admin`: Make a squad admin (Admin).
- `PUT /squads/:squadId/moderator`: Make a squad moderator (Admin).
- `PUT /squads/:squadId/member`: Make a squad member (Admin).
- `DELETE /squads/:squadId/member`: Remove a squad member (Admin).
- `DELETE /squads/:squadId`: Delete a squad (Admin).

---

### **Followers/Following**

- `POST /follow/:userId`: Follow a user.
- `POST /unfollow/:userId`: Unfollow a user.
- `GET /followers/me`: Get my followers.
- `GET /followers/:userId`: Get user’s followers.
- `GET /followings/me`: Get my followings.
- `GET /followings/:userId`: Get user’s followings.
- `GET /followings/posts`: Get followings’ posts.
- `GET /notifications`: Get notifications.
- `PUT /notifications/:notificationId/read`: Mark notifications as read.

---
