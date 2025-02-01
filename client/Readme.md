## **Frontend Documentation**

### **Overview**

The frontend of **Daily Dev Clone** is built using **React** and **TypeScript**, providing a responsive and user-friendly interface for developers to interact with the platform. It includes features like authentication, profile management, post creation, squad collaboration, and more.

---

### **Features**

#### **Authentication**

- **Register**: User registration with email verification.
- **Verify**: Email verification for account activation.
- **Login**: Secure login functionality.
- **OAuth**: Integration with GitHub for seamless authentication.
- **UI Components**: Reusable components for login, registration, and OAuth flows.

#### **Profile**

- **Profile Page**: Displays user details, social links, and joined squads.
- **Edit Profile**: Allows users to update their profile information.
- **Share Profile**: Shareable profile links with a unique URL.
- **ReadMe Editor**: A rich text editor for creating and editing ReadMe content.

#### **Posts**

- **Post Creation**: Users can create and publish posts with tags.
- **Post Feed**: Infinite scrolling for posts with upvotes, views, and comments.
- **Comments**: Nested comment replies with upvotes and deletion functionality.
- **Streak Tracking**: Displays reading streaks for post engagement.

#### **Squads**

- **Squad Creation**: Users can create and manage squads.
- **Squad Page**: Displays squad details, posts, and member lists.
- **Join/Leave Squad**: Users can join or leave squads.
- **Admin Controls**: Admins can promote/demote members and moderators.

#### **Followers/Following**

- **Follow/Unfollow**: Users can follow or unfollow other users.
- **Notifications**: Real-time notifications for follow/unfollow actions.
- **Following Posts**: Displays posts from users you follow.

#### **Explore Page**

- **Sorting**: Sort posts by popularity, recency, or tags.
- **Search**: Search for posts, users, or squads.

---

### **Tech Stack**

- **Framework**: React
- **Language**: TypeScript
- **State Management**: Context API or Redux (if applicable)
- **Styling**: CSS Modules or Tailwind CSS
- **Routing**: React Router
- **API Integration**: Axios for REST API calls

---

### **Folder Structure**

```
src/
├── types/        # TypeScript types and interfaces
├── utils/        # Utility functions and helpers
├── styles/       # Global styles and theme configurations
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # External libraries and API calls
├── assets/       # Static assets (images, icons, fonts)
├── pages/        # Page components
├── reducers/     # Reducers for state management
└── store/        # Global state management (Redux Toolkit)
```

---

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/HadeedTariq/daily-dev
   ```
2. Navigate to the client directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

### **Environment Variables**

Add the following variables to a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:3000
```
