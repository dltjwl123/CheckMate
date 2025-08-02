"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { getRelativeTime } from "@/utils/time";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 샘플 문제 데이터 (문제 상세 페이지와 동일)
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
  {
    id: 4,
    year: "2024",
    title: "3월 모의고사 수학II 27번",
    correctRate: 67.3,
    tags: ["함수", "그래프"],
  },
  {
    id: 5,
    year: "2023",
    title: "수능 수학I 26번",
    correctRate: 52.8,
    tags: ["삼각함수", "방정식"],
  },
];

// 샘플 풀이 데이터 (리뷰 포함)
const solutionsData = [
  {
    id: "S001",
    problemId: 1,
    submitter: "수학왕김철수",
    isCorrect: true,
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reviews: [
      {
        reviewer: "리뷰어1",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
        pages: [],
      },
      {
        reviewer: "수학왕김철수", // 로그인 유저가 작성한 리뷰 예시
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
        pages: [],
      },
    ],
  },
  {
    id: "S002",
    problemId: 1,
    submitter: "미적분마스터",
    isCorrect: false,
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    reviews: [],
  },
  {
    id: "S003",
    problemId: 3,
    submitter: "기하학전문가",
    isCorrect: true,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reviews: [
      {
        reviewer: "수학왕김철수", // 로그인 유저가 작성한 리뷰 예시
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
        pages: [],
      },
    ],
  },
  {
    id: "S004",
    problemId: 2,
    submitter: "수학왕김철수",
    isCorrect: true,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reviews: [
      {
        reviewer: "미적분마스터", // 다른 유저가 작성한 리뷰
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        pages: [],
      },
      {
        reviewer: "수학왕김철수", // 로그인 유저가 작성한 리뷰 예시
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        pages: [],
      },
    ],
  },
  {
    id: "S005",
    problemId: 4,
    submitter: "미적분마스터",
    isCorrect: false,
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    reviews: [
      {
        reviewer: "수학왕김철수", // 로그인 유저가 작성한 리뷰 예시
        submittedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        pages: [],
      },
    ],
  },
  {
    id: "S006",
    problemId: 5,
    submitter: "기하학전문가",
    isCorrect: true,
    submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    reviews: [
      {
        reviewer: "미적분마스터", // 로그인 유저가 작성한 리뷰 예시
        submittedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        pages: [],
      },
    ],
  },
];

export default function MyReviewPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const myReviews = solutionsData.flatMap((solution) =>
    solution.reviews
      .filter((review) => review.reviewer === user?.username)
      .map((review) => ({
        ...review,
        solutionId: solution.id,
        problemId: solution.problemId,
        solutionSubmitter: solution.submitter,
      }))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            내 리뷰 목록
          </h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                내가 작성한 리뷰
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myReviews.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  아직 작성한 리뷰가 없습니다. <br />
                  <Link
                    href={"/problems"}
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    문제 풀이 보러 가기
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">리뷰 대상</TableHead>
                      <TableHead>문제 제목</TableHead>
                      <TableHead className="w-32 text-right">
                        작성 시간
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myReviews.map((review, index) => {
                      const problem = problemsData.find(
                        (p) => p.id === review.problemId
                      );

                      return (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/problems/${review.problemId}/solutions/${review.solutionId}`
                            );
                          }}
                        >
                          <TableCell className="font-medium text-gray-900">
                            {review.solutionSubmitter} 님의 풀이
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {problem!.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-gray-500">
                            {getRelativeTime(review.submittedAt)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
