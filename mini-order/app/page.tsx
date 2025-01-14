'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ShoppingBag, ClipboardList, Crown } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useUserStore } from '@/store'
import { getTopMenuItems } from '@/api'
import { ITopMenuItemsResult } from '@/shared/interfaces'

export default function Home() {
  const userStore = useUserStore(state => state)
  const [showConfetti, setShowConfetti] = useState(false)
  const [popularItems, setPopularItems] = useState<ITopMenuItemsResult[]>([])
  const handleGetTopMenuItems = async () => {
    const res = await getTopMenuItems()
    if (res.code === 0) {
      console.log(res.data);
      setPopularItems(res.data)
    }
  }

  useEffect(() => {
    handleGetTopMenuItems()
  }, [])

  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [showConfetti])



  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-pink-100 to-white min-h-screen">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-pink-600">欢迎回来 👋</h1>
          <p className="text-lg text-pink-400">准备好享受美味了吗？</p>
        </div>
        <Link href="/profile">
          <Image
            src={userStore.user?.avatar?.httpUrl || "/placeholder.svg"}
            alt="头像"
            width={60}
            height={60}
            className="rounded-full border-4 border-pink-300"
          />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/store-search">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-32 rounded-2xl shadow-lg"
              onClick={() => setShowConfetti(true)}
            >
              <div className="flex flex-col items-center">
                <ShoppingBag className="mb-2 h-10 w-10" />
                <span className="text-2xl font-bold">搜索店铺</span>
                <span className="text-sm">让美味来得更快！</span>
              </div>
            </Button>
          </motion.div>
        </Link>
        <Link href="/orders">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="w-full h-32 rounded-2xl border-4 border-pink-300 hover:bg-pink-100"
            >
              <div className="flex flex-col items-center">
                <ClipboardList className="mb-2 h-10 w-10 text-pink-500" />
                <span className="text-2xl font-bold text-pink-600">我的订单</span>
                <span className="text-sm text-pink-400">查看订单历史</span>
              </div>
            </Button>
          </motion.div>
        </Link>
      </div>

      <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-none rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
          <Crown className="mr-2 h-6 w-6" />
          人气美食排行榜
        </h2>
        <div className="space-y-4">
          {popularItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 bg-white p-3 rounded-xl shadow">
                <div className="relative">
                  <Image src={item.image.httpUrl || '/placeholder.svg'} alt={item.name} width={60} height={60} className="rounded-full" />
                  <div className="absolute -top-2 -left-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="absolute -bottom-2 -right-2 text-2xl">{item.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">已售出 {item.salesCount} 份</p>
                </div>
                <Button size="sm" variant="ghost" className="text-orange-500 hover:text-orange-600 hover:bg-orange-100">
                  查看 →
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

