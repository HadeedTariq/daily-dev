type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
};

type ErrResponse = {
  response: {
    data: {
      message: string;
    };
  };
};

type UserProfile = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  email: string;
  created_at: string;
  profession?: string;
  about: About;
  social_links: SocialLinks;
  user_stats: UserStats;
  streaks: Streak;
};

type About = {
  id: number;
  user_id: number;
  bio?: string;
  company?: string;
  readme?: string;
  job_title?: string;
  created_at: string;
};

type SocialLinks = {
  id: number;
  user_id: number;
  github?: string;
  linkedin?: string;
  website?: string;
  x?: string;
  youtube?: string;
  stack_overflow?: string;
  reddit?: string;
  roadmap_sh?: string;
  codepen?: string;
  mastodon?: string;
  threads?: string;
  created_at: string;
};

type UserStats = {
  id: number;
  user_id: number;
  followers: number;
  following: number;
  reputation: number;
  views: number;
  upvotes: number;
  created_at: string;
};

type Streak = {
  id: number;
  user_id: number;
  streak_start: Date;
  streak_end: Date;
  updated_at: Date;
  streak_length: number;
  longest_streak: number;
};

type UserPosts = {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

type Tag = {
  id: number;
  name: string;
};

type PostTag = {
  post_id: number;
  tag_id: number;
};

type Squad = {
  name: string;
  squad_handle: string;
  description: string | null; // description can be null
  category: string; // Replace with actual enum values for squad_category
  is_public: boolean;
  post_creation_allowed_to: string; // Replace with actual enum values for post_content
  invitation_permission: string; // Replace with actual enum values for post_content
  post_approval_required: boolean;
  created_at: string; // or Date depending on how you want to handle timestamps
  updated_at: string; // or Date depending on how you want to handle timestamps
};
