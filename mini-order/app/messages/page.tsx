'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { getMemberships, updateMembership } from '@/api'
import { IMembershipsResult } from '@/shared/interfaces'
import { useUserStore } from '@/store'

export default function MessagesPage() {
  const [memberShips, setMemberShips] = useState<IMembershipsResult[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const userStore = useUserStore()
  const handleGetMemberships = async () => {
    const res = await getMemberships()
    if (res.code === 0) {
      setMemberShips(res.data)
    }
  }
  const handleUpdateMembership = async (id: number, status: boolean) => {
    if (!userStore.user?.store.id) {
      toast({
        title: "您还没有店铺",
        description: `请先创建店铺`,
      })
      return
    }
    const res = await updateMembership({ userId: id, accept: status, storeId: userStore.user?.store.id })
    if (res.code === 0) {
      toast({
        title: status ? "请求已接受 ✅" : "请求已拒绝 ❌",
        description: `您已${status ? '接受' : '拒绝'}了来自${memberShips.find(r => r.id === id)?.user}的请求。`,
      })
      handleGetMemberships()
    }
  }
  useEffect(() => {
    handleGetMemberships()
  }, [])


  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-pink-100 to-purple-100 min-h-screen">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-4"
      >
        <Button variant="ghost" onClick={() => router.back()} className="p-0 mr-4">
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <h1 className="text-2xl font-bold text-center flex-grow text-purple-700">消息和请求 💌</h1>
      </motion.div>

      <div className="space-y-4">
        {memberShips.map((memberShip, index) => (
          <motion.div
            key={memberShip.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl border-2 border-pink-200">
              <div className="flex justify-between items-start mb-2">
                <div className='flex-1'>
                  <h3 className="font-semibold text-purple-700">{memberShip.user.name}</h3>
                  <p className="text-sm text-pink-500">想要将 <span className='text-green-500'>你的店铺</span> 添加为点餐店铺</p>
                </div>
                <Badge variant={memberShip.status === 'pending' ? 'default' : memberShip.status === 'accepted' ? 'outline' : 'destructive'} className="ml-3">
                  {memberShip.status === 'pending' ? '待处理' : memberShip.status === 'accepted' ? '已接受' : '已拒绝'}
                </Badge>
              </div>
              {memberShip.status === 'pending' && (
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateMembership(memberShip.user.id, true)}
                    className="bg-green-100 text-green-600 border-green-300 hover:bg-green-200"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    接受
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateMembership(memberShip.id, false)}
                    className="bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    拒绝
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {memberShips.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500 mt-8"
        >
          <p className="text-xl">暂无新消息 😴</p>
          <p className="mt-2">休息一下，喝杯奶茶吧！🧋</p>
        </motion.div>
      )}
    </div>
  )
}

