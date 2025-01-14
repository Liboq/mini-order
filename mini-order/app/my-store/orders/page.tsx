'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, RefreshCcw, ChevronDown, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getStoreOrderList, updateOrderStatus } from '@/api/order'
import { IOrderListResult } from '@/shared/interfaces'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'



export default function StoreOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrderListResult[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const handleRequest = async () => {
    const params = {
      page,
      pageSize: 10,
    }
    const res = await getStoreOrderList(params)
    if (res.code === 0) {
      setTotal(res.data.total)
      setHasMore(total > orders.length)

      return res.data.orders
    }
    return []
  }
  const handleGetOrders = async () => {
    const orders = await handleRequest()
    setOrders(orders)
  }
  const loadMoreOrders = async () => {
    if (!loading && (hasMore || refresh)) {
      setLoading(true)
      setRefresh(false)
      const orders = await handleRequest()
      setOrders(prevOrders => [...prevOrders, ...orders])
      setPage(prevPage => prevPage + 1)
      setLoading(false)
      setHasMore(total > orders.length)
    }
  }
  useEffect(() => {
    handleGetOrders()
  }, [])


  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus)
    if (res.code === 0) {
      handleRefresh()
    }
  }

  const handleRefresh = () => {
    setRefresh(true)
    setOrders([])
    setPage(1)
    handleGetOrders()
    toast({
      title: '刷新成功',
      description: '订单已刷新',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200 p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="flex items-center mb-6"
      >
        <Button variant="ghost" onClick={() => router.back()} className="p-0 mr-4">
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <h1 className="text-2xl font-bold text-purple-600">店铺订单 🛍️</h1>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Button
          onClick={handleRefresh}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full py-6 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? (
            <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-5 w-5" />
          )}
          刷新订单
        </Button>
      </motion.div>

      <AnimatePresence>
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="mb-4 p-6 bg-white rounded-3xl shadow-lg border-2 border-pink-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-purple-600 mb-1">{order.store.name}</h3>
                  <p className="text-sm text-gray-500">订单 #{order.id} • {order.createdAt}</p>
                </div>
                <Badge
                  variant={
                    order.status === '待处理' ? "default" :
                      order.status === '处理中' ? "secondary" :
                        order.status === '已完成' ? "outline" : "destructive"
                  }
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {order.status}
                </Badge>
                <Link href={`/my-store/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="rounded-full hover:bg-pink-100 hover:text-pink-600 transition-all duration-300">
                    查看详情 👀
                  </Button>
                </Link>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{item.menuItem.emoji}</span>
                      <span className="text-gray-800">{item.menuItem.name}</span>
                    </div>
                    <span className="text-gray-600">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-lg">
                  总计: <span className="text-pink-500">💰{order.totalPrice}</span>
                </p>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-yellow-600 font-semibold">{(Math.random() * 2 + 3).toFixed(1)}</span>
                </div>
              </div>
              <Select onValueChange={(value) => handleStatusChange(order.id, value)}>
                <SelectTrigger className="w-full rounded-full border-2 border-purple-300 hover:bg-purple-100 transition-colors duration-300">
                  <SelectValue placeholder="更新状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="待处理">待处理 ⏳</SelectItem>
                  <SelectItem value="处理中">处理中 🔧</SelectItem>
                  <SelectItem value="已完成">已完成 ✅</SelectItem>
                  <SelectItem value="已取消">已取消 ❌</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <Button
            onClick={loadMoreOrders}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-full py-4 text-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
          >
            加载更多订单
            <ChevronDown className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {!hasMore && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center bg-white p-6 rounded-3xl shadow-lg border-2 border-purple-200"
        >
          <Package className="h-12 w-12 mx-auto text-purple-500 mb-2" />
          <p className="text-xl font-bold text-purple-600">所有订单都在这里啦！ 🎉</p>
          <p className="mt-2 text-pink-500">继续加油，让更多顾客品尝到你的美味吧！</p>
        </motion.div>
      )}
    </div>
  )
}

