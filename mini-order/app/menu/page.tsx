'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ShoppingCart, Store } from 'lucide-react'
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getUserStore } from '@/api'
import { IUserStoreInfo } from '@/shared/interfaces'
import Link from 'next/link'
import { createOrder } from '@/api/order'



export default function MenuPage() {
  const [stores, setStores] = useState<IUserStoreInfo[]>([])
  const [selectedStore, setSelectedStore] = useState<IUserStoreInfo>()
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("全部")
  const { toast } = useToast()
  const handleGetUserStore = async () => {
    const res = await getUserStore()
    if (res.code === 0) {
      setStores(res.data)
      setSelectedStore(res.data[0])
    }
  }
  useEffect(() => {
    handleGetUserStore()
  }, [])
  useEffect(() => {
    // 重置购物车当选择新店铺时
    setQuantities({})
    setActiveCategory("全部")
  }, [selectedStore])

  const updateQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + delta, 0)
    }))
  }

  const calculateTotal = () => {
    if (!selectedStore?.menuItems) return 0
    return selectedStore.menuItems.reduce((total, item) => {
      return total + (item.price * (quantities[item.id] || 0))
    }, 0)
  }

  const calculatePoints = (total: number) => {
    return Math.floor(total / 10)  // 假设每消费10元获得1积分
  }


  const handleSubmitOrder = async () => {
    if (!selectedStore?.id) return
    const res = await createOrder({
      storeId: selectedStore?.id,
      items: selectedStore?.menuItems.filter(item => quantities[item.id] && quantities[item.id] > 0).map(item => ({
        menuItemId: item.id,
        quantity: quantities[item.id]
      }))
    })
    if (res.code === 0) {
      setIsDialogOpen(false)
      toast({
        title: "订单提交成功 🎉",
        description: `您的订单已提交到${selectedStore?.name}，美味马上就来，请耐心等待哦！`,
      })
      setQuantities({})
    }
  }

  const filteredItems = !selectedStore?.menuItems ? [] : activeCategory === "全部"
    ? selectedStore.menuItems || []
    : selectedStore.menuItems.filter(item => item.category === activeCategory) || []

  const total = calculateTotal()
  const points = calculatePoints(total)

  const categories = ["全部", ...Array.from(new Set(selectedStore?.menuItems?.map(item => item.category) || []))]

  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-pink-100 to-purple-100 min-h-screen">
      {stores.length > 0 && selectedStore
        && <>
          <h1 className="text-2xl font-bold text-purple-700">欢迎光临 👋</h1>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-purple-700">美味菜单 😋</h1>
              <Select onValueChange={(value) => setSelectedStore(stores.find(store => store.id === parseInt(value)) || stores[0])} value={selectedStore?.id.toString()}>
                <SelectTrigger className="w-[180px] bg-white border-2 border-pink-300">
                  <SelectValue placeholder="选择店铺" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      <div className="flex items-center">
                        <Store className="mr-2 h-4 w-4 text-pink-500" />
                        {store.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-md">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">当前选择：{selectedStore && selectedStore.name}</h2>
              <p className="text-sm text-gray-600">挑选您喜欢的美食，开始点餐吧！</p>
            </Card>
          </motion.div>

          <Tabs defaultValue="全部" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-pink-100 rounded-xl p-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700 rounded-lg transition-all"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeCategory} className="mt-4">
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl border-2 border-pink-200">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="relative">
                            <Image
                              src={item.image?.httpUrl || '/placeholder.svg'}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-full"
                            />
                            <span className="absolute -top-2 -left-2 text-2xl">{item.emoji}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-purple-700">{item.name}</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                              <span className="text-sm mr-1">💰</span>
                              <span className="text-xl font-bold text-pink-600">{item.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="rounded-full h-8 w-8 bg-pink-100 border-pink-300 text-pink-600" onClick={() => updateQuantity(item.id, -1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center font-semibold">{quantities[item.id] || 0}</span>
                          <Button size="icon" variant="outline" className="rounded-full h-8 w-8 bg-pink-100 border-pink-300 text-pink-600" onClick={() => updateQuantity(item.id, 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>}

      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6 text-lg font-semibold"
            onClick={() => setIsDialogOpen(true)}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            提交订单 (💰{total})
          </Button>
        </motion.div>
      )}
      {stores.length === 0 && <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center space-y-4 mt-20"
      >
        <Card className="p-6 bg-white rounded-xl border-2 border-pink-200 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">还没有选择店铺哦 😊</h2>
          <p className="text-pink-600 mb-6">快去选择一家店铺，开始美味之旅吧！</p>
          <Link href="/store-search">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-2 px-6 text-lg font-semibold">
              <Store className="mr-2 h-5 w-5" />
              去加入店铺
            </Button>
          </Link>
        </Card>
      </motion.div>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-pink-100 to-purple-100 border-2 border-pink-300 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-700">确认您的订单 🛒</DialogTitle>
            <DialogDescription className="text-pink-600">
              请确认以下订单信息是否正确
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-semibold mb-2 text-purple-700">订单详情：</h3>
            <p className="text-pink-600 mb-2">店铺：{selectedStore?.name}</p>
            {selectedStore?.menuItems.map((item) => (
              quantities[item.id] > 0 && (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="text-pink-600">{item.name} x {quantities[item.id]}</span>
                  <span className="font-semibold text-purple-700">💰{item.price * quantities[item.id]}</span>
                </div>
              )
            ))}
            <div className="border-t border-pink-300 pt-2 mt-2">
              <div className="flex justify-between items-center font-bold">
                <span className="text-purple-700">总计：</span>
                <span className="text-pink-600">💰{total}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>可获得积分：</span>
                <span>{points} 分</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-pink-300 text-pink-600">取消</Button>
            <Button onClick={handleSubmitOrder} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">确认下单</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

