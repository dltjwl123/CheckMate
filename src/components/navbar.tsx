"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "./ui/button";
import { useAuth } from "@/context/auth-context";

function Navbar() {
  const { user, isLoggedIn } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={"/"} className="text-2xl font-bold text-gray-900">
              CheckMate
            </Link>
          </div>

          {/* Navigations */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={"/"}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              문제
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href={"/my-solutions"}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  풀이{" "}
                </Link>
                <Link
                  href={"/my-reviews"}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  리뷰{" "}
                </Link>
              </>
            )}
            {isLoggedIn ? (
              <Link href={"/my-page"} className="flex items-center space-x-3">
                <Image
                  src={
                    user?.profileImageUrl ||
                    "placeholder.svg?height=40&width=40"
                  }
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-200"
                />
                <span className="text-gray-700 font-semibold">
                  {user?.username}
                </span>
              </Link>
            ) : (
              <Link href={"login"}>
                <Button>로그인</Button>
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Button variant="outline" size="sm">
              메뉴
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
