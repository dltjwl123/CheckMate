"use client";

import {
  AnswerSummary,
  getMyAnswerListAPI,
  MyAnswerSummaryListResponse,
} from "@/api/userApi";
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
import { useEffect, useState } from "react";

export default function MySolutionsPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [myAnswers, setMyAnswers] = useState<MyAnswerSummaryListResponse>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  useEffect(() => {
    const getAnswerList = async () => {
      try {
        const data = await getMyAnswerListAPI();

        if (!data) {
          throw new Error("풀이 불러오기 실패");
        }

        setMyAnswers(data);
      } catch (error) {
        console.error(error);
        alert("나의 풀이 불러오기에 실패하였습니다.");
      }
    };

    getAnswerList();
  }, []);

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
              {myAnswers.length === 0 ? (
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
                      {/* <TableHead className="w-24 text-center">
                        정답여부
                      </TableHead> */}
                      <TableHead className="w-32 text-right">
                        제출시간
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAnswers.map((myAnswer) => (
                      <TableRow
                        key={myAnswer.answerId}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/problems/${myAnswer.problemId}/solutions/${myAnswer.answerId}`
                          );
                        }}
                      >
                        <TableCell className="font-mono text-sm">
                          {myAnswer.answerId}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {myAnswer.problemTitle}
                          </div>
                        </TableCell>
                        {/* <TableCell className="text-center">
                          {myAnswer. ? (
                            <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                              <X className="h-4 w-4 text-red-600" />
                            </div>
                          )}
                        </TableCell> */}
                        <TableCell className="text-right text-sm text-gray-500">
                          {getRelativeTime(myAnswer.submittedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
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
