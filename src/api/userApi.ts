import axiosInstance from "@/lib/axios";
import { apiErrorHandler } from "@/utils/errorHandler";

export type UserType = "STUDENT" | "TEACHER";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  userType: UserType;
  profileImageUrl: string;
}

export const getUserDataAPI = async () => {
  try {
    const res = await axiosInstance.get(`user/my-page/user-data`);
    const userProfile: UserProfile = res.data;

    return userProfile;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export type AnswerStatus = "REVIEWED" | "PENDING";

export interface AnswerSummary {
  answerId: number;
  problemId: number;
  problemTitle: string | null;
  likeCount: number;
  submittedAt: string; // ISO
  status: AnswerStatus;
}

export type MyAnswerSummaryListResponse = AnswerSummary[];

export interface ReviewSummary {
  reviewId: number;
  problemId: number;
  answerId: number;
  targetName: string;
  problemTitle: string;
  createdAt: string;
}

export type myReviewSummaryListResponse = ReviewSummary[];

export const getMyAnswerListAPI = async () => {
  try {
    const res = await axiosInstance.get(`user/my-page/answer-data`);
    const answerList: MyAnswerSummaryListResponse = res.data;

    return answerList;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getMyReviewListAPI = async () => {
  try {
    const res = await axiosInstance.get(`user/my-page/review-data`);
    const reviewList: myReviewSummaryListResponse = res.data;

    return reviewList;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export interface UpdateUserProfileRequest {
  userName?: string;
  profileImgUrl?: string;
}

// 업데이트 된 프로필을 response로 받아서 재확인 하는 절차 필요
export const updateUserProfileAPI = async (data: UpdateUserProfileRequest) => {
  try {
    await axiosInstance.post("user/my-page/profile-update", data);
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const updateUserPasswordAPI = async (newPassword: string) => {
  try {
    await axiosInstance.post("user/my-page/password-update", {
      newPassword,
    });
  } catch (erorr) {
    apiErrorHandler(erorr);
  }
};
