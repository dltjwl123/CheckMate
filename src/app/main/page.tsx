"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import Badge from "@/components/ui/badge";
import Footer from "@/components/footer";
import { useState } from "react";
import {
  getProblemListAPI,
  Problem,
  problemFilterRequest,
} from "@/api/problemApi";
import Button from "@/components/ui/button";

interface Filter {
  year: number | null;
  title: string | null;
  correctRateMin: number | null;
  correctRateMax: number | null;
  tag: string | null;
}

function Main() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filter>({
    year: null,
    title: null,
    correctRateMax: null,
    correctRateMin: null,
    tag: null,
  });

  // pagenation states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const ITEMS_PER_PAGE: number = 10;

  // search states
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchedProblems, setSearchedProblems] = useState<Problem[]>([]);
  console.log("filters:", filters);
  const handleSearch = async (page: number = 1) => {
    setIsSearching(true);

    const searchResquest: problemFilterRequest = {
      ...(filters.title !== null && { title: filters.title }),
      ...(filters.year !== null && { year: filters.year }),
      ...(filters.correctRateMax !== null && {
        maxAccuracyRate: filters.correctRateMax,
      }),
      ...(filters.correctRateMin !== null && {
        minAccuracyRate: filters.correctRateMin,
      }),
      ...(filters.tag !== null && { tagName: filters.tag }),
    };

    try {
      const filteredList = await getProblemListAPI(
        page,
        ITEMS_PER_PAGE,
        undefined,
        searchResquest
      );

      if (filteredList) {
        setSearchedProblems(filteredList.content);
        setTotalItems(filteredList.size);
        setTotalPages(filteredList.pageable.pageSize);
        setCurrentPage(filteredList.pageable.pageNumber);
      } else {
        throw "검색 실패";
      }
    } catch {
      alert("검색에 실패하였습니다");
    } finally {
      setIsSearching(false);
    }
  };

  const resetFilter = () => {
    setFilters({
      year: null,
      title: null,
      correctRateMax: null,
      correctRateMin: null,
      tag: null,
    });
  };

  const handlePageChange = (page: number) => {
    handleSearch(page);
  };

  const Pagination = () => {
    const MAX_VISIBLE_PAGES: number = 5;
    const startPage: number = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    const endPage: number = Math.min(
      totalPages,
      startPage + MAX_VISIBLE_PAGES - 1
    );
    const adjustedStartPage: number = Math.max(
      1,
      endPage - MAX_VISIBLE_PAGES + 1
    );

    const pageNumbers = [];
    for (let i = adjustedStartPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (totalPages <= 1) {
      return null;
    }

    return (
      <div
        className="flex items-center justify-between px-4 py-3 bg-white
        border-t border-gray-200 sm:px-6"
      >
        {/* Page Move Buttons */}
        <div className="flex items-center justify-between flex-1 sm:hidden">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isSearching}
            className="bg-transparent"
          >
            이전
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isSearching}
            className="bg-transparent"
          >
            다음
          </Button>
        </div>

        {/* Page Indicator */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              총 <span className="font-medium">{totalItems}</span>개 중{" "}
              <span className="font-medium">
                {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}
              </span>
              -
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
              </span>
              개 표시
            </p>
          </div>
        </div>

        {/* Bottom Pagenation Buttons */}
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isSearching}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border
                border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              이전
            </Button>
            {pageNumbers.map((page: number) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                disabled={isSearching}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                  ${
                    currentPage === page
                      ? "z-10 bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isSearching}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border
                border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              다음
            </Button>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
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

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                문제 필터
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Year Filter */}
                <div>
                  <label
                    htmlFor="year-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    연도
                  </label>
                  <select
                    id="year-filter"
                    value={filters.year !== null ? filters.year : "전체"}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        year:
                          e.target.value !== "전체"
                            ? Number(e.target.value)
                            : null,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    focus:outline-none focus: ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="전체">전체</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>

                {/* Title Filter */}
                <div>
                  <label
                    htmlFor="title-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    제목 검색
                  </label>
                  <input
                    id="title-filter"
                    type="text"
                    value={filters.title !== null ? filters.title : ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        title: e.target.value !== "" ? e.target.value : null,
                      }))
                    }
                    placeholder="문제 제목을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tag Filter */}
                <div>
                  <label
                    htmlFor="tag-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    태그 검색
                  </label>
                  <input
                    id="tag-filter"
                    type="text"
                    value={filters.tag !== null ? filters.tag : ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        tag: e.target.value !== "" ? e.target.value : null,
                      }))
                    }
                    placeholder="태그를 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Correct Ratio Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    정답률 범위 (%)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={
                        filters.correctRateMin !== null
                          ? filters.correctRateMin
                          : ""
                      }
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          correctRateMin: Number(e.target.value),
                        }))
                      }
                      placeholder="최소"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="flex items-center text-gray-500">~</span>
                    <input
                      type="number"
                      value={
                        filters.correctRateMax !== null
                          ? filters.correctRateMax
                          : ""
                      }
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          correctRateMax: Number(e.target.value),
                        }))
                      }
                      placeholder="최대"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="col-span-full flex gap-3">
                  <Button
                    onClick={() => handleSearch(1)}
                    disabled={isSearching}
                    className="px-6 py-2 h-10"
                  >
                    {isSearching ? "검색 중..." : "검색"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetFilter}
                    className="px-6 py-2 h-10 bg-transparent"
                  >
                    필터 초기화
                  </Button>
                </div>
              </div>

              {/* Search Result */}
              <div className="text-sm text-gray-600">
                전체 {totalItems}개 문제 (페이지 {currentPage}/{totalPages})
              </div>
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
                  {isSearching ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div
                            className="animate-spin rounded-full h-6 w-6 border-b-2
                         border-blue-600 mr-2"
                          />
                          검색 중...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : searchedProblems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchedProblems.map((problem) => (
                      <TableRow
                        key={problem.problemId}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          router.push(`/problems/${problem.problemId}`)
                        }
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
                              problem.accuracyRate < 30
                                ? "bg-red-100 text-red-800"
                                : problem.accuracyRate < 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {problem.accuracyRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {/* 임시 */}
                          <Badge variant="outline">미완료</Badge>
                          {/* {problem.solved ? (
                        <Badge className="bg-green-100 text-green-800">
                          완료
                        </Badge>
                      ) : (
                        <Badge variant="outline">미완료</Badge>
                      )} */}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {problem.tagNames.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <Pagination />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Main;
