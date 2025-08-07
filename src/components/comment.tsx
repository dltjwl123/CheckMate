import {
  createReviewCommentAPI,
  getReviewCommentsAPI,
  ReviewComment,
} from "@/api/reviewApi";
import { getRelativeTime } from "@/utils/time";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "./ui/button";

export interface CommentSectionProps {
  reviewId: number;
}

export function CommentSection({ reviewId }: CommentSectionProps) {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);

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
  }, [reviewId, reload]);

  const handleSaveComment = async () => {
    try {
      await createReviewCommentAPI(reviewId, {
        content: inputValue,
        parentId: null,
      });
      setReload((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("댓글 등록에 실패하였습니다.");
    }
  };

  const handleAddReply = () => {};

  const handleEditComment = () => {};

  const handleDeleteComment = () => {};

  const handleSaveReply = () => {};

  const renderComments = (comments: ReviewComment[], depth: number) => {
    const IsReply: boolean = depth >= 1;
    console.log("comments:", comments, "depth:", depth);
    return comments.map((comment: ReviewComment) => (
      <div key={comment.id} className={`${IsReply ? "ml-8" : ""}`}>
        <div className="flex items-start gap-3">
          <Image
            src={comment.profileImgUrl || "/placeholder.svg"}
            alt="profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
          />
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{comment.authorName}</span>
              <span className="text-xs text-gray-400">
                {getRelativeTime(comment.createAt)}
              </span>
            </div>

            {editTarget === comment.id ? (
              <textarea
                className="w-full resize-none border border-gray-300 rounded-md px-2 py-1 mt-2 text-sm"
                rows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            <div className="mt-2 space-x-4 text-xs text-blue-600">
              {editTarget === comment.id ? (
                <>
                  <button
                    onClick={handleSaveComment}
                    className="hover:underline"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditTarget(null)}
                    className="text-gray-500 hover:underline"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setReplyTarget(comment.id)}
                    className="hover:underline"
                  >
                    답글
                  </button>
                  <button
                    onClick={() => {
                      setEditTarget(comment.id);
                      setInputValue(comment.content);
                    }}
                    className="hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment()}
                    className="text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 대댓글 입력창 */}
        {replyTarget === comment.id && (
          <div className="ml-12 mt-3">
            <textarea
              className="w-full resize-none border border-gray-300 rounded-md px-2 py-1 text-sm"
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="답글을 입력하세요"
            />
            <div className="mt-2 text-right space-x-2">
              <button
                onClick={handleSaveReply}
                className="text-sm text-blue-600 hover:underline"
              >
                등록
              </button>
              <button
                onClick={() => setReplyTarget(null)}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {renderComments(comment.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="mx-5 my-5 space-y-6">
      {/* 전체 댓글 리스트 */}
      {renderComments(comments, 0)}

      {/* 새 댓글 입력창 */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
        <div className="text-xl font-semibold mb-2 text-gray-700">
          댓글 작성
        </div>
        <textarea
          className="w-full resize-none border border-gray-300 rounded-md p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="내용을 입력하세요"
        />
        <div className="mt-2 text-right">
          <Button onClick={handleSaveComment}>댓글 작성</Button>
        </div>
      </div>
    </div>
  );
}
