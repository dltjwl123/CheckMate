import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import Badge from "@/components/ui/badge";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Table, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

//sample problem data
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
// sample solution data
const solutionsData = [
  {
    id: 1,
    submissionNumber: "S001",
    isCorrect: true,
    submitter: "수학왕김철수",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
  },
  {
    id: 2,
    submissionNumber: "S002",
    isCorrect: false,
    submitter: "미적분마스터",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
  },
  {
    id: 3,
    submissionNumber: "S003",
    isCorrect: true,
    submitter: "기하학전문가",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
  },
  {
    id: 4,
    submissionNumber: "S004",
    isCorrect: true,
    submitter: "확률통계고수",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
  },
  {
    id: 5,
    submissionNumber: "S005",
    isCorrect: false,
    submitter: "수학초보자",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1주일 전
  },
  {
    id: 6,
    submissionNumber: "S006",
    isCorrect: true,
    submitter: "적분의달인",
    submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 2주일 전
  },
  {
    id: 7,
    submissionNumber: "S007",
    isCorrect: true,
    submitter: "미분방정식킬러",
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1개월 전
  },
  {
    id: 8,
    submissionNumber: "S008",
    isCorrect: false,
    submitter: "수학학습자",
    submittedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2개월 전
  },
  {
    id: 9,
    submissionNumber: "S009",
    isCorrect: true,
    submitter: "극한의마법사",
    submittedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6개월 전
  },
  {
    id: 10,
    submissionNumber: "S010",
    isCorrect: true,
    submitter: "수학올림피아드",
    submittedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1년 전
  },
];

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInMinutes < 1) {
    return "최근";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }
  return `${diffInYears}년 전`;
};

export default function SolutionPage() {
  const { id } = useParams();
  const problemId = Number.parseInt(id as string);

  const problem =
    problemsData.find((p) => p.id === problemId) || problemsData[0];
  const correctSolutions = solutionsData.filter((s) => s.isCorrect).length;
  const totalSolutions = solutionsData.length;
  const correctRate =
    totalSolutions > 0
      ? ((correctSolutions / totalSolutions) * 100).toFixed(1)
      : 0;

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
                        problem.correctRate < 30
                          ? "bg-red-100 text-red-800"
                          : problem.correctRate < 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      정답률 {problem.correctRate}%
                    </span>
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    {problem.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} varient="secondary">
                        {tag}
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
                  {totalSolutions}
                </div>
                <div className="text-sm text-gray-600">총 제출 수</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-900">
                  {correctSolutions}
                </div>
                <div className="text-sm text-gray-600">정답 제출</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-900">
                  {correctRate}%
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
                  {solutionsData.map((solution) => (
                    <TableRow
                      key={solution.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        window.location.href = `/problems/${problemId}/solutions/${solution.submissionNumber}`;
                      }}
                    >
                      <TableCell className="font-mono text-sm">
                        {solution.submissionNumber}
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
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {solution.submitter}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {getRelativeTime(solution.submittedAt)}
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
