import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteUser, filterByUsername, listUsers, setEnabled, setPassword, unlockUser, UsersStore } from "../../app/api";

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
  async (params: {username: string, filteredUsername: string, page: number, nonlocked: boolean}, thunkAPI) => {
    const response = await deleteUser(params, thunkAPI);
    return response;
  }
);

export const setPasswordAsync = createAsyncThunk(
  'setpassword',
  async (params: {username: string, password: string}, thunkAPI) => {
    const response = await setPassword(params, thunkAPI);
    return response;
  }
);

export const unlockUserAsync = createAsyncThunk(
  'unlockuser',
  async (params: {username: string, filteredUsername: string, page: number, nonlocked: boolean}, thunkAPI) => {
    const response = await unlockUser(params, thunkAPI);
    return response;
  }
);

export const setEnabledAsync = createAsyncThunk(
  'setenabled',
  async (params: {username: string, enabled: boolean, filteredUsername: string, page: number, nonlocked: boolean}, thunkAPI) => {
    const response = await setEnabled(params, thunkAPI);
    return response;
  }
);

const initialState: UsersStore = {
  targetUsername: null,
  data: [],
  count: 0,
  limit: 0,
  page: 0,
  errorMessage: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearTargetUsername: (state) => {
      state.targetUsername = null;
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<UsersStore>) => {
    builder
      // listusers
      .addCase(listUsersAsync.pending, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
      })
      .addCase(listUsersAsync.fulfilled, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.data = action.payload.data;
        state.count = action.payload.count;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
      })
      .addCase(listUsersAsync.rejected, (state: UsersStore, action: PayloadAction<any>) => {
        state.data = [];
        state.count = 0;
        state.limit = 0;
        state.page = 0;
        state.errorMessage = action.payload.message;
      })
      // filterbyusername
      .addCase(filterByUsernameAsync.pending, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
      })
      .addCase(filterByUsernameAsync.fulfilled, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.data = action.payload.data;
        state.count = action.payload.count;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
      })
      .addCase(filterByUsernameAsync.rejected, (state: UsersStore, action: PayloadAction<any>) => {
        state.data = [];
        state.count = 0;
        state.limit = 0;
        state.page = 0;
        const prefix:string = 'User with username';
        const subfix:string = 'is not found.';
        if (action.payload.message.slice(0, prefix.length) !== prefix || action.payload.message.slice(-subfix.length) !== subfix) {
          state.errorMessage = action.payload.message;
        }
      })
      // setpassword
      .addCase(setPasswordAsync.pending, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.targetUsername = null;
      })
      .addCase(setPasswordAsync.fulfilled, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.targetUsername = action.payload.username;
      })
      .addCase(setPasswordAsync.rejected, (state: UsersStore, action: PayloadAction<any>) => {
        state.targetUsername = null;
        state.errorMessage = action.payload.message;
      })
      // unlockuser
      .addCase(unlockUserAsync.pending, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
      })
      .addCase(unlockUserAsync.fulfilled, (state: UsersStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
      })
      .addCase(unlockUserAsync.rejected, (state: UsersStore, action: PayloadAction<any>) => {
        state.data = [];
        state.count = 0;
        state.limit = 0;
        state.page = 0;
        state.errorMessage = action.payload.message;
      });
  }
});

export const { clearTargetUsername } = usersSlice.actions;
export default usersSlice.reducer;
