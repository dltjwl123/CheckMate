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
  backgroundImgUrl: string;
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

export interface ReviewComment {
  id: number;
  authorId: number;
  authorName: string;
  profileImgUrl: string | null;
  content: string;
  createAt: string;
  parentId: number | null;
  parentAuthorName: string | null;
  children: ReviewComment[];
  isDeleted: boolean;
}

// Review
export const createReviewAPI = async (
  data: ReviewCreateRequest,
  answerId: number
) => {
  try {
    await axiosInstance.post(`review/answers/${answerId}/reviews`, data);
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const modifyReviewAPI = async (
  data: ReviewCreateRequest,
  answerId: number,
  reviewId: number
) => {
  try {
    await axiosInstance.put(
      `review/answers/${answerId}/reviews/${reviewId}`,
      data
    );
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const deleteReviewAPI = async (reviewId: number) => {
  try {
    await axiosInstance.delete(`review/reviews/${reviewId}`);
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

// Review Comment
export const getReviewCommentsAPI = async (reviewId: number) => {
  try {
    const res = await axiosInstance.get(`review-comments/${reviewId}`);
    const data: ReviewComment[] = res.data;

    return data;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const createReviewCommentAPI = async (
  reviewId: number,
  data: CreateReviewCommentRequest
) => {
  try {
    await axiosInstance.post(`review-comments/${reviewId}`, data);
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
