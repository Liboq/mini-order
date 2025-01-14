'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingBag, Search, ClipboardList, MessageSquare, ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Textarea } from '@/components/ui/textarea'
import { updateStore } from '@/api'
import { useUserStore } from '@/store'
import { toast } from '@/hooks/use-toast'
export default function MyStorePage() {
  const [storeName, setStoreName] = useState('我的美味小店')
  const [storeDescription, setStoreDescription] = useState('我的美味小店')
  const userStore = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (userStore.user?.store) {
      setStoreName(userStore.user?.store.name)
      setStoreDescription(userStore.user?.store.description || '')
    }
  }, [userStore.user?.store])
  const handleUpdateStoreName = async () => {
    if (!userStore.user?.store) {
      toast({
        title: "店铺信息未找到",
        description: `请先创建店铺`,
      })
      return
    }
    const res = await updateStore({ name: storeName, description: storeDescription })
    if (res.code === 0) {
      userStore.setUser({ ...userStore.user, store: { ...userStore.user.store, name: storeName, description: storeDescription } })
      setIsEditing(false)
      toast({
        title: "店铺信息已更新",
        description: `店铺名称已更新为${storeName}`,
      })
    }
  }
  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      handleUpdateStoreName()
    }
  }

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }
  useEffect(() => {
    handleConfetti();
  }, []);
  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-pink-100 to-purple-100 min-h-screen">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-4"
      >
        <Button variant="ghost" onClick={() => router.back()} className="p-0">
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <h1 className="text-2xl font-bold text-center flex-grow text-purple-700">我的店铺 🏪</h1>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 space-y-4 bg-white rounded-xl border-2 border-pink-200 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-purple-700">店铺名称</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="bg-pink-100 text-pink-600 border-pink-300 hover:bg-pink-200"
            >
              <Pencil className="mr-2 h-4 w-4" />
              {isEditing ? '保存' : '编辑'}
            </Button>
          </div>
          {isEditing ? (
            <>    <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="text-lg font-medium border-2 border-pink-300 focus:border-pink-500 focus:ring-pink-500"
            />
              < Textarea
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                className="text-md border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                rows={3}
              /> </>

          ) : (
            <>  <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-pink-600 text-center py-2"
            >
              {storeName}
            </motion.div>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-lg text-purple-600 py-2"
              >
                {storeDescription}
              </motion.div> </>


          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/my-store/menu">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200">
              <div className="flex flex-col items-center space-y-2">
                <ShoppingBag className="h-12 w-12 text-orange-500" />
                <span className="text-lg font-medium text-orange-700">菜单管理</span>
              </div>
            </Card>
          </motion.div>
        </Link>
        <Link href="/my-store/orders">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl border-2 border-green-200">
              <div className="flex flex-col items-center space-y-2">
                <ClipboardList className="h-12 w-12 text-teal-500" />
                <span className="text-lg font-medium text-teal-700">订单管理</span>
              </div>
            </Card>
          </motion.div>
        </Link>
      </div>


      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/store-search">
          <Button
            variant="outline"
            className="w-full bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50 rounded-full py-6 text-lg font-semibold"
          >
            <Search className="mr-2 h-6 w-6" /> 搜索其他店铺
          </Button>
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/messages">
          <Button
            variant="outline"
            className="w-full bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50 rounded-full py-6 text-lg font-semibold"
          >
            <MessageSquare className="mr-2 h-6 w-6" /> 消息和请求
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center text-purple-600 italic"
      >
        让我们一起打造最可爱的小店吧！✨
      </motion.div>
    </div>
  )
}

