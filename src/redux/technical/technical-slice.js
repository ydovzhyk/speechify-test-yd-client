import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  message: null,
  textArray: [],
  notification: false,
  confirmation: false,
  recBtn: false,
};

const technical = createSlice({
  name: "technical",
  initialState,
  reducers: {
    addLetter: (store, action) => {
      store.textArray.push(action.payload);
    },
    setNotifacation: (store, action) => {
      store.notification = action.payload;
    },
    setConfirmation: (store, action) => {
      store.confirmation = action.payload;
    },
    setRecBtn: (store, action) => {
      store.recBtn = action.payload;
    },
    clearTextArray: (store) => {
      store.textArray = [];
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export default technical.reducer;
export const {
  addLetter,
  setNotifacation,
  setConfirmation,
  setRecBtn,
  clearTextArray,
} = technical.actions;
