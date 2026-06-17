import { useDispatch } from "react-redux";
import { useLoginMutation, useSignupMutation, useUpdateMeMutation } from "./api";
import { useFormActions } from "../form/hooks";
import { setCredentials, logout as logoutAction, session } from "./slice";
import type { AppDispatch } from "../store";
import type { LoginRequest, SignupRequest, ProfileUpdateRequest } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { failureWithTimeout } = useFormActions();

  const [loginMutation, loginResult] = useLoginMutation();
  const [signupMutation, signupResult] = useSignupMutation();
  const [updateMeMutation, updateMeResult] = useUpdateMeMutation();

  const login = async (payload: LoginRequest) => {
    try {
      const res = await loginMutation(payload).unwrap();
      if (res?.message === "success") {
        dispatch(setCredentials(res.data));
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const signup = async (payload: SignupRequest) => {
    try {
      const res = await signupMutation(payload).unwrap();
      if (res?.message === "success") {
        dispatch(setCredentials(res.data));
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const updateMe = async (payload: ProfileUpdateRequest) => {
    try {
      const res = await updateMeMutation(payload).unwrap();
      if (res?.message === "success") {
        dispatch(session({ user: res.data }));
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    login,
    loginResult,
    signup,
    signupResult,
    updateMe,
    updateMeResult,
    logout,
  };
};
