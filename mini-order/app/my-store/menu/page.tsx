"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, ImageIcon, Edit, Trash, ArrowLeft } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IMenuInfo } from "@/shared/interfaces";
import { addMenu, getMenuList, updateMenu, uploadFile } from "@/api";
import { useUserStore } from "@/store";
import { EmojiPicker } from "@/components/emoji-picker";

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<PartialPick<IMenuInfo, "id">[]>(
    []
  );

  const userStore = useUserStore((state) => state);
  const [categories, setCategories] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<PartialPick<IMenuInfo, "id">>({
    name: "",
    price: 0,
    desc: "",
    category: "",
    emoji: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState("");
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleGetMenuList = async () => {
    const storeId = userStore.user?.store.id;
    if (storeId) {
      const res = await getMenuList(storeId);
      if (res.code === 0) {
        setMenuItems(res.data);
        const initCategories = Array.from(new Set(res.data.map(item => item.category)))
        setCategories(initCategories)
      }
    }
  };
  useEffect(() => {
    handleGetMenuList();
  }, [userStore.user]);

  const handleAddItem = async () => {
    if (userStore.user && newItem.name && newItem.price && newItem.category) {
      const res = await addMenu({
        storeId: userStore.user.store.id,
        name: newItem.name,
        desc: "",
        price: 0,
        category: newCategory,
        imageId: newItem.image?.id,
      });
      if (res.code === 0) {
        setMenuItems([
          ...menuItems,
          {
            price: Number(newItem.price),
            name: newItem.name,
            desc: newItem.desc,
            category: newItem.category,
            emoji: newItem.emoji,
          },
        ]);
        setNewItem({
          name: "",
          price: 0,
          desc: "",
          category: "",
          emoji: "",
        });

        toast({
          title: "菜品添加成功 🎉",
          description: `${newItem.name} 已成功添加到菜单。`,
        });
      }
    } else {
      toast({
        title: "添加失败 ❌",
        description: "请确保填写了菜品名称、价格和分类。",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setIsAddCategoryDialogOpen(false);
      toast({
        title: "分类添加成功 🎉",
        description: `${newCategory} 已成功添加到分类列表。`,
      });
    } else {
      toast({
        title: "添加失败 ❌",
        description: "分类名称不能为空或已存在。",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && !categories.includes(editingCategory)) {
      const oldCategory = categories.find((c) => c === newCategory);
      setCategories(
        categories.map((c) => (c === oldCategory ? editingCategory : c))
      );
      setMenuItems(
        menuItems.map((item) =>
          item.category === oldCategory
            ? { ...item, category: editingCategory }
            : item
        )
      );
      setNewCategory("");
      setEditingCategory("");
      setIsEditCategoryDialogOpen(false);
      toast({
        title: "分类修改成功 🎉",
        description: `分类已成功更新为 ${editingCategory}。`,
      });
    } else {
      toast({
        title: "修改失败 ❌",
        description: "分类名称不能为空或已存在。",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
    setMenuItems(menuItems.filter((item) => item.category !== category));
    toast({
      title: "分类删除成功 🗑️",
      description: `${category} 分类及其所有菜品已被删除。`,
    });
  };

  const handleEditItem = (index: number) => {
    const itemToEdit = menuItems[index];
    if (itemToEdit) {
      setNewItem(itemToEdit);
      setEditingItemId(itemToEdit?.id ?? null);
    }
  };
  const handleUpdateItem = async () => {
    if (
      editingItemId &&
      newItem.name &&
      newItem.price &&
      newItem.category &&
      newItem.desc &&
      newItem.emoji
    ) {
      const res = await updateMenu(editingItemId, {
        name: newItem.name,
        price: Number(newItem.price),
        desc: newItem.desc,
        category: newItem.category,
        imageId: newItem.image?.id,
        emoji: newItem.emoji,
      });
      if (res.code === 0) {
        handleGetMenuList()
        setNewItem({
          name: "",
          price: 0,
          desc: "",
          category: "",
          emoji: "",
        });
        setEditingItemId(null);
        toast({
          title: "菜品更新成功 🎉",
          description: `${newItem.name} 已成功更新。`,
        });
      }
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFile(formData);
      if (res.code === 0) {
        setNewItem({ ...newItem, image: res.data });
      }
    }
  };
  const handleSelectEmoji = (emoji: string) => {
    setNewItem({ ...newItem, emoji });
  }

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-4"
      >
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <h1 className="text-2xl font-bold text-center flex-grow">
          菜单管理 📋
        </h1>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            {editingItemId ? "编辑菜品" : "添加新菜品"} 🍽️
          </h2>
          <div className="flex items-center space-x-4">
            <EmojiPicker
              onEmojiSelect={handleSelectEmoji}
              selectedEmoji={newItem.emoji}
            />
            <div className="flex-1 space-y-4">
              <Input
                placeholder="菜品名称"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="bg-pink-50"
              />
              <Input
                type="number"
                placeholder="价格"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: Number(e.target.value) })
                }
                className="bg-pink-50"
              />
            </div>
          </div>
          <Textarea
            placeholder="描述"
            value={newItem.desc}
            onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
            className="bg-pink-50"
          />
          <Select
            value={newItem.category}
            onValueChange={(value) =>
              setNewItem({ ...newItem, category: value })
            }
          >
            <SelectTrigger className="bg-pink-50">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" /> 上传图片
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <span className="text-sm text-gray-500">
              {newItem.image ? "已选择图片" : "未选择图片"}
            </span>
          </div>
          {newItem.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">图片预览：</p>
              <Image
                src={newItem.image.httpUrl || "/placeholder.svg"}
                alt="菜品预览"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          {editingItemId ? (
            <Button
              onClick={handleUpdateItem}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              更新菜品
            </Button>
          ) : (
            <Button
              onClick={handleAddItem}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> 添加菜品
            </Button>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">分类管理 🏷️</h2>
            <Dialog
              open={isAddCategoryDialogOpen}
              onOpenChange={setIsAddCategoryDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> 添加分类
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新分类</DialogTitle>
                  <DialogDescription>请输入新的分类名称。</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="new-category" className="text-right">
                    分类名称
                  </Label>
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="col-span-3 bg-pink-50"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddCategoryDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button onClick={handleAddCategory}>添加</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex justify-between items-center">
                <span>{category}</span>
                <div>
                  <Dialog
                    open={isEditCategoryDialogOpen}
                    onOpenChange={setIsEditCategoryDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNewCategory(category);
                          setEditingCategory(category);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>编辑分类</DialogTitle>
                        <DialogDescription>
                          请输入新的分类名称。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="edit-category" className="text-right">
                          分类名称
                        </Label>
                        <Input
                          id="edit-category"
                          value={editingCategory}
                          onChange={(e) => setEditingCategory(e.target.value)}
                          className="col-span-3 bg-pink-50"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditCategoryDialogOpen(false)}
                        >
                          取消
                        </Button>
                        <Button onClick={handleEditCategory}>保存</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">当前菜单 🍽️</h2>
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative flex items-center space-x-4">
                <Image
                  src={item.image?.httpUrl || "/placeholder.svg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <span className="absolute -top-2 -left-2 text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                  <p className="text-lg font-bold mt-1">
                    <span className="mr-1">💰</span>
                    {item.price}
                  </p>
                  <p className="text-sm text-gray-500">分类: {item.category}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditItem(index)}
                >
                  编辑
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
