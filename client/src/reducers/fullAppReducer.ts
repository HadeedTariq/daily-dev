import { createSlice } from "@reduxjs/toolkit";

export type FullAppState = {
  user: User | null;
  profile: UserProfile | null;
  currentSquad: Omit<SquadDetails, "squad_posts"> | null;
  tags: Tag[];
  posts: PostCards[];
  stopFetchingPosts: boolean;
};

const initialState: FullAppState = {
  user: null,
  profile: null,
  currentSquad: null,
  tags: [],
  posts: [],
  stopFetchingPosts: false,
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
  },
});

export const {
  setUser,
  setProfile,
  setCurrentSquad,
  setTags,
  addNewPosts,
  setStopFetchingPosts,
} = fullAppReducer.actions;
export default fullAppReducer.reducer;
