"use client";

import {
  changeLostPasswordAPI,
  sendPasswordFindCodeAPI,
  verifyPasswordFindCodeAPI,
} from "@/api/authApi";
import Navbar from "@/components/navbar";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

interface FormErrors {
  email?: string;
  verificationCode?: string;
  newPassword?: string;
  confirmPassowrd?: string;
  general?: string;
}

interface FormData {
  email: string;
  newPassword: string;
  confirmPassowrd: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    confirmPassowrd: "",
    newPassword: "",
  });
  const [code, setCode] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showVerificationInput, setShowVerificationInput] =
    useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isValidEmail = useCallback((email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  }, []);

  const handleSendVerificationCode = async () => {
    if (formData.email.length === 0) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일을 입력해주세요",
      }));
      return;
    }

    if (!isValidEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다",
      }));
      return;
    }

    setIsSendingCode(true);
    setIsEmailVerified(false);
    setErrors((prev) => ({
      ...prev,
      email: "",
      general: "",
    }));

    try {
      await sendPasswordFindCodeAPI(formData.email);
      setShowVerificationInput(true);
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "인증코드 발송에 실패했습니다",
      }));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length === 0) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증코드를 입력해주세요",
      }));
      return;
    }

    setIsVerifyingCode(true);
    setErrors((prev) => ({
      ...prev,
      verificationCode: "",
    }));

    try {
      await verifyPasswordFindCodeAPI(formData.email, code);
      setIsEmailVerified(true);
    } catch {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증코드가 올바르지 않습니다",
      }));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 공백 방지
    if (/\s/.test(value)) return;

    // 비밀번호 & 비밀번호 확인: 특수문자 포함 허용 → ASCII printable 문자
    if (name === "newPassword" || name === "confirmPassowrd") {
      const passwordRegex = /^[!-~]*$/; // ASCII printable 문자 (32 제외)
      if (!passwordRegex.test(value) && value !== "") return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

      if (name === "email") {
        setIsEmailVerified(false);
        setShowVerificationInput(false);
        setCode("");
      }
    }
  };

  const isSubmitable = () => {
    return (
      formData.email &&
      formData.newPassword &&
      formData.confirmPassowrd &&
      isEmailVerified &&
      formData.newPassword === formData.confirmPassowrd &&
      formData.newPassword.length >= 8
    );
  };

  const checkFormat = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!isEmailVerified) {
      newErrors.general = "이메일 인증을 완료해주세요";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "새로운 비밀번호를 입력해주세요";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "비밀번호는 8자 이상이어야 합니다";
    }

    if (!formData.confirmPassowrd) {
      newErrors.confirmPassowrd = "비밀번호 확인을 입력해 주세요";
    } else if (formData.newPassword !== formData.confirmPassowrd) {
      newErrors.confirmPassowrd = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmittingNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkFormat()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await changeLostPasswordAPI(formData.email, formData.newPassword);
      alert("비밀번호가 변경되었습니다.");
      router.push("/login");
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "비밀번호 변경에 실패했습니다. 다시 시도해주세요",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mt-20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">비밀번호 찾기</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Error Message */}
            {errors.general && (
              <div
                className="mb-4 p-3 bg-red-50 border border-red-200
               rounded-md flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">{errors.general}</span>
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmittingNewPassword}>
              {/* email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이메일
                </label>
                <div className="flex gap-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500"
                    placeholder="example@example.com"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={handleSendVerificationCode}
                    disabled={
                      isSendingCode ||
                      isEmailVerified ||
                      formData.email.length === 0
                    }
                  >
                    {isSendingCode ? (
                      "발송중..."
                    ) : isEmailVerified ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      "인증"
                    )}
                  </Button>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Verification Code */}
              {showVerificationInput && !isEmailVerified && (
                <div className="animate-in slide-in-form-top-2 duration-300">
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    인증코드
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-md shadow-sm
                       placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500 border-gray-300
                       ${
                         isEmailVerified
                           ? "bg-gray-100 text-gray-500 cursor-not-allowed opacity-70"
                           : ""
                       }`}
                      placeholder="인증코드를 입력하세요"
                      maxLength={6}
                      disabled={isEmailVerified}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={
                        isVerifyingCode || code.length === 0 || isEmailVerified
                      }
                      className="whitespace-nowrap"
                    >
                      {isVerifyingCode
                        ? "확인중..."
                        : isEmailVerified
                        ? "완료"
                        : "확인"}
                    </Button>
                  </div>
                  {errors.verificationCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.verificationCode}
                    </p>
                  )}
                  <p className="mt-1 text-sx text-gray-500">
                    이메일로 발송된 인증코드 6자리를 입력해주세요.
                  </p>
                </div>
              )}

              {isEmailVerified && (
                <div
                  className="p-3 bg-green-50 border border-green-200
                rounded-md flex items-center gap-2"
                >
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    이메일 인증이 완료되었습니다
                  </span>
                </div>
              )}

              {/* New Password */}
              <div className="pt-3">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500"
                    placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {/* New Password Confirm */}
              <div className="pt-3">
                <label
                  htmlFor="confirmPassowrd"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    id="confirmPassowrd"
                    name="confirmPassowrd"
                    type={showPasswordConfirm ? "text" : "password"}
                    required
                    value={formData.confirmPassowrd}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500"
                    placeholder="새 비밀번호를 다시 입력하세요"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isSubmitable() || isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "비밀번호 변경"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
