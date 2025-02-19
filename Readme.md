# **Daily Dev Clone**

**A Full-Stack Social Platform for Developers**

This is a feature-rich social platform designed for developers to share posts, join squads, collaborate, and grow their network. It includes authentication, profile management, post creation, squad collaboration, and more.

---

## **Features**

### **Authentication**

- **Register**: User registration with email verification.
- **Verify**: Email verification for account activation.
- **Login**: Secure login functionality.
- **OAuth**: Integration with GitHub for seamless authentication.
- **Frontend**: User-friendly authentication UI.

---

### **Profile**

- **Create About and Social Links**: Users can add personal details and social media links.
- **Profile Page**: Frontend profile page with user details.
- **Backend Functionalities**: APIs for profile management.
- **Edit Profile**: Users can update their profile information.
- **Share Profile**: Shareable profile links.

---

### **ReadMe**

- **ReadMe Editor**: A rich text editor for creating and editing ReadMe content.
- **Tables**:
  - **Streak**: Streak logic for tracking user activity.
  - **Posts**: Table for managing posts.
  - **Tags**: Table for post tags.

---

### **Posts**

- **Posts Home Page**: Display all posts.
- **Views**: Track post views.
- **Upvotes**: Post upvoting functionality (non-scalable).
- **Auto Tagging**: Automatically generate relevant tags for posts based on content.
- **Comments**:
  - **Replies**: Nested comment replies.
  - **Upvotes**: Comment upvoting.
  - **Deletion**: Delete comments and replies.
  - **Cascading**: Cascading deletion for replies.
- **Infinite Scrolling**:
  - **Post Fetching**: Infinite scroll for posts.
  - **Comment Fetching**: Infinite scroll for comments.

---

### **Squads**

- **Squad Creation**: Users can create squads.
- **Role Management**: Only one admin per squad; roles can be updated.
- **Sidebar**: Squad-specific sidebar for navigation.
- **Registration Fix**: Improved squad registration functionality.
- **Squad Details Page**:
  - **Edit Page**: Edit squad details.
  - **Delete Squad**: Admin can delete squads.
  - **Squad Page**: Squad profile page.
  - **Moderator Section**: Manage squad moderators.
  - **Member Section**: Manage squad members.
  - **Join/Leave Squad**: Users can join or leave squads.
  - **Admin Controls**: Admins can promote/demote members and moderators.
- **Squad Profile Page**: Public squad profile.
- **Schema Finalization**: Squad database schema finalized.
- **Public Squad Member Adding**: Add members to public squads.
- **Dummy Data**: Added non-energy hours dummy data.
- **Post Creation in Squads**: Users can create posts only in squads they’ve joined.
- **Profile Integration**: Show squads a user has joined on their profile.

---

### **Followers/Following**

- **Schema**: Notification schema for followers/following.
- **Functionality**: Follow/unfollow users.
- **Notifications**: Notifications for follow/unfollow actions.
- **Profile Integration**: Display followers/following on profiles.
- **Following Posts**: Page for posts from followed users.
- **Squad Integration**: Follow/unfollow within squads.

---

### **Other Features**

- **Other User Profile Page**: View other users’ profiles.
- **Explore Page**: Sort and explore posts based on various factors.

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
- `POST /posts`: Create a post.
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

- `POST /squads/create`: Create a squad.
- `GET /squads/my`: Get my squads.
- `GET /squads/details/:squad_handle`: Get squad details.
- `GET /squads/posts/:squad_id`: Get posts from a squad.
- `GET /squads`: Get all squads.
- `PUT /squads/join`: Join a squad.
- `PUT /squads/leave`: Leave a squad.

#### **Squad Admin Actions**

- `PUT /squads/edit/:squad_id/:squad_handle`: Edit squad (Admin).
- `PUT /squads/:squad_id/make-admin`: Assign squad admin role (Admin).
- `PUT /squads/:squad_id/make-moderator`: Assign squad moderator role (Admin).
- `PUT /squads/:squad_id/make-member`: Assign squad member role (Admin).
- `PUT /squads/:squad_id/remove-member`: Remove a squad member (Admin).
- `DELETE /squads/:squad_id`: Delete a squad (Admin).

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

## **Tech Stack**

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express
- **Database**: (PostgreSQL)
- **Authentication**: OAuth (GitHub), JWT

---

## **Installation**

### 1. Server

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
   Create a `.env` in **server** folder and add the following:

```ini
# Server Configuration
HOST=localhost
PORT=3000
NODE_ENV=development
SERVER_DOMAIN=http://localhost:3000

# Rate Limiting
COMMON_RATE_LIMIT_MAX_REQUESTS=100
COMMON_RATE_LIMIT_WINDOW_MS=60000

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT Secrets
JWT_SECRET=your_jwt_secret
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Session Secret
SESSION_SECRET=your_session_secret

# Security & Hashing
PASSWORD_SALT=10

# Email Configuration (NodeMailer)
NODE_MAILER_USER=your_email@example.com
NODE_MAILER_PASSWORD=your_email_password

# Database Configuration (Aiven PostgreSQL)
DATABASE_URL=postgres://your_user:your_password@your_host:your_port/your_database
DATABASE_HOST=your_host
DATABASE_PORT=your_port
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password

# Redis Configuration (Aiven Redis)
REDIS_URL=redis://your_redis_user:your_redis_password@your_redis_host:your_redis_port
```

⚠ **Note:** Ensure that you replace the placeholder values with your actual credentials. Never share your `.env` file publicly.

---

### 2. Client

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---
