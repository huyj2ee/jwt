import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../components/user/userSlice';
import usersReducer from '../components/users/usersSlice';
import rolesReducer from '../components/roles/rolesSlice';
 
export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    roles: rolesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;