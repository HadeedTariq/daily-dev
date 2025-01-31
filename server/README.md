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

- **Post Creation**: Users can create and publish posts.
- **Reading Streak**: Streak tracking for post engagement.
- **Streak Counting**: Logic to calculate and display streaks.
- **Tables**:
  - **Squads**: Table for managing squads.
  - **Squad Members**: Table for squad members.

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

### **Posts (Detailed)**

- **Posts Home Page**: Display all posts.
- **Views**: Track post views .
- **Upvotes**: Post upvoting functionality (non-scalable).
- **Comments**:
  - **Replies**: Nested comment replies.
  - **Upvotes**: Comment upvoting.
  - **Deletion**: Delete comments and replies.
  - **Cascading**: Cascading deletion for replies.
- **Infinite Scrolling**:
  - **Post Fetching**: Infinite scroll for posts.
  - **Comment Fetching**: Infinite scroll for comments.

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

## **Tech Stack**

- **Frontend**: React, JavaScript
- **Backend**: Node.js, Express
- **Database**: (PostgreSQL)
- **Authentication**: OAuth (GitHub), JWT

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:  
   Create a `.env` file and add required variables (e.g., database credentials, API keys).
4. Run the app:
   ```bash
   npm start
   ```

---
