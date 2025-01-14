/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, MapPin, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useUserStore } from "@/store";
import {
  ImageInfo,
  IUpdateUserInfoParams,
  IUserInfo,
} from "@/shared/interfaces";
import { updateUserInfo, uploadFile } from "@/api";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const userStore = useUserStore((state) => state);
  const [profile, setProfile] = useState<
    IUpdateUserInfoParams & { avatar?: ImageInfo; email: string }
  >({
    name: "",
    email: "",
  });
  useEffect(() => {
    console.log(userStore.user);
    if (userStore.user) {
      const { name, avatar, email, address } = userStore.user as IUserInfo;
      setProfile(() => {
        return { name, avatar, email, address };
      });
    }
  }, [userStore.user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(e.target.files);

    if (file) {
      updateAvator(file);
    }
  };

  const updateAvator = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadFile(formData);
    if (res.code === 0) {
      setProfile((prev) => ({ ...prev, avatar: res.data }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile);
    if (userStore.user) {
      const { id } = userStore.user as IUserInfo;
      const { avatar: newAvatar, storeId, ...profileReset } = profile;
      const res = await updateUserInfo(id, {
        ...profileReset,
        avatarId: newAvatar?.id,
      });
      if (res.code === 0) {
        userStore.setUser(res.data);
        toast({
          title: "个人信息已更新 🎉",
          description: "您的个人信息已成功保存。",
        });
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-4"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-0 mr-4"
        >
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <h1 className="text-2xl font-bold">个人信息设置 ⚙️</h1>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Image
                  src={profile?.avatar?.httpUrl || "/placeholder.svg"}
                  alt="头像"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 cursor-pointer"
                >
                  <Camera className="h-4 w-4 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">点击图标更换头像</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-2 text-gray-400" />
                <Input
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="姓名"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-2 text-gray-400" />
                <Input
                  name="email"
                  value={profile.email}
                  disabled
                  className="pl-10"
                  placeholder="邮箱"
                  type="email"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-2 text-gray-400" />
                <Input
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="地址"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              保存更改
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
