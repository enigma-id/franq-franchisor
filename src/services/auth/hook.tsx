import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout as logoutAction, session } from "./slice";
import { useLoginMutation, useLazyGetMeQuery, useUpdateMeMutation } from "./api";
import { useFormActions } from "../form/hooks";
import { logger } from "@/utils/logger";
import type { RootState } from "../store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const [loginMutation, loginResult] = useLoginMutation();
  const [refreshMe, refreshResult] = useLazyGetMeQuery();
  const [updateMeMutation, updateMeResult] = useUpdateMeMutation();

  const { failureWithTimeout } = useFormActions();

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const res = await loginMutation(credentials).unwrap();
      if (res?.status === "success") {
        dispatch(setCredentials(res?.data));
        // doGetMe();
      }
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const logout = () => dispatch(logoutAction());

  const refreshProfile = async (params?: Record<string, unknown>) => {
    try {
      const res = await refreshMe(params).unwrap();
      if (res?.success) {
        dispatch(session(res.data));
      }
    } catch (err) {
      logger.error("Failed to get profile", err);
      logout();
      throw err;
    }
  };

  const updateProfile = async (payload: any) => {
    try {
      const res = await updateMeMutation(payload).unwrap();
      return res;
    } catch (error) {
      failureWithTimeout(error);
      throw error;
    }
  };

  return {
    isAuthenticated: authenticated,
    login,
    loginResult,
    refreshProfile,
    refreshResult,
    updateProfile,
    updateResult: updateMeResult,
    logout,
  };
};
