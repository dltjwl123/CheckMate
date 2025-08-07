"use client";

import {
  AnswerDetailResponse,
  getProblemDetailAPI,
  getSolutionDetailAPI,
  ProblemDetailResponse,
} from "@/api/problemApi";
import {
  Annotation,
  deleteReviewAPI,
  getReviewDetailAPI,
  ReviewLayer,
} from "@/api/reviewApi";
import { CommentSection } from "@/components/comment";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelativeTime } from "@/utils/time";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  Check,
  Edit,
  MessageSquare,
  MessagesSquare,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface ReviewPage {
  annotations: Annotation[];
  reviewLayer: ReviewLayer;
  pageNumber: number;
}

interface ReviewData {
  id: number;
  answerId: number;
  reviewerName: string;
  reviwerType: "STUDENT" | "TEACHER" | "AI";
  createdAt: Date;
  reviewPages: ReviewPage[];
}

export default function SolutionsDetailPage() {
  const { id, solutionId } = useParams();
  const problemId = Number.parseInt(id as string);
  const [problem, setProblem] = useState<ProblemDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [solution, setSolution] = useState<AnswerDetailResponse | null>(null);
  const [isSolutionLoading, setIsSolutionLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "submitted" | "aiGrading" | "official" | "review"
  >("submitted");
  const [activeSubmittedImageIndex, setActiveSubmittedImageIndex] =
    useState<number>(0);
  const [reviewrIndex, setReviewrIndex] = useState<number>(0);
  const [activeReviewPageIndex, setActiveReviewPageIndex] = useState<number>(0);
  const [reviewDataList, setReviewDataList] = useState<(ReviewData | null)[]>(
    []
  );
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [reviewPages, setReviewPages] = useState<ReviewPage[] | null>(null);
  const [activeOfficialImageIndex, setActiveOfficialImageIndex] =
    useState<number>(0);

  const handleDeleteReview = async () => {
    if (!selectedReviewId) {
      return;
    }

    const result: boolean = confirm("정말로 리뷰를 삭제하시겠습니까?");

    if (!result) {
      return;
    }

    try {
      await deleteReviewAPI(selectedReviewId);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

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
  }, [problemId]);

  useEffect(() => {
    const getSolutionDetail = async () => {
      if (!problem) {
        return;
      }

      setIsSolutionLoading(true);
      try {
        const solutionDetail = await getSolutionDetailAPI(
          problem.answers[0].id
        );

        if (!solutionDetail) {
          throw new Error("solution API error");
        }

        setSolution(solutionDetail);

        const userRievewNumber: number =
          solutionDetail.userReviewSummaries.length;
        const nullArray: null[] = Array(userRievewNumber).fill(null);
        setReviewDataList(nullArray);
        setSelectedReviewId(
          solutionDetail.userReviewSummaries.length > 0 &&
            solutionDetail.userReviewSummaries[0].id !== undefined
            ? solutionDetail.userReviewSummaries[0].id
            : null
        );
      } catch (error) {
        console.error(error);
        alert("풀이 불러오기에 실패하였습니다.");
      } finally {
        setIsSolutionLoading(false);
      }
    };

    getSolutionDetail();
  }, [problem]);

  useEffect(() => {
    if (reviewDataList[reviewrIndex] !== null || !selectedReviewId) {
      return;
    }

    const getReviewPages = async () => {
      try {
        const data = await getReviewDetailAPI(selectedReviewId);

        if (!data) {
          throw new Error("get review error");
        }
        const reviewPages: ReviewPage[] = data.layers.map((layer) => ({
          pageNumber: layer.pageNumber,
          reviewLayer: layer,
          annotations: data.annotations.filter(
            (annotation) => annotation.pageNumber === layer.pageNumber
          ),
        }));
        reviewPages.sort((a: ReviewPage, b: ReviewPage) => {
          return a.pageNumber - b.pageNumber;
        });

        setReviewDataList((prev) =>
          prev.map((prevData, index) =>
            index === reviewrIndex
              ? {
                  id: data.id,
                  answerId: data.answerId,
                  createdAt: data.createdAt,
                  reviewerName: data.reviewerName,
                  reviwerType: data.reviewerType,
                  reviewPages: reviewPages,
                }
              : prevData
          )
        );
        setSelectedReviewId(null);
      } catch {
        alert("리뷰 데이터 불러오기에 실패하였습니다.");
      }
    };

    getReviewPages();
  }, [reviewrIndex, selectedReviewId, reviewDataList]);

  useEffect(() => {
    if (reviewDataList[reviewrIndex]) {
      setReviewPages(reviewDataList[reviewrIndex].reviewPages);
      setSelectedReviewId(reviewDataList[reviewrIndex].id);
    }
  }, [reviewDataList, reviewrIndex]);

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
            리뷰 ({solution.userReviewSummaries?.length || 0})
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
                        className={`relative w-40 aspect-[3/4] border
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
                          style={{ objectFit: "contain" }}
                          className="rounded-md"
                        />
                        <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tl-md">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Answer Main */}
              <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 border-b border-gray-200">
                  {solution.username}님의 풀이 ({solution.id})
                  {solution.answerImgSolutions &&
                    solution.answerImgSolutions.length > 0 &&
                    ` (페이지 ${activeSubmittedImageIndex + 1} / ${
                      solution.answerImgSolutions.length
                    })`}
                </div>
                <div className="flex justify-center">
                  <div className="relative w-[600px] h-[800px] bg-white rounded shadow-sm overflow-hidden">
                    <Image
                      src={
                        solution.answerImgSolutions?.[
                          activeSubmittedImageIndex
                        ] || "/placeholder.svg"
                      }
                      alt={`Solution Page ${activeSubmittedImageIndex + 1}`}
                      fill
                      className="object-contain"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
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
                {/* <Badge
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
                </Badge> */}
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

        {activeTab === "official" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                공식 풀이
              </CardTitle>
            </CardHeader>
            <CardContent>
              {problem.problemImgSolutions &&
              problem.problemImgSolutions.length > 0 ? (
                <>
                  {/* Preview */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {problem.problemImgSolutions.map((imgUrl, index) => (
                      <div
                        key={index}
                        className={`relative w-40 aspect-[3/4] border rounded-md overflow-hidden cursor-pointer ${
                          activeOfficialImageIndex === index
                            ? "border-blue-500 ring-2 ring-blue-500"
                            : "border-gray-200"
                        }`}
                        onClick={() => setActiveOfficialImageIndex(index)}
                      >
                        <Image
                          src={imgUrl || "/placeholder.svg"}
                          alt={`공식 풀이 썸네일 ${index + 1}`}
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-md"
                        />
                        <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tl-md">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                    <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 border-b border-gray-200">
                      공식 풀이 이미지 (페이지 {activeOfficialImageIndex + 1} /{" "}
                      {problem.problemImgSolutions.length})
                    </div>
                    <div className="flex justify-center">
                      <div className="relative w-[600px] h-[800px] bg-white rounded shadow-sm overflow-hidden">
                        <Image
                          src={
                            problem.problemImgSolutions[
                              activeOfficialImageIndex
                            ] || "/placeholder.svg"
                          }
                          alt={`공식 풀이 페이지 ${
                            activeOfficialImageIndex + 1
                          }`}
                          fill
                          className="object-contain"
                          style={{ objectPosition: "center" }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  아직 공식 풀이가 없습니다.
                </div>
              )}
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
              {solution.userReviewSummaries &&
              solution.userReviewSummaries.length > 0 ? (
                <>
                  {/* Dropdown */}
                  <div className="mb-4">
                    <label htmlFor="review-select" className="sr-only">
                      리뷰 선택
                    </label>
                    <select
                      id="review-select"
                      value={reviewrIndex}
                      onChange={(e) => {
                        const selectedIndex = Number(e.target.value);
                        const selectedReview =
                          solution.userReviewSummaries.find(
                            (_, index) => index === selectedIndex
                          );

                        if (selectedReview) {
                          setSelectedReviewId(selectedReview.id);
                        }
                        setReviewrIndex(selectedIndex);
                        setActiveReviewPageIndex(0);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {solution.userReviewSummaries.map((review, index) => (
                        <option key={index} value={index}>
                          {review.reviewerName}님의 리뷰 (
                          {getRelativeTime(review.createdAt)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Review Preview */}
                  {reviewPages && reviewPages.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {reviewPages.map((reviewPage, index) => (
                        <div
                          key={reviewPage.pageNumber}
                          className={`relative w-40 aspect-[3/4] border rounded-md overflow-hidden cursor-pointer
                  ${
                    activeReviewPageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-gray-200"
                  }`}
                          onClick={() => setActiveReviewPageIndex(index)}
                        >
                          <Image
                            src={
                              reviewPage.reviewLayer.backgroundImgUrl ||
                              "/placeholder.svg"
                            }
                            alt={`Review Page Background ${index + 1}`}
                            fill
                            style={{
                              objectFit: "contain",
                            }}
                            className="rounded-md"
                          />
                          <Image
                            src={
                              reviewPage.reviewLayer.imgUrl ||
                              "/placeholder.svg"
                            }
                            alt={`Review Page ${index + 1}`}
                            fill
                            style={{
                              objectFit: "contain",
                              objectPosition: "top center",
                            }}
                            className="rounded-md"
                          />
                          <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tl-md">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review Content */}
                  {reviewDataList[reviewrIndex] !== null &&
                  reviewPages &&
                  reviewPages[activeReviewPageIndex] ? (
                    <div className="relative bg-white rounded-md overflow-hidden border border-gray-200">
                      <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 border-b border-gray-200">
                        {reviewDataList[reviewrIndex].reviewerName}님의 리뷰
                        {reviewPages[activeReviewPageIndex].annotations.length >
                          1 &&
                          ` (페이지 ${activeReviewPageIndex + 1} / ${
                            reviewPages[activeReviewPageIndex].annotations
                              .length
                          })`}
                      </div>

                      <div className="flex justify-center">
                        {/* Background Image */}
                        <div className="relative w-[600px] h-[800px] bg-white rounded shadow-sm overflow-hidden">
                          <Image
                            src={
                              reviewPages[activeReviewPageIndex].reviewLayer
                                .backgroundImgUrl || "/placeholder.svg"
                            }
                            alt={`Review Page ${activeReviewPageIndex + 1}`}
                            fill
                            className="object-contain"
                            style={{ objectPosition: "center" }}
                          />

                          {/* Review Layer */}
                          {reviewPages[activeReviewPageIndex] && (
                            <Image
                              src={
                                reviewPages[activeReviewPageIndex].reviewLayer
                                  .imgUrl || "/placeholder.svg"
                              }
                              alt={`Drawing Data for Review Page ${
                                activeReviewPageIndex + 1
                              }`}
                              fill
                              className="object-contain"
                              style={{
                                pointerEvents: "none",
                                objectPosition: "center",
                              }}
                            />
                          )}

                          {/* Text Boxes */}
                          {reviewPages[activeReviewPageIndex].annotations.map(
                            (annotation, index) => (
                              <div
                                key={index}
                                className="absolute bg-yellow-100 bg-opacity-70
                border border-yellow-400 rounded p-2 text-sm text-gray-800 overflow-hidden"
                                style={{
                                  left: `${annotation.position.x}px`,
                                  top: `${annotation.position.y}px`,
                                  width: `${annotation.width}px`,
                                  height: `${annotation.height}px`,
                                }}
                              >
                                {annotation.content}
                              </div>
                            )
                          )}
                        </div>
                      </div>
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

            {/* Review Edit Buttons */}
            <div className="mb-4 mr-8 text-right space-x-2">
              <Link
                href={`/problems/${problemId}/solutions/${solutionId}/review?reviewId=${selectedReviewId}`}
              >
                <Button className="flex items-center gap-2 ml-auto">
                  <Edit className="h-4 w-4" />
                  리뷰 수정
                </Button>
              </Link>
              <Button
                onClick={handleDeleteReview}
                className="flex items-center gap-2 ml-auto bg-red-500 hover:bg-red-700"
              >
                <X className="h-4 w-4" />
                리뷰 삭제
              </Button>
            </div>

            <CardContent>
              {reviewDataList[reviewrIndex]?.id && (
                <CommentSection reviewId={reviewDataList[reviewrIndex].id} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Review Button */}
        <div className="mt-8 text-right space-x-2">
          <Link href={`/problems/${problemId}/solutions/${solutionId}/review`}>
            <Button className="flex items-center gap-2 ml-auto">
              <MessageSquare className="h-4 w-4" />
              리뷰 작성
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
