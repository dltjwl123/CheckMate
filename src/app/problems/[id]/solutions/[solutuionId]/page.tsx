"use client";

import {
  AnswerDetailResponse,
  getProblemDetailAPI,
  getSolutionDetailAPI,
  ProblemDetailResponse,
} from "@/api/problemApi";
import { ReviewDetailResponse } from "@/api/reviewApi";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Badge from "@/components/ui/badge";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelativeTime } from "@/utils/time";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  Check,
  MessagesSquare,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 샘플 문제 데이터
const problemsData = [
  {
    id: 1,
    year: "2024",
    title: "9월 모의고사 미분과 적분 30번",
    correctRate: 23.5,
    tags: ["미적분학", "극한"],
  },
  {
    id: 2,
    year: "2024",
    title: "6월 모의고사 확률과 통계 28번",
    correctRate: 45.2,
    tags: ["확률", "통계"],
  },
  {
    id: 3,
    year: "2023",
    title: "수능 기하 29번",
    correctRate: 18.7,
    tags: ["기하학", "공간도형"],
  },
];

// 샘플 풀이 데이터 (imageUrls를 배열로 변경, reviews 추가)
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
    aiGrading: {
      score: 95,
      feedback: `이 풀이는 매우 우수합니다. 주요 평가 내용은 다음과 같습니다:

**정답 여부**: ✅ 정답

**풀이 과정 분석**:
1. **함수의 연속성 확인** (25/25점)
   - $\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^+} f(x) = f(2)$ 조건을 올바르게 적용
   - 좌극한과 우극한을 정확히 계산

2. **미분가능성 조건** (25/25점)  
   - $\\lim_{h \\to 0^-} \\frac{f(2+h) - f(2)}{h} = \\lim_{h \\to 0^+} \\frac{f(2+h) - f(2)}{h}$ 조건 활용
   - 좌미분계수와 우미분계수가 같음을 확인

3. **연립방정식 해결** (20/25점)
   - $a$와 $b$의 값을 구하는 과정이 체계적
   - 계산 실수 없이 정확한 답 도출

4. **최종 답안** (25/25점)
   - $a = 4, b = -4$ 정답
   - $a + b = 0$ 최종 답안 정확

**개선점**:
- 중간 계산 과정에서 더 자세한 설명이 있으면 좋겠습니다
- 그래프를 그려서 시각적으로 설명하면 더욱 완벽할 것 같습니다

**총평**: 미분과 적분의 기본 개념을 정확히 이해하고 있으며, 체계적인 접근 방식이 돋보입니다.`,
    },
    officialSolution: {
      available: true,
      content: `**공식 풀이**

이 문제는 함수의 연속성과 미분가능성을 동시에 만족하는 조건을 찾는 문제입니다.

**1단계: 연속성 조건**

$x = 2$에서 연속이려면:
$$\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^+} f(x) = f(2)$$

좌극한: $\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^-} (ax + b) = 2a + b$

우극한: $\\lim_{x \\to 2^+} f(x) = \\lim_{x \\to 2^+} x^2 = 4$

함수값: $f(2) = 2^2 = 4$

따라서: $2a + b = 4$ ... ①

**2단계: 미분가능성 조건**

$x = 2$에서 미분가능하려면:
$$\\lim_{h \\to 0^-} \\frac{f(2+h) - f(2)}{h} = \\lim_{h \\to 0^+} \\frac{f(2+h) - f(2)}{h}$$

좌미분계수: $\\lim_{h \\to 0^-} \\frac{a(2+h) + b - 4}{h} = \\lim_{h \\to 0^-} \\frac{2a + ah + b - 4}{h} = a$

우미분계수: $\\lim_{h \\to 0^+} \\frac{(2+h)^2 - 4}{h} = \\lim_{h \\to 0^+} \\frac{4 + 4h + h^2 - 4}{h} = 4$

따라서: $a = 4$ ... ②

**3단계: 연립방정식 해결**

①, ②에서:
- $a = 4$
- $2(4) + b = 4$
- $8 + b = 4$
- $b = -4$

**최종 답안**: $a + b = 4 + (-4) = 0$`,
    },
    reviews: [
      {
        reviewer: "리뷰어1",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
        pages: [
          {
            backgroundImageUrl:
              "/placeholder.svg?height=800&width=600&text=Solution+Page+1",
            drawingData:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0EAwImjAAH9PVGYQb/sAAAAASUVORK5CYII=", // A tiny red dot base64 image for demo
            textBoxes: [
              {
                id: "text1",
                x: 50,
                y: 100,
                width: 200,
                height: 50,
                content: "여기에 중요한 개념이 있습니다!",
              },
              {
                id: "text2",
                x: 150,
                y: 250,
                width: 180,
                height: 40,
                content: "이 부분은 다시 확인해 보세요.",
              },
            ],
          },
          {
            backgroundImageUrl:
              "/placeholder.svg?height=800&width=600&text=Solution+Page+2",
            drawingData: "",
            textBoxes: [
              {
                id: "text3",
                x: 80,
                y: 120,
                width: 150,
                height: 30,
                content: "잘 풀었습니다!",
              },
            ],
          },
        ],
      },
      {
        reviewer: "리뷰어2",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
        pages: [
          {
            backgroundImageUrl:
              "/placeholder.svg?height=800&width=600&text=Solution+Page+1",
            drawingData: "",
            textBoxes: [
              {
                id: "text4",
                x: 20,
                y: 20,
                width: 100,
                height: 30,
                content: "깔끔한 풀이네요.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "S002",
    problemId: 1,
    submitter: "미적분마스터",
    isCorrect: false,
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    imageUrls: ["/placeholder.svg?height=800&width=600&text=Page+1+Error"],
    aiGrading: {
      score: 65,
      feedback: `이 풀이에는 몇 가지 오류가 있습니다.

**정답 여부**: ❌ 오답

**풀이 과정 분석**:
1. **함수의 연속성 확인** (20/25점)
   - 연속성 조건은 올바르게 설정했습니다
   - $2a + b = 4$ 식을 정확히 도출

2. **미분가능성 조건** (15/25점)  
   - 미분가능성의 개념은 이해하고 있으나 계산에 오류
   - 좌미분계수 계산에서 실수 발생
   - $\\lim_{h \\to 0^-} \\frac{f(2+h) - f(2)}{h}$를 잘못 계산

3. **연립방정식 해결** (15/25점)
   - 잘못된 미분계수로 인해 연립방정식이 틀림
   - $a = 2$로 잘못 계산 (정답: $a = 4$)

4. **최종 답안** (15/25점)
   - $a = 2, b = 0$으로 계산
   - $a + b = 2$ (정답: $0$)

**주요 오류**:
- 미분의 정의를 적용할 때 극한 계산 실수
- $(2+h)^2$을 전개할 때 계산 오류

**개선 방향**:
- 미분의 정의를 다시 복습하세요
- 극한 계산을 더 신중하게 진행하세요
- 중간 검산을 통해 오류를 줄이세요`,
    },
    officialSolution: {
      available: true,
      content: `**공식 풀이**

이 문제는 함수의 연속성과 미분가능성을 동시에 만족하는 조건을 찾는 문제입니다.

**1단계: 연속성 조건**

$x = 2$에서 연속이려면:
$$\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^+} f(x) = f(2)$$

좌극한: $\\lim_{x \\to 2^-} f(x) = \\lim_{x \\to 2^-} (ax + b) = 2a + b$

우극한: $\\lim_{x \\to 2^+} f(x) = \\lim_{x \\to 2^+} x^2 = 4$

함수값: $f(2) = 2^2 = 4$

따라서: $2a + b = 4$ ... ①

**2단계: 미분가능성 조건**

$x = 2$에서 미분가능하려면:
$$\\lim_{h \\to 0^-} \\frac{f(2+h) - f(2)}{h} = \\lim_{h \\to 0^+} \\frac{f(2+h) - f(2)}{h}$$

좌미분계수: $\\lim_{h \\to 0^-} \\frac{a(2+h) + b - 4}{h} = \\lim_{h \\to 0^-} \\frac{2a + ah + b - 4}{h} = a$

우미분계수: $\\lim_{h \\to 0^+} \\frac{(2+h)^2 - 4}{h} = \\lim_{h \\to 0^+} \\frac{4 + 4h + h^2 - 4}{h} = 4$

따라서: $a = 4$ ... ②

**3단계: 연립방정식 해결**

①, ②에서:
- $a = 4$
- $2(4) + b = 4$
- $8 + b = 4$
- $b = -4$

**최종 답안**: $a + b = 4 + (-4) = 0$`,
    },
    reviews: [], // 리뷰가 없는 경우
  },
];

export default function SolutionsDetailPage() {
  const { id, solutionId } = useParams();
  const problemId = Number.parseInt(id as string);
  const solutuionIdStr = solutionId as string;
  const [problem, setProblem] = useState<ProblemDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [solution, setSolution] = useState<AnswerDetailResponse | null>(null);
  const [isSolutionLoading, setIsSolutionLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    "submitted" | "aiGrading" | "official" | "review"
  >("submitted");
  const [activeSubmittedImageIndex, setActiveSubmittedImageIndex] =
    useState<number>(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);
  const [activeReviewPageIndex, setActiveReviewPageIndex] = useState<number>(0);

  useEffect(() => {
    const getProblemDetail = async () => {
      setIsLoading(true);
      try {
        const problemDetail = await getProblemDetailAPI(problemId);

        if (!problemDetail) {
          throw "error";
        }

        setProblem(problemDetail);
      } catch {
        alert("문제 불러오기에 실패하였습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    getProblemDetail();
  }, [id]);

  useEffect(() => {
    const getSolutionDetail = async () => {
      if (!problem) {
        return;
      }

      setIsSolutionLoading(true);
      try {
        const solutionDetail = await getSolutionDetailAPI(
          problem.answers[0].id // TODO: 다중 answer 처리
        );
        if (!solutionDetail) {
          throw "error";
        }
      } catch {
        alert("풀이 불러오기에 실패하였습니다.");
      } finally {
        setIsSolutionLoading(false);
      }
    };

    getSolutionDetail();
  }, [problem]);

  if (isLoading || !problem || isSolutionLoading || !solution) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-gray-500 text-lg animate-pulse">
          문제를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href={`/problems/${problemId}/solutions`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            풀이 목록으로 돌아가기
          </Link>
        </div>

        {/* Problem header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{problem.year}</span>
                  <span>•</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      problem.accuracyRate < 30
                        ? "bg-red-100 text-red-800"
                        : problem.accuracyRate < 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    정답률 {problem.accuracyRate}%
                  </span>
                </div>
                <CardTitle className="text-2xl mb-2">{problem.title}</CardTitle>
                <div className="flex flex-wrap gap-1 mb-4">
                  {problem.tags.map((tag) => (
                    <Badge key={tag.name} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                {/* 풀이 정보 */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{solution.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {solution.status === "REVIEWED" ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">정답</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">오답</span>
                      </>
                    )}
                  </div>
                  <span>{getRelativeTime(solution.submittedAt)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Solution Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "submitted"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("submitted")}
          >
            제출된 풀이
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "aiGrading"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("aiGrading")}
          >
            AI 채점 결과
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "official"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("official")}
          >
            공식 풀이
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "review"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("review")}
          >
            리뷰 ({solution.userReviews?.length || 0})
          </button>
        </div>

        {/* Active Tab Content */}
        {activeTab === "submitted" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                제출된 풀이
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Page Preview */}
              {solution.answerImgSolutions &&
                solution.answerImgSolutions.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {solution.answerImgSolutions.map((img, index) => (
                      <div
                        key={index}
                        className={`relative w-20 h-20 border
                        rounded-md overflow-hidden cursor-pointer
                        ${
                          activeSubmittedImageIndex === index
                            ? "border-blue-500 ring-2 ring-blue-500"
                            : "border-gray-200"
                        }`}
                        onClick={() => setActiveSubmittedImageIndex(index)}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Solution Page ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md"
                        />
                        <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tl-md">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 border-b border-gray-200">
                  {solution.username}님의 풀이 ({solution.id})
                  {solution.answerImgSolutions &&
                    solution.answerImgSolutions.length > 0 &&
                    ` (페이지 ${activeSubmittedImageIndex + 1} / ${
                      solution.answerImgSolutions.length
                    })`}
                </div>
                <div className="flex justify-center p-4">
                  <Image
                    src={
                      solution.answerImgSolutions?.[
                        activeSubmittedImageIndex
                      ] || "/placeholder.svg"
                    }
                    alt={`Solution Page ${activeSubmittedImageIndex + 1}`}
                    width={600}
                    height={800}
                    className="max-w-full h-auto rounded shadow-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "aiGrading" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-600" />
                AI 채점 결과
                <Badge
                  variant={
                    solution.status === "REVIEWED" ? "default" : "outline"
                  }
                  className={
                    solution.status === "REVIEWED"
                      ? "bgf-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {solution.aiReview!.rating}점
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div
                  className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: solution
                      .aiReview!.content.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      )
                      .replace(
                        /\$\$(.*?)\$\$/g,
                        `<span class="font-mono bg-gray-100 px-1 rounded">$1</span>`
                      )
                      .replace(
                        /\$(.*?)\$/g,
                        `<span class="font-mono bg-gray-100 px-1 rounded">$1</span>`
                      ),
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "official" && solution.officialSolution && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                공식 풀이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div
                  className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: solution.officialSolution
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(
                        /\$\$(.*?)\$\$/g,
                        `<div class="my-4 p-3 bg-blue-50 border-l-4 border-blue-400 font-mono text-center">$1</div>`
                      )
                      .replace(
                        /\$(.*?)\$/g,
                        `<span class="font-mono bg-gray-100 px-1 rounded">$1</span>`
                      ),
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "review" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5 text-purple-600" />
                리뷰
              </CardTitle>
            </CardHeader>
            <CardContent>
              {solution.userReviews && solution.userReviews.length > 0 ? (
                <>
                  {/* Dropdown */}
                  <div className="mb-4">
                    <label htmlFor="review-select" className="sr-only">
                      리뷰 선택
                    </label>
                    <select
                      id="review-select"
                      value={activeReviewIndex}
                      onChange={(e) => {
                        setActiveReviewIndex(Number(e.target.value));
                        setActiveReviewPageIndex(0);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {solution.userReviews.map((review, index) => (
                        <option key={index} value={index}>
                          {review.reviewer}님의 리뷰 (
                          {getRelativeTime(review.submittedAt)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Review Preview */}
                  {solution.userReviews[activeReviewIndex]?.pages &&
                    solution.userReviews[activeReviewIndex].pages.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {solution.userReviews[activeReviewIndex].pages.map(
                          (page, index) => (
                            <div
                              key={index}
                              className={`relative w-20 h-20 border rounded-md overflow-hidden cursor-pointer
                  ${
                    activeReviewPageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-gray-200"
                  }`}
                              onClick={() => setActiveReviewPageIndex(index)}
                            >
                              <Image
                                src={
                                  page.backgroundImageUrl || "/placeholder.svg"
                                }
                                alt={`Review Page ${index + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-md"
                              />
                              <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tl-md">
                                {index + 1}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* Review Content */}
                  {solution.reviews[activeReviewIndex]?.pages?.[
                    activeReviewPageIndex
                  ] ? (
                    <div className="relative bg-white rounded-md overflow-hidden border border-gray-200">
                      <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 border-b border-gray-200">
                        {solution.reviews[activeReviewIndex].reviewer}님의 리뷰
                        {solution.reviews[activeReviewIndex].pages.length > 1 &&
                          ` (페이지 ${activeReviewPageIndex + 1} / ${
                            solution.reviews[activeReviewIndex].pages.length
                          })`}
                      </div>
                      <div className="flex justify-center p-4">
                        {/* Background Image */}
                        <Image
                          src={
                            solution.reviews[activeReviewIndex].pages[
                              activeReviewPageIndex
                            ].backgroundImageUrl || "/placeholder.svg"
                          }
                          alt={`Review Page ${activeReviewPageIndex + 1}`}
                          width={600}
                          height={800}
                          className="max-w-full h-auto rounded shadow-sm"
                        />
                      </div>
                      {/* Review Layer */}
                      {solution.reviews[activeReviewIndex].pages[
                        activeReviewPageIndex
                      ].drawingData && (
                        <Image
                          src={
                            solution.reviews[activeReviewIndex].pages[
                              activeReviewPageIndex
                            ].drawingData || "/placeholder.svg"
                          }
                          alt={`Drawing Data for Review Page ${
                            activeReviewPageIndex + 1
                          }`}
                          width={600}
                          height={800}
                          className="absolute top-4 left-1/2 -translate-x-1/2 max-w-full h-auto rounded"
                          style={{ pointerEvents: "none" }}
                        />
                      )}
                      {/* Text Boxes */}
                      {solution.reviews[activeReviewIndex].pages[
                        activeReviewPageIndex
                      ].textBoxes?.map((textBox) => (
                        <div
                          key={textBox.id}
                          className="absolute bg-yellow-100 bg-opacity-70
                border border-yellow-400 rounded p-2 text-sm text-gray-800 overflow-hidden"
                          style={{
                            left: `${textBox.x}px`,
                            top: `${textBox.y}px`,
                            width: `${textBox.width}px`,
                            height: `${textBox.height}px`,
                          }}
                        >
                          {textBox.content}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      선택한 리뷰 페이지에 내용이 없습니다.
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  아직 이 풀이에 대한 리뷰가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
