"use client";

import { AnswerDetailResponse, getSolutionDetailAPI } from "@/api/problemApi";
import {
  Annotation,
  createReviewAPI,
  getReviewDetailAPI,
  modifyReviewAPI,
  ReviewCreateRequest,
  ReviewDetailResponse,
  ReviewLayer,
} from "@/api/reviewApi";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ReviewEditor from "@/components/review-editor";
import { useAuth } from "@/context/auth-context";
import { binaryToFile, fileUploader } from "@/utils/fileUploader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewPage } from "../page";

export default function ReviewCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id, solutionId } = useParams();
  const reviewId = searchParams.get("reviewId");
  const { user } = useAuth();
  const problemId = Number.parseInt(id as string);
  const [solution, setSolution] = useState<AnswerDetailResponse | null>(null);
  const [review, setReview] = useState<ReviewDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(false);

  useEffect(() => {
    const getSolutionDetail = async () => {
      setIsLoading(true);
      try {
        const solutionDetail = await getSolutionDetailAPI(Number(solutionId));

        if (!solutionDetail) {
          throw new Error("solution API error");
        }

        setSolution(solutionDetail);
      } catch {
        alert("풀이 불러오기에 실패하였습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    getSolutionDetail();
  }, [solutionId]);

  useEffect(() => {
    if (!reviewId) {
      return;
    }

    const getReviewDetail = async () => {
      setIsReviewLoading(true);
      try {
        const data = await getReviewDetailAPI(Number(reviewId));

        if (!data) {
          throw new Error("reviewDetailAPI error");
        }

        setReview(data);
      } catch (error) {
        console.error(error);
        alert("리뷰 불러오기에 실패하였습니다.");
      } finally {
        setIsReviewLoading(false);
      }
    };

    getReviewDetail();
  }, [reviewId]);

  const handleSubmitReview = async (reviewPagesData: ReviewPage[]) => {
    if (!user) {
      alert("로그인 후 사용할 수 있는 기능입니다.");
      return;
    }
    if (!solution) {
      return;
    }
    const urlPrefix: string = `users/${user.id}/problems/${problemId}/answers/${solutionId}/reviews`;

    try {
      const annotations: Annotation[] = reviewPagesData.reduce(
        (
          collecter: Annotation[],
          reviewPage: ReviewPage,
          pageIndex: number
        ) => {
          const pagedAnnotations: Annotation[] = reviewPage.annotations.map(
            (prev) => ({
              ...prev,
              pageNumber: pageIndex,
            })
          );
          collecter.push(...pagedAnnotations);

          return collecter;
        },
        []
      );

      const uploadedUrls: string[] = await Promise.all(
        reviewPagesData.map(async (reviewPage: ReviewPage, index: number) => {
          const url: string = reviewPage.reviewLayer.imgUrl;
          const name: string = `${solution.userReviewSummaries.length}-${index}`;

          if (url.startsWith("https://")) {
            return url;
          } else {
            const tmpFile: File = binaryToFile(url, `review-${name}`);
            const uploadedUrl: string = (
              await fileUploader([tmpFile], urlPrefix)
            )[0];

            return uploadedUrl;
          }
        })
      );

      const uploadedBackgorundUrls: string[] = await Promise.all(
        reviewPagesData.map(async (reviewPage: ReviewPage, index: number) => {
          const url: string = reviewPage.reviewLayer.backgroundImgUrl;
          const name: string = `${solution.userReviewSummaries.length}-${index}`;

          if (url.startsWith("https://")) {
            return url;
          } else {
            const tmpFile: File = binaryToFile(url, `review-bg-${name}`);
            const uploadedUrl: string = (
              await fileUploader([tmpFile], urlPrefix)
            )[0];

            return uploadedUrl;
          }
        })
      );

      const layers: ReviewLayer[] = uploadedUrls.map(
        (url: string, index: number) => ({
          imgUrl: url,
          backgroundImgUrl: uploadedBackgorundUrls[index],
          pageNumber: index,
        })
      );
      const reviewData: ReviewCreateRequest = {
        annotations,
        layers,
      };

      if (reviewId) {
        await modifyReviewAPI(reviewData, Number(solutionId), Number(reviewId));
        alert("리뷰가 수정되었습니다.");
      } else {
        await createReviewAPI(reviewData, Number(solutionId));
        alert("리뷰가 제출되었습니다.");
      }

      router.push(`/problems/${problemId}/solutions/${solutionId}`);
    } catch (error) {
      console.error(error);
      alert("리뷰 업로드에 실패하였습니다.");
    } finally {
    }
  };

  if (
    !isLoading &&
    !isReviewLoading &&
    user &&
    review &&
    user.id !== review.reviewerId
  ) {
    router.replace("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {isLoading || !solution || isReviewLoading ? (
          <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="text-gray-500 text-lg animate-pulse">
              데이터를 불러오는 중입니다...
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href={`/problems/${problemId}/solutions/${solutionId}`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                풀이 상세로 돌아가기
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              풀이 리뷰 작성
            </h1>

            <ReviewEditor
              initialSolutionImageUrls={solution.answerImgSolutions || []}
              initialReviewDetail={review ? review : undefined}
              onSubmitReview={handleSubmitReview}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
