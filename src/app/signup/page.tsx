"use client";

import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import TermsContent from "@/components/terms";
import PrivacyContent from "@/components/privacy";
import Footer from "@/components/footer";
import { useAuth } from "@/context/auth-context";
import {
  sendRegistrationCodeAPI,
  signUpAPI,
  verifyRegistrationCodeAPI,
} from "@/api/authApi";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface AgreementData {
  terms: boolean;
  privacy: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
  general?: string;
}

function Signup() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [showVerificationInput, setShowVerificationInput] =
    useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [agreements, setAgreements] = useState<AgreementData>({
    terms: false,
    privacy: false,
  });
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
        setIsCodeSent(false);
        setVerificationCode("");
      }
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증코드를 입력해주세요",
      }));
      return;
    }

    setIsVerifyingCode(true);
    setErrors((prev) => ({ ...prev, verificationCode: "" }));

    try {
      verifyRegistrationCodeAPI(formData.email, verificationCode);
    } catch {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증코드가 올바르지 않습니다",
      }));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요" }));
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
    setErrors((prev) => ({ ...prev, email: "", general: "" }));

    try {
      await sendRegistrationCodeAPI(formData.email);
      console.log("qwer");
      setIsCodeSent(true);
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

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!isEmailVerified) {
      newErrors.general = "이메일 인증을 완료해주세요";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isSignupEnabled = () => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      isEmailVerified &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 8 &&
      agreements.terms &&
      agreements.privacy
    );
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);

    if (errors.verificationCode) {
      setErrors((prev) => ({ ...prev, verificationCode: "" }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSigningUp(true);

    try {
      signUpAPI(formData.email, formData.password, "청운종");
      setTimeout(() => {
        login("apiRin@example.com", "청운종");
        router.push("/login");
      });
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "회원가입에 실패했습니다. 다시 시도해주세요.",
      }));
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleAgreementChange = (type: "terms" | "privacy") => {
    setAgreements((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-md w-full space-y-8">
          {/* title */}
          <div className="text-center">
            <h2 className="mt-6 text-2xl font-bold text-gray-900">회원가입</h2>
            <p className="mt-2 text-sm text-gray-600">
              CheckMate 커뮤니티에 참여하세요
            </p>
          </div>

          {/* registration form */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">회원가입</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Error message */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Email Input */}
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
                      disabled={isEmailVerified}
                      className={`flex-1 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:reing-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } ${isEmailVerified ? "bg-gray-50" : ""}`}
                      placeholder="example@example.com"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={handleSendVerificationCode}
                      disabled={
                        isSendingCode || isEmailVerified || !formData.email
                      }
                      className="whitespace-nowrap bg-transparent"
                    >
                      {isSendingCode ? (
                        "발송중..."
                      ) : isEmailVerified ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : isCodeSent ? (
                        "재발송"
                      ) : (
                        "인증"
                      )}
                    </Button>
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Verification Code Input */}
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
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        className={`flex-1 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.verificationCode
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="인증코드를 입력하세요"
                        maxLength={6}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isVerifyingCode || !verificationCode}
                      className="whitespace-nowrap"
                    >
                      {isVerifyingCode ? "확인중..." : "확인"}
                    </Button>
                    {errors.verificationCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.verificationCode}
                      </p>
                    )}
                    <p className="mt-1 text-sx text-gray-500">
                      이메일로 발송된 인증코드 6자리를 입력해주세요. test:123456
                    </p>
                  </div>
                )}

                {/* Email Verification Message */}
                {isEmailVerified && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      이메일 인증이 완료되었습니다
                    </span>
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="비밀번호를 입력하세요 (8자 이상)"
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
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Password Confirm Input */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-md
                        shadow-sm placeholder-gray-400 focus:outline-none
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${
                          errors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Agreements Check */}
                <div className="space-y-3">
                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreements.terms}
                      onChange={() => handleAgreementChange("terms")}
                      className="mt-1 h-4 w-4 text-blue-600
                      focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-blue-600 hover:text-blue-500 underline"
                      >
                        이용약관
                      </button>
                      에 동의합니다 (필수)
                    </label>
                  </div>

                  {/* Privacy */}
                  <div className="flex items-start gap-2">
                    <input
                      id="privacy"
                      type="checkbox"
                      checked={agreements.privacy}
                      onChange={() => handleAgreementChange("privacy")}
                      className="mt-1 h-4 w-4 text-blue-600
                      focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-700">
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-blue-600 hover:text-blue-500 underline"
                      >
                        개인정보처리방침
                      </button>
                      에 동의합니다 (필수)
                    </label>
                  </div>
                </div>

                {/* Signup Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isSignupEnabled() || isSigningUp}
                >
                  {isSigningUp ? "처리 중..." : "회원가입"}
                </Button>
              </form>

              {/* Border */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleLogin}
                >
                  로그인
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="이용약관"
      >
        <TermsContent />
      </Modal>

      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="개인정보처리방침"
      >
        <PrivacyContent />
      </Modal>

      <Footer />
    </div>
  );
}

export default Signup;
