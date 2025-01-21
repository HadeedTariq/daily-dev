import { createSlice } from "@reduxjs/toolkit";

export type FullAppState = {
  user: User | null;
  profile: UserProfile | null;
  currentSquad: Omit<SquadDetails, "squad_posts"> | null;
  tags: Tag[];
  posts: PostCards[];
  stopFetchingPosts: boolean;
  stopFetchingPostComments: boolean;
  currentPost: PostCards | null;
  currentPostComments: Comments[];
};

const initialState: FullAppState = {
  user: null,
  profile: null,
  currentSquad: null,
  tags: [],
  posts: [],
  currentPostComments: [],
  stopFetchingPosts: false,
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
  setStopFetchingPostComments,
  setCurrentPost,
  addNewComments,
  emptyCurrenPostComments,
} = fullAppReducer.actions;
export default fullAppReducer.reducer;
