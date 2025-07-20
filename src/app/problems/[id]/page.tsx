"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { ArrowLeft, ArrowRight, Check, Plus, Upload } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Image from "next/image";

const problemsData = [
  {
    id: 1,
    year: "2024",
    title: "9월 모의고사 미분과 적분 30번",
    correctRate: 23.5,
    solved: true,
    tags: ["미적분학", "극한"],
    difficulty: "고급",
    imageUrl: "/placeholder.svg?height=600&width=800",
    solutionImages: ["/placeholder.svg?height=400&width=600"],
  },
  {
    id: 2,
    year: "2024",
    title: "6월 모의고사 확률과 통계 28번",
    correctRate: 45.2,
    solved: false,
    tags: ["확률", "통계"],
    difficulty: "중급",
    imageUrl: "/placeholder.svg?height=600&width=800",
    solutionImages: ["/placeholder.svg?height=400&width=600"],
  },
  {
    id: 3,
    year: "2023",
    title: "수능 기하 29번",
    correctRate: 18.7,
    solved: true,
    tags: ["기하학", "공간도형"],
    difficulty: "고급",
    imageUrl: "/placeholder.svg?height=600&width=800",
    solutionImages: ["/placeholder.svg?height=400&width=600"],
  },
  {
    id: 4,
    year: "2024",
    title: "3월 모의고사 수학II 27번",
    correctRate: 67.3,
    solved: false,
    tags: ["함수", "그래프"],
    difficulty: "중급",
    imageUrl: "/placeholder.svg?height=600&width=800",
    solutionImages: ["/placeholder.svg?height=400&width=600"],
  },
  {
    id: 5,
    year: "2023",
    title: "수능 수학I 26번",
    correctRate: 52.8,
    solved: true,
    tags: ["삼각함수", "방정식"],
    difficulty: "중급",
    imageUrl: "/placeholder.svg?height=600&width=800",
    solutionImages: ["/placeholder.svg?height=400&width=600"],
  },
];

function Problem() {
  const { id } = useParams();
  const problemId = Number.parseInt(id as string);
  const problem =
    problemsData.find((p) => p.id === problemId) || problemsData[0];
  const [solutionImages, setSolutionImages] = useState<string[]>(
    problem.solutionImages
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    const newImages: string[] = [];
    let filesProcessed = 0;
    const wasEmptyBeforeUpload = solutionImages.length === 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        newImages.push(event.target?.result as string);
        filesProcessed++;

        if (filesProcessed === files.length) {
          setSolutionImages((prev) => [...prev, ...newImages]);
          setActiveImageIndex(solutionImages.length + newImages.length - 1);
          e.target.value = "";
          setIsUploading(false);

          if (wasEmptyBeforeUpload) {
            alert("풀이 이미지가 업로드되었습니다.");
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    alert("풀이 제출이 완료되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6 flex justify-between items-center">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              문제 목록으로 돌아가기
            </Link>
            <Link
              href={`/problems/${problemId}/solutions`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              제출된 풀이 보러 가기
            </Link>
          </div>

          {/* Card */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
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
                    <span>.</span>
                    {problem.solved ? (
                      <Badge className="bg-green-100 text-green-800">
                        풀이 완료
                      </Badge>
                    ) : (
                      <Badge varient="outline">미완료</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 text-left mt-5">
                    {problem.title}
                  </CardTitle>
                </div>
                <div className="flex flex-wrap gap-1">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} varient="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-md overflow-hidden border border-gray-200 mb-4">
                <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 border-b border-gray-200">
                  문제 이미지
                </div>
                <div className="flex justify-center p-4">
                  <Image
                    src={problem.imageUrl || "/dummyPlaceholder.svg"}
                    alt={`${problem.title} 문제 이미지`}
                    width={800}
                    height={600}
                    className="max-w-full h-auto rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">내 풀이</CardTitle>
            </CardHeader>
            <CardContent>
              {solutionImages ? (
                <div className="space-y-6">
                  {/* preview */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {solutionImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative w-20 h-20 border rounded-md overflow-hidden cursor-pointer ${
                          activeImageIndex === index
                            ? "border-blue-500 ring-2 ring-blue-500"
                            : "border-gray-200"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`풀이 이미지 ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                        <span
                          className="absolute bottom-0 right-0 bg-black bg-opacity-50
                          text-white text-xs px-1 rounded-tl-md"
                        >
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* solution details */}
                  <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                    <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 brder-b border-gray-200">
                      업로드된 풀이{" "}
                      {solutionImages.length > 0 &&
                        `페이지 ${activeImageIndex + 1} /
                      ${solutionImages.length}`}
                    </div>
                    <div className="flex justify-center p-4">
                      <Image
                        src={
                          activeImageIndex
                            ? solutionImages[activeImageIndex]
                            : "dummyPlaceholder.svg"
                        }
                        alt="업로드 이미지"
                        width={600}
                        height={400}
                        className="max-w-full h-auto rounded"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <label
                        htmlFor="re-upload-file"
                        className="cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                          onClick={() => setSolutionImages([])}
                        >
                          <Upload className="h-4 w-4" />
                          다시 업로드
                        </Button>
                        <input
                          id="re-upload-file"
                          name="re-upload-file"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>

                      <label
                        htmlFor="add-upload-file"
                        className="cursor-pointer"
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                          disabled={isUploading}
                        >
                          <Plus className="h-4 w-4" />
                          추가 업로드
                        </Button>
                        <input
                          id="add-upload-file"
                          name="add-upload-file"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <Button
                      className="flex items-center gap-2"
                      onClick={handleSubmit}
                      disabled={solutionImages.length === 0 || isUploading}
                    >
                      <Check className="h-4 w-4" />
                      제출하기
                    </Button>
                  </div>
                </div>
              ) : (
                // No Image
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-12 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        풀이 이미지 업로드
                      </p>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button disabled={isUploading}>
                          {isUploading ? "업로드 중..." : "이미지 선택"}
                        </Button>
                        <input
                          id="file-upload"
                          name="fiule-uplaod"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                  <Button className="w-full" disabled={true}>
                    <Check className="h-4 w-4 mr-2" />
                    제출하기
                  </Button>
                  <p className="text-sm text-center text-gray-500">
                    풀이를 업로드한후 제출할 수 있습니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Problem;
