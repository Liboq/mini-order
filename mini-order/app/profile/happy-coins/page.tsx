'use client'

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getUserBalances } from '@/api'
import { IBalanceTransactionDto, TransactionType } from '@/shared/interfaces'
import { useUserStore } from '@/store'


export default function HappyCoinsPage() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userStore = useUserStore()
  const [transactions, setTransactions] = useState<IBalanceTransactionDto[]>([])
  const handleGetUserBalance = async () => {
    const res = await getUserBalances({ page: 1, limit: 10 })
    if (res.code === 0) {
      setTransactions(res.data.data)
    }
  }
  useEffect(() => {
    handleGetUserBalance()
  }, [])
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
        <h1 className="text-2xl font-bold text-purple-600">快乐币详情</h1>
        <Image src="/happy-coin.svg" width={32} height={32} alt="Happy Coin" className="ml-2" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-yellow-200 to-pink-200 border-none rounded-3xl shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 transform rotate-45"></div>
          <h2 className="font-semibold text-lg text-purple-700 mb-2">当前快乐币余额</h2>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-4xl font-bold text-pink-600">{userStore.user?.balance}</span>
            <Image src="/happy-coin.svg" width={24} height={24} alt="Happy Coin" className="ml-2" />
          </div>
          <div className="mt-4 text-sm text-purple-600">开心每一天，快乐随心来~</div>
        </Card>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700 flex items-center">
          <Star className="mr-2 text-yellow-400" />
          最近交易
        </h2>
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
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
                      {new Date(transaction.createdAt).toLocaleDateString()}
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

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full shadow-md py-6 text-lg font-semibold"
          onClick={() => router.push('/profile/happy-coins/history')}
        >
          查看更多交易
        </Button>
      </motion.div>
    </div>
  )
}

