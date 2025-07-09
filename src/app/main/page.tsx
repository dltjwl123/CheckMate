'use client';
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import Badge from "@/components/badge";
// Sample data for recent problems

const recentProblems = [
  {
    id: 1,
    year: "2024",
    title: "9월 모의고사 미분과 적분 30번",
    correctRate: 23.5,
    solved: true,
    tags: ["미적분학", "극한"],
    difficulty: "고급",
  },
  {
    id: 2,
    year: "2024",
    title: "6월 모의고사 확률과 통계 28번",
    correctRate: 45.2,
    solved: false,
    tags: ["확률", "통계"],
    difficulty: "중급",
  },
  {
    id: 3,
    year: "2023",
    title: "수능 기하 29번",
    correctRate: 18.7,
    solved: true,
    tags: ["기하학", "공간도형"],
    difficulty: "고급",
  },
  {
    id: 4,
    year: "2024",
    title: "3월 모의고사 수학II 27번",
    correctRate: 67.3,
    solved: false,
    tags: ["함수", "그래프"],
    difficulty: "중급",
  },
  {
    id: 5,
    year: "2023",
    title: "수능 수학I 26번",
    correctRate: 52.8,
    solved: true,
    tags: ["삼각함수", "방정식"],
    difficulty: "중급",
  },
  {
    id: 6,
    year: "2024",
    title: "7월 모의고사 미적분 29번",
    correctRate: 31.4,
    solved: false,
    tags: ["적분", "넓이"],
    difficulty: "고급",
  },
  {
    id: 7,
    year: "2023",
    title: "9월 모의고사 수학I 21번",
    correctRate: 72.1,
    solved: true,
    tags: ["수열", "귀납법"],
    difficulty: "초급",
  },
  {
    id: 8,
    year: "2023",
    title: "6월 모의고사 기하 30번",
    correctRate: 15.3,
    solved: false,
    tags: ["기하학", "벡터"],
    difficulty: "고급",
  },
  {
    id: 9,
    year: "2022",
    title: "수능 확률과 통계 29번",
    correctRate: 27.8,
    solved: true,
    tags: ["확률", "조건부확률"],
    difficulty: "고급",
  },
  {
    id: 10,
    year: "2022",
    title: "9월 모의고사 수학II 25번",
    correctRate: 58.4,
    solved: false,
    tags: ["함수", "미분"],
    difficulty: "중급",
  },
  {
    id: 11,
    year: "2022",
    title: "6월 모의고사 미적분 27번",
    correctRate: 42.7,
    solved: true,
    tags: ["미적분학", "적분법"],
    difficulty: "중급",
  },
  {
    id: 12,
    year: "2021",
    title: "수능 수학I 28번",
    correctRate: 33.9,
    solved: false,
    tags: ["수열", "점화식"],
    difficulty: "중급",
  },
  {
    id: 13,
    year: "2021",
    title: "9월 모의고사 기하 30번",
    correctRate: 19.2,
    solved: true,
    tags: ["기하학", "원"],
    difficulty: "고급",
  },
  {
    id: 14,
    year: "2021",
    title: "6월 모의고사 확률과 통계 26번",
    correctRate: 61.5,
    solved: false,
    tags: ["통계", "정규분포"],
    difficulty: "중급",
  },
  {
    id: 15,
    year: "2020",
    title: "수능 미적분 30번",
    correctRate: 12.8,
    solved: true,
    tags: ["미적분학", "미분방정식"],
    difficulty: "고급",
  },
];

function Main() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Top Messages */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            수학 문제 해답을 공유하고 검증하세요
            <span className="block text-blue-600">Math Solutions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            여러분의 해답을 업로드하고, 피드백을 받아보세요.
          </p>
        </div>
      </section>

      {/* Problems Table */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              등록된 문제
            </h2>
            <p className="text-lg text-gray-600">
              등록된 수학문제들을 확인해보세요!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">연도</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-24 text-center">정답률</TableHead>
                  <TableHead className="w-24 text-center">풀었음</TableHead>
                  <TableHead className="w-48">태그</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProblems.map((problem) => (
                  <TableRow
                    key={problem.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/problem/${problem.id}`)}
                  >
                    <TableCell className="font-medium">
                      {problem.year}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {problem.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          problem.correctRate < 30
                            ? "bg-red-100 text-red-800"
                            : problem.correctRate < 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {problem.correctRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {problem.solved ? (
                        <Badge className="bg-green-100 text-green-800">
                          완료
                        </Badge>
                      ) : (
                        <Badge varient="outline">미완료</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} varient="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              저작권 항목
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-gray-600 hover:text-gray-900 text-sm">
                이용약관
              </p>
              <p className="text-gray-600 hover:text-gray-900 text-sm">
                개인정보처리방침
              </p>
              <p className="text-gray-600 hover:text-gray-900 text-sm">
                GitHub
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Main;
