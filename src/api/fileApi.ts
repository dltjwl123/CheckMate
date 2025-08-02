import axiosInstance from "@/lib/axios";
import { apiErrorHandler } from "@/utils/errorHandler";

export const getPresignUrlAPI = async (
  fileName: string
): Promise<string | undefined> => {
  try {
    const res = await axiosInstance.get(`s3/upload-url`, {
      params: {
        filename: fileName,
      },
    });
    return res.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const uploadToS3API = async (url: string, file: File) => {
  try {
    await axiosInstance.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    apiErrorHandler(error);
  }
};
