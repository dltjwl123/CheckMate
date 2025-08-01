import axiosInstance from "@/lib/axios";
import { apiErrorHandler } from "@/utils/errorHandler";

export interface problemFilterRequest {
  title?: string;
  year?: number;
  tagName?: string;
  minAccuracyRate?: number;
  maxAccuracyRate?: number;
}

export interface Problem {
  problemId: number;
  title: string;
  year: number;
  examName: string;
  tagNames: string[];
  accuracyRate: number;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ProblemListResponse {
  content: Problem[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  sort: Sort;
  empty: boolean;
}

export interface AiReview {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
}

export interface AnswerDetailResponse {
  id: number;
  year: number;
  accuracyRate: number;
  tagNames: string[];
  problemTitle: string | null;
  username: string;
  status: "REVIEWED" | "PENDING" | "REJECTED";
  submittedAt: Date;
  answerImgSolutions: string[];
  aiReview: AiReview | null;
  userReviews: any[];
  officialSolution: string;
}

export interface ProblemTag {
  id: number;
  name: string;
}

// ISO time
export interface Answer {
  id: number;
  userId: number;
  username: string;
  answerStatus: "CORRECT" | "WRONG";
  submittedTime: Date; //ISO
}

//year, solved
export interface ProblemDetailResponse {
  id: number;
  examId: number;
  title: string;
  content: string;
  solutionImageUrl: string;
  problemImageUrl: string;
  problemImgSolutions: string[];
  submissionCount: number;
  correctSubmissionCount: number;
  accuracyRate: number;
  answer: number;
  tags: ProblemTag[];
  answers: Answer[];
  year: number;
  solved: boolean;
}

export interface submitUserSolutionRequest {
  problemId: number;
  answerImgUrls: string[];
  answer: number;
}

export const getProblemListAPI = async (
  page: number,
  size: number = 20,
  sort: string = "title,asc",
  filterData: problemFilterRequest
) => {
  try {
    const res = await axiosInstance.post("problem/filter", filterData, {
      params: {
        page,
        size,
        sort,
      },
    });
    const problemList: ProblemListResponse = res.data;

    return problemList;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getProblemDetailAPI = async (problemId: number) => {
  try {
    const res = await axiosInstance.get(`problem/detail/${problemId}`);
    const problemDetail: ProblemDetailResponse = res.data;

    return problemDetail;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getSolutionDetailAPI = async (solutionId: number) => {
  try {
    const res = await axiosInstance.get(`answer/detail/${solutionId}`);
    const data: AnswerDetailResponse = res.data;

    return data;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const submitUserSolution = async (
  reqBody: submitUserSolutionRequest
) => {
  try {
    const res = await axiosInstance.post(`answers/submit-test-list`, reqBody);
  } catch (error) {
    apiErrorHandler(error);
  }
};
