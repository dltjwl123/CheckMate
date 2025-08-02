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
import { BookOpen, Check, X } from "lucide-react";
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

// 샘플 풀이 데이터 (solutionId는 string으로 유지)
const solutionsData = [
  {
    id: "S001",
    problemId: 1,
    submitter: "수학왕김철수",
    isCorrect: true,
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
  },
  {
    id: "S002",
    problemId: 1,
    submitter: "미적분마스터",
    isCorrect: false,
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
  },
  {
    id: "S003",
    problemId: 3,
    submitter: "기하학전문가",
    isCorrect: true,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
  },
  {
    id: "S004",
    problemId: 2,
    submitter: "수학왕김철수", // 로그인 유저의 풀이 예시
    isCorrect: true,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
  },
  {
    id: "S005",
    problemId: 1,
    submitter: "수학초보자",
    isCorrect: false,
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1주일 전
  },
  {
    id: "S006",
    problemId: 4,
    submitter: "수학왕김철수", // 추가 더미 데이터
    isCorrect: false,
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10일 전
  },
  {
    id: "S007",
    problemId: 5,
    submitter: "미적분마스터", // 추가 더미 데이터
    isCorrect: true,
    submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15일 전
  },
  {
    id: "S008",
    problemId: 1,
    submitter: "수학왕김철수", // 추가 더미 데이터
    isCorrect: true,
    submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20일 전
  },
  {
    id: "S009",
    problemId: 2,
    submitter: "기하학전문가", // 추가 더미 데이터
    isCorrect: false,
    submittedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25일 전
  },
  {
    id: "S010",
    problemId: 3,
    submitter: "수학왕김철수", // 추가 더미 데이터
    isCorrect: true,
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
  },
];

export default function MySolutionsPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  const mySolutins = solutionsData.filter(
    (solution) => solution.submitter === user?.username
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg-px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            내 풀이 목록
          </h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                내가 제출한 풀이
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mySolutins.length === 0 ? (
                <div className="text-center text-gary-500 py-8">
                  아직 제출한 풀이가 없습니다. <br />
                  <Link
                    href={"/problems"}
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    문제 풀러 가기
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">제출번호</TableHead>
                      <TableHead>문제 제목</TableHead>
                      <TableHead className="w-24 text-center">
                        정답여부
                      </TableHead>
                      <TableHead className="w-32 text-right">
                        제출시간
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mySolutins.map((solution) => {
                      const problem = problemsData.find(
                        (p) => p.id === solution.problemId
                      );

                      return (
                        <TableRow
                          key={solution.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/problems/${solution.problemId}/solutions/${solution.id}`
                            );
                          }}
                        >
                          <TableCell className="font-mono text-sm">
                            {solution.id}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {problem?.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {solution.isCorrect ? (
                              <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                                <X className="h-4 w-4 text-red-600" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-sm text-gray-500">
                            {getRelativeTime(solution.submittedAt)}
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
