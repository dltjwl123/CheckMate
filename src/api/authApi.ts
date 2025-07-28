import axiosInstance from "@/lib/axios";
import { apiErrorHandler } from "@/utils/errorHandler";

/*
1. 이메일이 올바르지 않은 경우
*/
export const sendRegistrationCodeAPI = async (email: string) => {
  try {
    await axiosInstance.post("auth/send-code", { email });
  } catch (error) {
    apiErrorHandler(error);
  }
};

/*
1. 코드가 올바르지 않은 경우
2. 코드가 올바른 경우
*/
export const verifyRegistrationCodeAPI = async (
  email: string,
  code: string
) => {
  try {
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const signUpAPI = async (
  email: string,
  password: string,
  usernmae: string
) => {
  try {
    await axiosInstance.post("auth/signup", {
      email,
      password,
      usernmae,
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
