"use client";

import { loginAPI, logoutAPI } from "@/api/authApi";
import {
  getUserDataAPI,
  updateUserProfileAPI,
  UpdateUserProfileRequest,
} from "@/api/userApi";
import { useRouter } from "next/navigation";
import React, {
  useState,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, nickname: string) => void;
  logout: () => void;
  updateProfile: (newNickname: string, newProfileImage?: string) => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dummyUser: User = useMemo(
    () => ({
      id: 0,
      email: "test@example.com",
      nickname: "청운종",
      profileImage: "/placeholder.svg?height=40&width=40",
    }),
    []
  );
  const [user, setUser] = useState<User | null>(dummyUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginAPI(email, password); // response에 user정보(userId, nickname) 필요
        setUser(dummyUser);
        setIsLoggedIn(true);
      } catch {
        alert("로그인에 실패하였습니다.");
      }
    },
    [dummyUser]
  );

  const logout = useCallback(async () => {
    await logoutAPI();
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  }, [router]);

  const updateProfile = useCallback(
    async (newNickname?: string, newProfileImage?: string) => {
      if (!user) {
        return;
      }
      const updateUserData: UpdateUserProfileRequest = {
        userId: user.id,
        userName: newNickname,
        profileImgUrl: newProfileImage,
      };

      try {
        await updateUserProfileAPI(updateUserData);
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            nickname: newNickname || prevUser.nickname,
            profileImage: newProfileImage || prevUser.profileImage,
          };
        });
        alert("프로필이 업데이트되었습니다.");
      } catch {
        alert("프로필 업데이트에 실패하였습니다.");
      }
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      
      return new Promise((resolve) => {
        setTimeout(() => {
          alert("비밀번호가 변경되었습니다.");
          resolve(true);
        }, 1000);
      });
    },
    []
  );

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert("계정이 삭제되었습니다.");
        logout();
        resolve(true);
      }, 1000);
    });
  }, [logout]);

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
