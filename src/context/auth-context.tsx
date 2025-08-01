"use client";

import { deleteUserAPI, loginAPI, logoutAPI } from "@/api/authApi";
import {
  getUserDataAPI,
  updateUserPasswordAPI,
  updateUserProfileAPI,
  UpdateUserProfileRequest,
  UserProfile,
} from "@/api/userApi";
import { useRouter } from "next/navigation";
import React, { useState, createContext, useCallback, useContext } from "react";

interface AuthContextType {
  user: UserProfile | null;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await loginAPI(email, password);

      const userData = await getUserDataAPI();
      if (!userData) {
        throw "error";
      }
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      alert("로그인에 실패하였습니다.");
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutAPI();
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  }, [router]);

  const updateProfile = useCallback(
    async (newUserName?: string, newProfileImage?: string) => {
      if (!user) {
        return;
      }
      const updateUserData: UpdateUserProfileRequest = {
        userId: user.id,
        userName: newUserName,
        profileImgUrl: newProfileImage,
      };

      try {
        await updateUserProfileAPI(updateUserData);
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            ...(newUserName !== undefined && { username: newUserName }),
            ...(newProfileImage !== undefined && {
              profileImageUrl: newProfileImage,
            }),
          };
        });
        alert("프로필이 업데이트되었습니다.");
      } catch {
        alert("프로필 업데이트에 실패하였습니다.");
      }
    },
    [user]
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
  }, []);

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
