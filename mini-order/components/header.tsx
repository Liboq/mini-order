"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserStore } from "../store/user/index";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const userStore = useUserStore((state) => state);

  // This would typically be handled by a state management solution or a server-side check

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/reset-password"
  ) {
    return null;
  }

  return (
    <header className="p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-pink-500">
        Mini Order
      </Link>
      {userStore.user ? (
        <Image
          src={
            userStore.user.avatar?.httpUrl || "https://github.com/shadcn.png"
          }
          alt="头像"
          width={100}
          height={100}
          className="rounded-full"
        />
      ) : (
        <Link href="/login">
          <Button variant="ghost" className="text-pink-500">
            登录
          </Button>
        </Link>
      )}
    </header>
  );
}
