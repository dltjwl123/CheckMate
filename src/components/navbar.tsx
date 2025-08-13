"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "./ui/button";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { user, isLoggedIn } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const pathName = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathName]);

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
                  width={128}
                  height={128}
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-gray-700 font-semibold">
                  {user?.username}
                </span>
              </Link>
            ) : (
              <Link href={"/login"}>
                <Button>로그인</Button>
              </Link>
            )}
          </div>

          {/* Mobile Trigger */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              aria-controls="mobile-menu"
              aria-expanded={open}
              aria-label="메뉴 열기"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Panel */}
      {open && (
        <button
          aria-label="메뉴 닫기"
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id="mobile-menu"
        className={`md:hidden absolute inset-x-0 top-16 w-full
          transition-[transform,opacity] duration-200 origin-top ${
            open
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 -translate-y-2"
          }`}
      >
        <div
          className="bg-white border-b border-gray-200 shadow-sm
          max-h-[calc(100dvh-4rem)] overflow-y-auto"
        >
          <div className="px-4 py-3 space-y-1">
            <Link
              href={"/"}
              className="block px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100"
            >
              문제
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href={"/my-solutions"}
                  className="block px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100"
                >
                  풀이
                </Link>
                <Link
                  href={"/my-reviews"}
                  className="block px-2 py-2 rounded-md text-gray-800 hover:bg-gray-100"
                >
                  리뷰
                </Link>
              </>
            )}

            <div className="h-px bg-gray-200 my-2" />

            {isLoggedIn ? (
              <Link
                href={"/my-page"}
                className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100"
              >
                <Image
                  src={
                    user?.profileImageUrl ||
                    "placeholder.svg?height=40&width=40"
                  }
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {user?.username}
                  </span>
                  <span className="text-xs text-gray-500">마이페이지</span>
                </div>
              </Link>
            ) : (
              <Link href={"/login"} className="block">
                <Button className="w-full mt-2">로그인</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
