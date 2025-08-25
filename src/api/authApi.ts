import axiosInstance from "@/lib/axios";
import { apiErrorHandler } from "@/utils/errorHandler";
import { escape } from "querystring";

export const sendRegistrationCodeAPI = async (email: string) => {
  try {
    await axiosInstance.post("auth/send-code", { email });
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const verifyRegistrationCodeAPI = async (
  email: string,
  code: string
) => {
  try {
    await axiosInstance.post("auth/verify-code", {
      email,
      code,
    });
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const signUpAPI = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    await axiosInstance.post("auth/signup", {
      email,
      password,
      username,
    });
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const loginAPI = async (email: string, password: string) => {
  try {
    await axiosInstance.post("auth/login", {
      email,
      password,
    });
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const logoutAPI = async () => {
  try {
    await axiosInstance.post("auth/logout");
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const deleteUserAPI = async () => {
  try {
    await axiosInstance.post("auth/delete-user");
  } catch (error) {
    apiErrorHandler(error);
  }
};

// Password finding APIs
export const sendPasswordFindCodeAPI = async (email: string) => {
  try {
    const res = await axiosInstance.post("/user/password/code", {
      email,
    });
    return res.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const verifyPasswordFindCodeAPI = async (
  email: string,
  code: string
) => {
  try {
    const res = await axiosInstance.post("/user/password/verify", {
      email,
      code,
    });

    return res.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const changeLostPasswordAPI = async (
  email: string,
  newPassword: string
) => {
  try {
    const res = await axiosInstance.post("/user/password/update", {
      email,
      newPassword,
    });

    return res.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};
