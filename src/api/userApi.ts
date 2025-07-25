import axiosInstance from "@/lib/axios";

export const signUpApi = async (
  email: string,
  password: string,
  usernmae: string
) => {
  try {
    const res = await axiosInstance.post("auth/signup", {
      email,
      password,
      usernmae,
    });
  } catch (error) {
    console.error(error);
  }
};
