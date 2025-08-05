"use client";

import { deleteUserAPI, loginAPI, logoutAPI } from "@/api/authApi";
import {
  getMeInternalAPI,
  updateUserPasswordAPI,
  updateUserProfileAPI,
  UpdateUserProfileRequest,
  UserProfile,
} from "@/api/userApi";
import { fileUploader } from "@/utils/fileUploader";
import { useRouter } from "next/navigation";
import React, {
  useState,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (newNickname: string, newProfileImage?: File) => Promise<void>;
  changePassword: (newPassword: string) => Promise<boolean>;
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

      const userData = await getMeInternalAPI();
      if (!userData) {
        throw new Error("user info failure");
      }
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      alert("로그인에 실패하였습니다.");
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutAPI();
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  }, [router]);

  const updateProfile = useCallback(
    async (newUserName?: string, newProfileImage?: File) => {
      if (!user) {
        return;
      }

      let uploadedImgURL: string | undefined = undefined;

      if (newProfileImage) {
        const urls: string[] = await fileUploader([newProfileImage]);
        uploadedImgURL = urls[0];
      }
      const updateUserData: UpdateUserProfileRequest = {
        userName: newUserName,
        profileImgUrl: uploadedImgURL,
      };

      try {
        await updateUserProfileAPI(updateUserData);
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            ...(newUserName !== undefined && { username: newUserName }),
            ...(uploadedImgURL !== undefined && {
              profileImageUrl: uploadedImgURL,
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
        await logout();
        return true;
      } catch {
        return false;
      }
    },
    [logout]
  );

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      await deleteUserAPI();
      setIsLoggedIn(false);
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

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    const autoLogin = async () => {
      const userData = await getMeInternalAPI();
      if (!userData) {
        return;
      }
      setUser(userData);
      setIsLoggedIn(true);
    };

    autoLogin();
  }, [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
