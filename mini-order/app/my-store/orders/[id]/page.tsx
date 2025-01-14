'use client'

import { useParams } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Clock, ArrowLeft } from 'lucide-react'
import { getOrderDetail } from '@/api/order'
import { useEffect, useState } from 'react'
import { IOrderDetail } from '@/shared/interfaces'
import { useRouter } from 'next/navigation'

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = Number(params.id)
  const router = useRouter()
  const [orderDetail, setOrderDetail] = useState<IOrderDetail>()
  const handleGetOrderDetail = async () => {
    const res = await getOrderDetail(orderId)
    if (res.code === 0) {
      setOrderDetail(res.data)
    }
    return null
  }
  useEffect(() => {
    handleGetOrderDetail()
  }, [])

  return (
    <div className="p-4 space-y-6">
      {orderDetail && (<>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" onClick={() => router.back()} className="p-0">
            <ArrowLeft className="h-6 w-6 text-pink-500" />
          </Button>
          <h1 className="text-2xl font-bold text-center">订单详情 📦</h1>
          <p className="text-center text-gray-500">订单号: {orderDetail.id}</p>
        </motion.div>

        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">订单状态</h2>
            <Badge variant="secondary" className="animate-pulse text-lg px-3 py-1">
              {orderDetail.status === "pending" ? "🚚 " : "✅ "}
              {orderDetail.status}
            </Badge>
          </div>
          <p className="text-gray-600 italic">你的美味正在飞奔而来！🏃‍♂️💨</p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">订单内容</h2>
          {orderDetail.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={item.menuItem.image?.httpUrl || '/placeholder.svg'}
                    alt={item.menuItem.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <span className="absolute -top-1 -right-1 text-xl">{item.menuItem.emoji}</span>
                </div>
                <div>
                  <p className="font-medium">{item.menuItem.name}</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold"><span className="mr-1">💰</span>{item.menuItem.price * item.quantity}</p>
            </motion.div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">总计</p>
              <p className="text-xl font-bold"><span className="mr-1">💰</span>{orderDetail.totalPrice}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">配送信息</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="text-pink-500" />
              <p>{orderDetail.store.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-pink-500" />
              <p>预计送达时间: 秘密</p>
            </div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            联系店家 🎧
          </Button>
        </motion.div>
      </>)}
    </div>
  )
}

