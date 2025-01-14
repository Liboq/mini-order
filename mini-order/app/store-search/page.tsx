'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Star, PlusCircle, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { getStoreList, joinStore } from '@/api'
import { IStoreListResult } from '@/shared/interfaces'

export default function StoreSearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stores, setStores] = useState<IStoreListResult[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const handleSearch = async () => {
    // 这里应该是搜索店铺的逻辑
    const res = await getStoreList({ name: searchTerm })
    if (res.code === 0) {
      setStores(res.data)
    }
  }
  
  useEffect(() => {
    handleSearch()
  }, [])
  const handleSelectStore = async (storeId: number) => {
    // 这里应该是选择店铺的逻辑
    const res = await joinStore({ storeId })
    if (res.code === 0) {
      handleSearch()
      toast({
        title: "请求已发送 🎉",
        description: "店铺已收到您的点餐请求，请等待确认。",
      })
    }
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
        <h1 className="text-2xl font-bold text-center flex-grow text-purple-600">搜索店铺 🔍</h1>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex space-x-2">
          <Input
            placeholder="输入店铺名称"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white border-pink-300 focus:border-pink-500 focus:ring-pink-500"
          />
          <Button onClick={handleSearch} className="bg-pink-500 hover:bg-pink-600 text-white">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {stores.length > 0 && <div className="space-y-4">
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl border-2 border-pink-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image src={store.user.avatar?.httpUrl || '/placeholder.svg'} alt={store.name} width={80} height={80} className="rounded-full" />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Star className="h-4 w-4 text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-purple-700">{store.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{5}</span>
                  </div>
                </div>
                {!store.userStatus ? <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectStore(store.id)}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 text-white border-none hover:from-pink-500 hover:to-purple-500"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  选择店铺
                </Button> : <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-pink-400 to-purple-400 text-white border-none hover:from-pink-500 hover:to-purple-500"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {store.userStatus === 'pending' ? '等待确认' : '已加入'}
                </Button>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6 text-lg font-semibold">
          加载更多可爱店铺 💖
        </Button>
      </motion.div>
    </div>
  )
}