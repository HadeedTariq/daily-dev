import { createSlice } from "@reduxjs/toolkit";

export type FullAppState = {
  user: User | null;
  profile: UserProfile | null;
  currentUserProfile: UserProfile | null;
  currentSquad: SquadDetails | null;
  tags: Tag[];
  currentPost: PostCards | null;
};

const initialState: FullAppState = {
  user: null,
  profile: null,
  currentSquad: null,
  tags: [],
  currentPost: null,
  currentUserProfile: null,
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
    setCurrentUserProfile: (state, { payload }: { payload: UserProfile }) => {
      state.currentUserProfile = payload;
    },
    setCurrentSquad: (state, { payload }: { payload: SquadDetails }) => {
      state.currentSquad = payload;
    },
    setTags: (state, { payload }: { payload: Tag[] }) => {
      state.tags = payload;
    },
    setCurrentPost: (state, { payload }: { payload: PostCards }) => {
      state.currentPost = payload;
      localStorage.setItem("currentPost", JSON.stringify(payload));
    },
  },
});

export const {
  setUser,
  setProfile,
  setCurrentSquad,
  setTags,
  setCurrentPost,
  setCurrentUserProfile,
} = fullAppReducer.actions;
export default fullAppReducer.reducer;
