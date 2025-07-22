"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ReviewEditor, { ReviewPageData } from "@/components/review-editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const solutionsData = [
  {
    id: "S001",
    problemId: 1,
    submitter: "수학왕김철수",
    isCorrect: true,
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    imageUrls: [
      "/placeholder.svg?height=800&width=600&text=Solution+Page+1",
      "/placeholder.svg?height=800&width=600&text=Solution+Page+2",
      "/placeholder.svg?height=800&width=600&text=Solution+Page+3",
    ],
    aiGrading: { score: 95, feedback: "" },
    officialSolution: { available: true, content: "" },
    reviews: [],
  },
  {
    id: "S002",
    problemId: 1,
    submitter: "미적분마스터",
    isCorrect: false,
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    imageUrls: ["/placeholder.svg?height=800&width=600&text=Page+1+Error"],
    aiGrading: { score: 65, feedback: "" },
    officialSolution: { available: true, content: "" },
    reviews: [],
  },
];

export default function ReviewCreatePage() {
  const router = useRouter();
  const { id, solutionId } = useParams();
  const problemId = Number.parseInt(id as string);
  const solutionIdStr = solutionId as string;
  const solution =
    solutionsData.find((s) => s.id === solutionIdStr) || solutionsData[0];

  const handleSubmitReview = (reviewPagesData: ReviewPageData[]) => {
    console.log("리뷰 제출:", reviewPagesData);
    alert("리뷰가 제출되었습니다.");
    router.push(`/problems/${problemId}/solutions/${solutionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
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
            initialSolutionImageUrls={solution.imageUrls || []}
            onSubmitReview={handleSubmitReview}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
