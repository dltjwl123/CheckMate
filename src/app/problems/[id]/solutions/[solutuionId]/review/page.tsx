"use client";

import { AnswerDetailResponse, getSolutionDetailAPI } from "@/api/problemApi";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ReviewEditor, { ReviewPageData } from "@/components/review-editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewCreatePage() {
  const router = useRouter();
  const { id, solutionId } = useParams();
  const problemId = Number.parseInt(id as string);
  const [solution, setSolution] = useState<AnswerDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  }, []);

  const handleSubmitReview = (reviewPagesData: ReviewPageData[]) => {
    console.log("리뷰 제출:", reviewPagesData);
    alert("리뷰가 제출되었습니다.");
    router.push(`/problems/${problemId}/solutions/${solutionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {isLoading || !solution ? (
          <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="text-gray-500 text-lg animate-pulse">
              문제를 불러오는 중입니다...
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
              onSubmitReview={handleSubmitReview}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
