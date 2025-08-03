import axiosInstance from "@/lib/axios";
import { apiErrorHandler } from "@/utils/errorHandler";

export interface AnnotationPosition {
  x: number;
  y: number;
}

export interface Annotation {
  imageUrl: string;
  content: string;
  position: AnnotationPosition;
  width: number;
  height: number;
  pageNumber: number;
}

export interface ReviewCreateRequest {
  annotations: Annotation[];
  layers: ReviewLayer[];
}

export type ReviewerType = "STUDENT" | "TEACHER";

export interface ReviewLayer {
  imgUrl: string;
  pageNumber: number;
}

export interface ReviewDetailResponse {
  id: number;
  answerId: number;
  reviewerId: number;
  reviewerName: string;
  reviewerType: ReviewerType;
  aiReviewContent: string | null;
  createdAt: Date;
  annotations: Annotation[];
  layers: ReviewLayer[];
}

export interface CreateReviewCommentRequest {
  parentId: number | null;
  content: string;
}

export const createReviewAPI = async (
  data: ReviewCreateRequest,
  problemId: number
) => {
  try {
    await axiosInstance.post(`review/answers/${problemId}/reviews`, data);
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getReviewDetailAPI = async (reviewId: number) => {
  try {
    const res = await axiosInstance.get(`review/review-detail/${reviewId}`);
    const reviewDetail: ReviewDetailResponse = res.data;

    return reviewDetail;
  } catch (error) {
    apiErrorHandler(error);
  }
};

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
