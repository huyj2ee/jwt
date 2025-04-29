import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteUser, filterByUsername, listUsers, UsersStore } from "../../app/api";

export const listUsersAsync = createAsyncThunk(
  'listusers',
    async (params: {page:number, nonlocked:boolean}, thunkAPI) => {
    const response = await listUsers(params, thunkAPI);
    return response;
  }
);

export const filterByUsernameAsync = createAsyncThunk(
  'filterbyusername',
  async (username:string, thunkAPI) => {
    const response = await filterByUsername(username, thunkAPI);
    return response;
  }
);

export const deleteUserAsync = createAsyncThunk(
  'deleteuser',
  async (username:string, thunkAPI) => {
    const response = await deleteUser(username, thunkAPI);
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
      })
      // listusers
      .addCase(filterByUsernameAsync.pending, (state: UsersStore, action: PayloadAction<any>) => {
      })
      .addCase(filterByUsernameAsync.fulfilled, (state: UsersStore, action: PayloadAction<any>) => {
        state.data = action.payload.data;
        state.count = action.payload.count;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
      })
      .addCase(filterByUsernameAsync.rejected, (state: UsersStore, action: PayloadAction<any>) => {
      });
  }
});

export default usersSlice.reducer;