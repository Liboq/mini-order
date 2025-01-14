'use client'

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, ChevronDown, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IBalanceTransactionDto, TransactionType } from '@/shared/interfaces'
import { getUserBalances } from '@/api'


export default function HappyCoinsHistoryPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<IBalanceTransactionDto[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const handleRequest = async () => {
    const params = {
      page,
      pageSize: 10,
    }
    const res = await getUserBalances(params)
    if (res.code === 0) {
      setTotal(res.data.total)
      setHasMore(total > transactions.length)
      return res.data.data
    }
    return []
  }
  const handleGetUserBalance = async () => {
    const balances = await handleRequest()
    setTransactions(balances)

  }
  useEffect(() => {
    handleGetUserBalance()
  }, [])
  const loadMore = async () => {
    setPage(prevPage => prevPage + 1)
    const balances = await handleRequest()
    setTransactions(prevOrders => [...prevOrders, ...balances])
    setHasMore(total > balances.length)
  }

  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-yellow-100 via-pink-100 to-purple-100 min-h-screen">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-4"
      >
        <Button variant="ghost" onClick={() => router.back()} className="p-0 mr-4">
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <h1 className="text-2xl font-bold text-purple-600">交易历史</h1>
        <Image src="/happy-coin.svg" width={32} height={32} alt="Happy Coin" className="ml-2" />
      </motion.div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300 bg-white rounded-2xl border-2 border-pink-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {transaction.type === TransactionType.CREDIT ? (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-green-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <TrendingDown className="text-red-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-purple-700">{transaction.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {transaction.createdAt}
                    </div>
                  </div>
                </div>
                <Badge variant={transaction.type === TransactionType.CREDIT ? 'default' : 'destructive'} className="text-lg px-3 py-1 rounded-full">
                  {transaction.type === TransactionType.CREDIT ? '+' : '-'}{transaction.amount}
                  <Image src="/happy-coin.svg" width={16} height={16} alt="Happy Coin" className="ml-1 inline" />
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full shadow-md py-4 text-lg font-semibold"
            onClick={loadMore}
          >
            加载更多 <ChevronDown className="ml-2" />
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
          <p className="text-xl font-bold text-purple-600">所有交易都在这里啦！ 🎉</p>
        </motion.div>
      )}
    </div>
  )
}

