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
interface SquadPost {
  post_id: number;
  post_title: string;
  post_thumbnail: string;
  post_content: string;
  post_created_at: string;
  author_avatar: string;
  post_upvotes: number;
  post_views: number;
  post_tags: string[];
}

type SquadDetails = {
  squad_id: number;
  squad_name: string;
  squad_handle: string;
  description: string;
  thumbnail: string;
  category: string;
  is_public: boolean;
  admin_id: number;
  post_creation_allowed_to: string;
  invitation_permission: string;
  post_approval_required: boolean;
  created_at: string;
  squad_posts: SquadPost[];
};

type Squads = SquadDetails[];
