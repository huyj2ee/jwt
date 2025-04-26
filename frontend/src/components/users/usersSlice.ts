import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { listUsers, UserItem, UsersStore } from "../../app/api";

export const listUsersAsync = createAsyncThunk(
  'listusers',
  async (page:number, thunkAPI) => {
    const response = await listUsers(page, thunkAPI);
    return response;
  }
);

const initialState: UsersStore = {
  data: [],
  count: 0,
  limit: 0,
  page: 0
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
  },
  extraReducers: (builder: ActionReducerMapBuilder<UsersStore>) => {
    builder
      // listusers
      .addCase(listUsersAsync.pending, (state: UsersStore, action: PayloadAction<any>) => {
      })
      .addCase(listUsersAsync.fulfilled, (state: UsersStore, action: PayloadAction<any>) => {
        state.data = action.payload.data;
        state.count = action.payload.count;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
      })
      .addCase(listUsersAsync.rejected, (state: UsersStore, action: PayloadAction<any>) => {
      });
  }
});

export default usersSlice.reducer;