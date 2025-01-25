import { createSlice } from "@reduxjs/toolkit";

export type FullAppState = {
  user: User | null;
  profile: UserProfile | null;
  currentSquad: Omit<SquadDetails, "squad_posts"> | null;
  tags: Tag[];
  posts: PostCards[];
  stopFetchingPosts: boolean;
  followingPosts: PostCards[];
  stopFetchingFollowingPosts: boolean;
  currentPostComments: Comments[];
  stopFetchingPostComments: boolean;
  currentPost: PostCards | null;
};

const initialState: FullAppState = {
  user: null,
  profile: null,
  currentSquad: null,
  tags: [],
  posts: [],
  followingPosts: [],
  currentPostComments: [],
  stopFetchingPosts: false,
  stopFetchingFollowingPosts: false,
  currentPost: null,
  stopFetchingPostComments: false,
};

const fullAppReducer = createSlice({
  name: "fullAppReducer",
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: User }) => {
      state.user = payload;
    },
    setProfile: (state, { payload }: { payload: UserProfile }) => {
      state.profile = payload;
    },
    setCurrentSquad: (
      state,
      { payload }: { payload: Omit<SquadDetails, "squad_posts"> }
    ) => {
      state.currentSquad = payload;
    },
    setTags: (state, { payload }: { payload: Tag[] }) => {
      state.tags = payload;
    },
    addNewPosts: (state, { payload }: { payload: PostCards[] }) => {
      state.posts.push(...payload);
    },
    addNewFollowingPosts: (state, { payload }: { payload: PostCards[] }) => {
      state.followingPosts.push(...payload);
    },
    setStopFetchingFollowingPosts: (state) => {
      state.stopFetchingFollowingPosts = true;
    },
    setStopFetchingPosts: (state) => {
      state.stopFetchingPosts = true;
    },
    setStopFetchingPostComments: (state, { payload }: { payload: boolean }) => {
      state.stopFetchingPostComments = payload;
    },
    setCurrentPost: (state, { payload }: { payload: PostCards }) => {
      state.currentPost = payload;
      localStorage.setItem("currentPost", JSON.stringify(payload));
    },
    emptyCurrenPostComments: (state) => {
      state.currentPostComments = [];
    },
    addNewComments: (state, { payload }: { payload: Comments[] }) => {
      state.currentPostComments.push(...payload);
    },
  },
});

export const {
  setUser,
  setProfile,
  setCurrentSquad,
  setTags,
  addNewPosts,
  setStopFetchingPosts,
  addNewFollowingPosts,
  setStopFetchingFollowingPosts,
  addNewComments,
  setStopFetchingPostComments,
  setCurrentPost,
  emptyCurrenPostComments,
} = fullAppReducer.actions;
export default fullAppReducer.reducer;
