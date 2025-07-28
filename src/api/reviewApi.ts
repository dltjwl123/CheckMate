import axiosInstance from "@/lib/axios";
import { apiErrorHandler } from "@/utils/errorHandler";

export interface AnnotationPosition {
  x: number;
  y: number;
}

export interface Annotation {
  imageUrl: string | null;
  content: string | null;
  position: AnnotationPosition;
  width: number;
  height: number;
  index: number;
}

export interface ReviewAnnotationsRequest {
  annotations: Annotation[];
}

export const createReviewAPI = async (
  data: ReviewAnnotationsRequest,
  problemId: number
) => {
  try {
    await axiosInstance.post(`review/answers/${problemId}/reviews`, data);
  } catch (error) {
    apiErrorHandler(error);
  }
};

export type ReviewerType = "STUDENT" | "TEACHER";

export interface ReviewDetailResponse {
  id: number;
  answerId: number;
  reviewerId: number;
  reviewerName: string;
  reviewerType: ReviewerType;
  aiReviewContent: string | null;
  createdAt: string; // ISO datetime string
  annotations: Annotation[];
}

export const getReviewDetailAPI = async (reviewId: number) => {
  try {
    const res = await axiosInstance.get(`review/review-detail/${reviewId}`);
    const reviewDetail: ReviewDetailResponse = res.data;

    return reviewDetail;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export interface CreateReviewCommentRequest {
  parentId: number | null;
  content: string;
}

export const createReviewComment = async (
  data: CreateReviewCommentRequest,
  reviewId: number
) => {
  try {
    await axiosInstance.post(`review-comments/${reviewId}`);
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const deleteReviewCommentAPI = async (commentId: number) => {
  try {
    await axiosInstance.delete(`review-comments/${commentId}`);
  } catch (error) {
    apiErrorHandler(error);
  }
};
