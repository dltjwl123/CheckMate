"use client";

import { getMyReviewListAPI, myReviewSummaryListResponse } from "@/api/userApi";
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
import { useEffect, useState } from "react";

export default function MyReviewPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [myReviewList, setMyReviewList] = useState<myReviewSummaryListResponse>(
    []
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  useEffect(() => {
    const getMyReviewList = async () => {
      try {
        const data = await getMyReviewListAPI();

        if (!data) {
          throw new Error("리뷰 불러오기 실패");
        }

        setMyReviewList(data);
      } catch (error) {
        console.error(error);
        alert("나의 리뷰 불러오기에 실패하였습니다.");
      }
    };

    getMyReviewList();
  }, []);

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
              {myReviewList.length === 0 ? (
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
                      <TableHead className="w-32">리뷰 대상</TableHead>
                      <TableHead>문제 제목</TableHead>
                      <TableHead className="w-32 text-right">
                        작성 시간
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myReviewList.map((myReview, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/problems/${myReview.problemId}/solutions/${myReview.answerId}`
                          );
                        }}
                      >
                        <TableCell className="font-medium text-gray-900">
                          {myReview.targetName}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {myReview.problemTitle}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-500">
                          {getRelativeTime(myReview.createdAt)}
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
