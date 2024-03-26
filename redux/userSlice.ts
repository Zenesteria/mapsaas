import { createSlice } from "@reduxjs/toolkit";

export interface userProps {
  email: string;
  uid: string;
  displayName: string;
  img: {
    url: string;
  };
  isLoggedIn: boolean;
}

const initialState: userProps = {
  email: "",
  uid: "",
  displayName: "",
  isLoggedIn: false,
  img: {
    url: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createUser: (state, action) => {
      state.uid = action.payload.uid;
      state.displayName = "kk";
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    signOutUser: (state) => {
      state.displayName = " ";
      state.uid = " ";
      state.email = " ";
      state.isLoggedIn = false;
    },
  },
});

export default userSlice.reducer;
export const { createUser, signOutUser } = userSlice.actions;
