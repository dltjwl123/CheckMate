"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Eye, EyeOff, ImageIcon, KeyRound, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPage() {
  const { user, changePassword, updateProfile, deleteAccount, logout } =
    useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState<string>(user?.username || "");
  const [profileImage, setProfileImage] = useState<string>(
    user?.profileImageUrl || "/placeholder.svg?height=40&width=40"
  );
  // const [currentPassword, setCurrentPassword] = useState<string>("");
  // const [showCurrentPassword, setShowCurrentPassword] =
  //   useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isUpdataingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setNickname(user.username);
      setProfileImage(
        user.profileImageUrl || "/placeholder.svg?height=40&width=40"
      );
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    setIsUpdatingProfile(true);
    await updateProfile(
      nickname,
      profileImageFile ? profileImageFile : undefined
    );
    setIsUpdatingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsChangingPassword(true);
    const success = await changePassword(newPassword);
    if (success) {
      alert("비밀번호가 변경되었습니다.");
      // setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert("비밀번호 변경에 실패하였습니다.");
    }
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      setIsDeletingAccount(true);
      const success = await deleteAccount();
      if (success) {
        alert("계정이 삭제되었습니다.");
      } else {
        alert("계정 삭제에 실패하였습니다.");
      }
      setIsDeletingAccount(false);
    }
  };

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const isInvalidPassword = (password: string): boolean => {
    const passwordRegex = /^[!-~]*$/; // ASCII printable 문자 (32 제외)
    if (!passwordRegex.test(password) && password !== "") {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">회원 정보</h1>

          {/* Profile card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />내 프로필
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex itmes-center gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile Image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <ImageIcon className="h-5 w-5" />
                      <span className="sr-only">프로필 이미지 변경</span>
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      이메일은 변경 할 수 없습니다.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="닉네임을 입력하세요"
                    required
                  />
                </div>
                <Button type="submit" disabled={isUpdataingProfile}>
                  {isUpdataingProfile ? "업데이트 중..." : "프로필 업데이트"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Card */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                비밀번호 변경
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    현재 비밀번호
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      name="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        if (isInvalidPassword(e.target.value)) {
                          setCurrentPassword(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="현재 비밀번호를 입력하세요"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div> */}

                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      name="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        if (isInvalidPassword(e.target.value)) {
                          setNewPassword(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="새 비밀번호를 입력하세요(8자 이상)"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        if (isInvalidPassword(e.target.value)) {
                          setConfirmPassword(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="비밀번호를 다시 입력하세요"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Card */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                계정 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full bg-transparent"
              >
                로그아웃
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="w-full bg-transparent text-red-600 border-red-300 hover:bg-red-50"
              >
                {isDeletingAccount ? "탈퇴 처리 중..." : "회원 탈퇴"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
