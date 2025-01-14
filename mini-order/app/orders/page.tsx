'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'
import { ArrowLeft, Calendar, Filter, Star, Coffee, Pizza, IceCream } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getOrderList } from '@/api/order'
import { IOrderListResult } from '@/shared/interfaces'


const foodIcons = [Pizza, Coffee, IceCream]

export default function OrdersPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [orders, setOrders] = useState<IOrderListResult[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const loaderRef = useRef(null)
  const handleRequest = async () => {
    const params = {
      page,
      pageSize: 10,
      status: statusFilter,
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString()
    }
    const res = await getOrderList(params)
    if (res.code === 0) {
      setTotal(res.data.total)
      setHasMore(total > orders.length)
      return res.data.orders
    }
    return []
  }
  const loadMoreOrders = async () => {
    if (!loading && (hasMore || refresh)) {
      setLoading(true)
      const orders = await handleRequest()
      setOrders(prevOrders => [...prevOrders, ...orders])
      setPage(prevPage => prevPage + 1)
      setLoading(false)
      setHasMore(total > orders.length)
    }
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreOrders()
        }
      },
      { threshold: 1.0 }
    )
    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }
    return () => observer.disconnect()
  }, [dateRange, statusFilter, loading, hasMore])

  const handleChangeStatusFilter = async (value: string) => {
    setStatusFilter(value)
    setPage(1)
    setOrders([])
    setRefresh(true)
    await loadMoreOrders()
  }
  const handleChangeDateRange = async (value: DateRange | undefined) => {
    setDateRange(value)
    setPage(1)
    setOrders([])
    setRefresh(true)
    await loadMoreOrders()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white bg-opacity-80 backdrop-blur-md">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
            className="flex items-center p-4"
          >
            <Button variant="ghost" onClick={() => router.back()} className="p-0 mr-4">
              <ArrowLeft className="h-6 w-6 text-pink-500" />
            </Button>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              美味订单历史 🍭
            </h1>
          </motion.div>

          <Card className="m-4 p-4 bg-white rounded-3xl shadow-lg border-2 border-pink-300">
            <div className="flex justify-between items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] pl-3 text-left font-normal rounded-full border-2 border-purple-300 hover:bg-purple-100 transition-all duration-300">
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {dateRange.from.toLocaleDateString()} -{' '}
                          {dateRange.to.toLocaleDateString()}
                        </>
                      ) : (
                        dateRange.from.toLocaleDateString()
                      )
                    ) : (
                      <span>选择日期范围</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 text-purple-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleChangeDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Select onValueChange={handleChangeStatusFilter}>
                <SelectTrigger className="w-[120px] rounded-full border-2 border-pink-300 hover:bg-pink-100 transition-all duration-300">
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="配送中">配送中</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </div>

      <div className="pt-44 pb-4 px-4 max-w-md mx-auto space-y-4">
        <AnimatePresence>
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-xl transition-all duration-300 bg-white rounded-3xl border-2 border-pink-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-purple-600">{order.store.name}</h3>
                    <Badge variant={order.status === "配送中" ? "default" : "secondary"} className="animate-pulse rounded-full px-3 py-1">
                      {order.status === "配送中" ? "🚚 " : "✅ "}
                      {order.status}
                    </Badge>
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full hover:bg-pink-100 hover:text-pink-600 transition-all duration-300">
                      查看详情 👀
                    </Button>
                  </Link>
                </div>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-4 mt-4">
                    <div className="relative">
                      <Image
                        src={item.menuItem?.image?.httpUrl || '/placeholder.svg'}
                        alt={item.menuItem?.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-purple-200"
                      />
                      <span className="absolute -top-2 -left-2 text-2xl">{item.menuItem?.emoji}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-pink-600">{item.menuItem?.name}</h4>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm mr-1">💰</span>
                        <span className="text-lg font-bold text-purple-600">{item.menuItem?.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="mt-4 text-sm text-gray-600 italic bg-pink-50 p-2 rounded-xl">你的美味正在飞奔而来！🏃‍♂️💨</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-pink-400" />
                    {order.createdAt}
                  </p>
                  <div className="flex space-x-2">
                    {Array(3).fill(0).map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.8, rotate: -15 }}
                      >
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 mt-8 bg-white p-6 rounded-3xl shadow-lg"
          >
            <p className="text-xl font-bold text-purple-600">哎呀，没有找到符合条件的订单 😢</p>
            <p className="mt-2 text-pink-500">来试试调整一下筛选条件吧，说不定会有惊喜哦！✨</p>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4"
            >
              <Filter className="h-12 w-12 text-purple-400 mx-auto" />
            </motion.div>
          </motion.div>
        )}

        {hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center py-4">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full border-4 border-pink-300 border-t-purple-500"
            />
          </div>
        )}

        {!hasMore && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 mt-8 bg-white p-6 rounded-3xl shadow-lg"
          >
            <p className="text-xl font-bold text-purple-600">哇！已经到底啦 🎉</p>
            <p className="mt-2 text-pink-500">你已经看完了所有的美味订单，真棒！</p>
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 flex justify-center space-x-4"
            >
              {foodIcons.map((Icon, index) => (
                <Icon key={index} className="h-8 w-8 text-pink-400" />
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

