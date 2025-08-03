"use client";

import { getProblemDetailAPI, ProblemDetailResponse } from "@/api/problemApi";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import Badge from "@/components/ui/badge";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelativeTime } from "@/utils/time";
import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SolutionPage() {
  const { id } = useParams();
  const router = useRouter();
  const problemId = Number.parseInt(id as string);
  const [problem, setProblem] = useState<ProblemDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getProblemDetail = async () => {
      setIsLoading(true);
      try {
        const problemDetail = await getProblemDetailAPI(problemId);

        if (!problemDetail) {
          throw new Error("problem API error");
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

  if (isLoading || !problem) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-gray-500 text-lg animate-pulse">
          문제를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href={`/problems/${problemId}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              문제로 돌아가기
            </Link>
          </div>

          {/* Problem Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>{problem.year}</span>
                    <span>.</span>
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
                  <CardTitle className="text-2xl mb-2">
                    {problem.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.map((tag) => (
                      <Badge key={tag.name} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Solution statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {problem.submissionCount}
                </div>
                <div className="text-sm text-gray-600">총 제출 수</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-900">
                  {problem.correctSubmissionCount}
                </div>
                <div className="text-sm text-gray-600">정답 제출</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-900">
                  {problem.accuracyRate}%
                </div>
                <div className="text-sm text-gray-600">정답률</div>
              </CardContent>
            </Card>
          </div>

          {/* Solutions List */}
          <Card>
            <CardHeader>
              <CardTitle>제출된 풀이 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">제출 번호</TableHead>
                    <TableHead className="w-24 text-center">
                      정답 여부
                    </TableHead>
                    <TableHead>제출자</TableHead>
                    <TableHead className="w-32 text-right">제출시간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problem.answers.map((answer) => (
                    <TableRow
                      key={answer.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        router.push(
                          `/problems/${problemId}/solutions/${answer.id}`
                        );
                      }}
                    >
                      <TableCell className="font-mono text-sm">
                        {answer.id}
                      </TableCell>
                      <TableCell className="text-center">
                        {answer.answerStatus === "CORRECT" ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                            <X className="h-4 w-4 text-red-600" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {answer.username}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {answer.submittedAt ? getRelativeTime(answer.submittedAt) : "불명"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
