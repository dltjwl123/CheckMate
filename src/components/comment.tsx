import {
  createReviewCommentAPI,
  deleteReviewCommentAPI,
  EditReviewCommnetAPI,
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
  const [commentContent, setCommentContent] = useState<string>("");
  const [replyContent, setReplyContent] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
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
    setReplyTarget(null);
    setEditTarget(null);
    setReplyContent("");
    setEditContent("");
    setCommentContent("");
  }, [reviewId, reload]);

  const handleCreateComment = async (
    isReply: boolean,
    parentId: number | null
  ) => {
    try {
      await createReviewCommentAPI(reviewId, {
        content: isReply ? replyContent : commentContent,
        parentId,
      });
      setReload((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("댓글 등록에 실패하였습니다.");
    }
  };

  const handleEditComment = async () => {
    if (!editTarget) {
      console.error("editTarget이 설정되어 있지 않습니다.");
      return;
    }

    try {
      await EditReviewCommnetAPI({
        commentId: editTarget,
        content: editContent,
      });
      setReload((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("댓글 수정에 실패하였습니다.");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deleteReviewCommentAPI(id);
      setReload((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("댓글 삭제에 실패하였습니다.");
    }
  };

  const renderComments = (comments: ReviewComment[], depth: number) => {
    const IsReply: boolean = depth >= 1;

    return comments.map((comment: ReviewComment) => (
      <div
        key={comment.id}
        className={`${IsReply ? "mt-3" : ""} ${depth === 1 ? "ml-6" : ""}`}
      >
        {comment.isDeleted ? (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10" />
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-gray-400">댓글이 삭제되었습니다.</p>
            </div>
          </div>
        ) : (
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
                <span className="text-sm font-medium">
                  {comment.authorName}
                </span>
                <span className="text-xs text-gray-400">
                  {getRelativeTime(comment.createdAt)}
                </span>
              </div>

              {editTarget === comment.id ? (
                <textarea
                  className="w-full resize-none border border-gray-300 rounded-md px-2 py-1 mt-2 text-sm"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              ) : (
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}

              <div className="mt-2 space-x-4 text-blue-600">
                {editTarget === comment.id ? (
                  <>
                    <button
                      onClick={handleEditComment}
                      className="hover:underline"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditTarget(null);
                        setEditContent("");
                      }}
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
                        setEditContent(comment.content);
                      }}
                      className="hover:underline"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 대댓글 입력창 */}
        {replyTarget === comment.id && (
          <div className="ml-12 mt-3">
            <textarea
              className="w-full resize-none border border-gray-300 rounded-md px-2 py-1 text-sm"
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요"
            />
            <div className="mt-2 text-right space-x-2">
              <Button
                onClick={() => handleCreateComment(true, replyTarget)}
                variant="default"
              >
                등록
              </Button>
              <Button onClick={() => setReplyTarget(null)} variant="outline">
                취소
              </Button>
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
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="내용을 입력하세요"
        />
        <div className="mt-2 text-right">
          <Button onClick={() => handleCreateComment(false, null)}>
            댓글 작성
          </Button>
        </div>
      </div>
    </div>
  );
}
