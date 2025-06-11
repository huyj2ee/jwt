import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { assignRevokeRole, getAllRoles, getAssignedRoles, RolesStore } from '../../app/api';

export const getAllRolesAsync = createAsyncThunk(
  'getallroles',
  async (param, thunkAPI) => {
    const response = await getAllRoles(thunkAPI);
    return response;
  }
);

export const getAssignedRolesAsync = createAsyncThunk(
  'getassignedroles',
  async (username: string, thunkAPI) => {
    const response = await getAssignedRoles(username, thunkAPI);
    return response;
  }
);

export const assignRevokeRoleAsync = createAsyncThunk(
  'assignrevokerole',
  async (params: {username: string, role: string, isAssigned: boolean}, thunkAPI) => {
    const response = await assignRevokeRole(params, thunkAPI);
    return response;
  }
);

const initialState: RolesStore = {
  roles: null,
  assignedRoles: null,
  errorMessage: null
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRoles: (state) => {
      state.roles = null;
      state.assignedRoles = null;
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<RolesStore>) => {
    builder
      // getallroles
      .addCase(getAllRolesAsync.pending, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.roles = null;
      })
      .addCase(getAllRolesAsync.fulfilled, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.roles = action.payload.map((role: any) => role.role);
      })
      .addCase(getAllRolesAsync.rejected, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = action.payload.message;
        state.roles = null;
      })
      // getassignedroles
      .addCase(getAssignedRolesAsync.pending, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.assignedRoles = null;
      })
      .addCase(getAssignedRolesAsync.fulfilled, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
        state.assignedRoles = action.payload.map((role: any) => role.role);
      })
      .addCase(getAssignedRolesAsync.rejected, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = action.payload.message;
        state.assignedRoles = null;
      })
      // assignrevokeroles
      .addCase(assignRevokeRoleAsync.pending, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
      })
      .addCase(assignRevokeRoleAsync.fulfilled, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = null;
      })
      .addCase(assignRevokeRoleAsync.rejected, (state: RolesStore, action: PayloadAction<any>) => {
        state.errorMessage = action.payload.message;
      });
    }
});

export const { clearRoles } = rolesSlice.actions
export default rolesSlice.reducer;