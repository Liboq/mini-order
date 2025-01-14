"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Store,
  InfoIcon as InfoCircle,
  LogOut,
  Sparkles,
  Settings,
  LogIn,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const userStore = useUserStore((state) => state);
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const handleConfetti = () => {
    setShowConfetti(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };
  useEffect(() => {
    handleConfetti();
  }, []);

  const handleLogout = () => {
    userStore.clearToken();
    userStore.clearUser();
    router.push("/login");
  };
  const handleLogin = () => {
    router.push("/login");
  };
  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center"
      >
        <Image
          src={userStore.user?.avatar?.httpUrl || "/placeholder.svg"}
          alt="头像"
          width={120}
          height={120}
          className="rounded-full border-4 border-white shadow-lg"
        />
        {userStore.user && <h1 className="text-3xl font-bold mt-4 text-purple-600">
          {userStore.user?.name}的主页 🏠
        </h1>}
        <Badge variant="outline" className="mt-2 bg-white">
          <Sparkles className="w-4 h-4 mr-1 text-yellow-400" />
          超级会员
        </Badge>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/profile/settings">
          <Button variant="ghost" className="absolute top-0 right-0 mt-4">

            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-yellow-200 to-pink-200 border-none rounded-3xl shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 transform rotate-45"></div>
          <h2 className="font-semibold text-lg text-purple-700 mb-2">
            我的快乐钱包 💖
          </h2>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-pink-600">{userStore.user?.balance}</span>
            <Image
              src="/happy-coin.svg"
              width={24}
              height={24}
              alt="Happy Coin"
              className="ml-2"
            />
          </div>
          <Button
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full"
            onClick={() => router.push("/profile/happy-coins")}
          >
            查看详情
          </Button>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none" />
          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl">
            <div className="text-sm text-green-600">我的积分</div>
            <div className="text-xl font-bold mt-1 text-green-700">{userStore.user?.points||0}</div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
            <div className="text-sm text-yellow-600">优惠券</div>
            <div className="text-xl font-bold mt-1 text-yellow-700">0</div>
          </Card>
        </motion.div>
      </div>

      <div className="flex flex-col space-y-2 ">
        <Link href="/my-store">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className="w-full justify-between bg-white hover:bg-pink-50 rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <Store className="mr-2 h-5 w-5 text-pink-500" />
                <span className="text-pink-700">我的店铺 🏪</span>
              </div>
              <ChevronRight className="h-5 w-5 text-pink-400" />
            </Button>
          </motion.div>
        </Link>
        <Link href="/profile/about">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className="w-full justify-between bg-white hover:bg-blue-50 rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <InfoCircle className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-blue-700">关于我们 ℹ️</span>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400" />
            </Button>
          </motion.div>
        </Link>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {userStore.user && (
          <Button
            onClick={handleLogout}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            <LogOut className="mr-2 h-5 w-5" />
            退出登录
          </Button>
        )}
        {!userStore.user && (
          <Button
            onClick={handleLogin}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            <LogIn className="mr-2 h-5 w-5" />
            去登录
          </Button>
        )}
      </motion.div>
    </div>
  );
}
