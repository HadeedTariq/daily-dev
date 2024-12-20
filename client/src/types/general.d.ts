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
};

type About = {
  id: number;
  user_id: number;
  bio?: string;
  company?: string;
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
