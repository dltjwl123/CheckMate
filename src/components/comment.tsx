import { getReviewCommentsAPI, ReviewComment } from "@/api/reviewApi";
import { getRelativeTime } from "@/utils/time";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface CommentSectionProps {
  reviewId: number;
}

export function CommentSection({ reviewId }: CommentSectionProps) {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await getReviewCommentsAPI(reviewId);

        if (data === undefined) {
          throw new Error("getComments error");
        }

        setComments(data);
      } catch (error) {
        console.error(error);
        alert("댓글 불러오기에 실패하였습니다.");
      }
    };

    getComments();
  }, [reviewId]);

  const handleSaveComment = () => {};

  const handleAddReply = () => {};

  const handleEditComment = () => {};

  const handleDeleteComment = () => {};

  const handleSaveReply = () => {};

  const renderComments = (depth: number, parentId?: number) => {
    const IsReply: boolean = depth >= 1;

    return comments
      .filter((c) => c.parentId === parentId)
      .map((comment: ReviewComment) => (
        <div key={comment.id} className={`ml-${IsReply ? "1" : "0"} mb-4`}>
          <div className="flex items-start gap-3">
            <Image
              src={comment.authorProfileUrl || "/placeholder.svg"}
              alt="profile"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm font-semibold">{comment.authorName}</div>
              <div className="text-xs text-gray-500">
                {getRelativeTime(comment.createAt)}
              </div>
              {editTarget === comment.id ? (
                <textarea
                  className="w-full border p-1 rounded mt-1"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              ) : (
                <p className="mt-1 text-sm">{comment.content}</p>
              )}
              <div className="mt-1 space-x-2 text-xs text-gray-500">
                {editTarget === comment.id ? (
                  <>
                    <button onClick={handleSaveComment}>저장</button>
                    <button onClick={() => setEditTarget(null)}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleAddReply}>답글</button>
                    <button onClick={handleEditComment}>수정</button>
                    <button onClick={handleDeleteComment}>수정</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {replyTarget === comment.id && (
            <div className="ml-6 mt-2">
              <textarea
                className="w-full border p-1 rounded"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="답글을 입력하세요"
              />
              <div className="mt-1 text-right space-x-2">
                <button onClick={handleSaveReply} className="text-blue-600">
                  등록
                </button>
                <button onClick={() => setReplyTarget(null)}>취소</button>
              </div>
            </div>
          )}

          {renderComments(comment.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div>
      <div className="mb-4">
        {renderComments(0)}
        <textarea
          className="w-full border p-2 rounded"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <div className="mt-1 text-right">
          <button onClick={handleSaveComment} className="text-blue-600">
            댓글 작성
          </button>
        </div>
      </div>
    </div>
  );
}
