"use client";

import { deleteUserAPI, loginAPI, logoutAPI } from "@/api/authApi";
import {
  getUserDataAPI,
  updateUserPasswordAPI,
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    newNickname: string,
    newProfileImage?: string
  ) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginAPI(email, password);
        setUser(dummyUser);
        setIsLoggedIn(true);
      } catch (error) {
        alert("로그인에 실패하였습니다.");
        throw error;
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
    async (newPassword: string): Promise<boolean> => {
      try {
        await updateUserPasswordAPI(newPassword);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      await deleteUserAPI();
      return true;
    } catch {
      return false;
    }
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
