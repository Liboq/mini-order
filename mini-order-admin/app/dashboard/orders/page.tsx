"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Search } from 'lucide-react'
import { EditDialog } from "@/components/edit-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getOrders, updateOrder, deleteOrder } from "@/api/admin"
import { Order } from "@/api/types/admin"
import { toast } from "sonner"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getOrders({
        page,
        pageSize,
        keyword,
      })
      if (response.code === 0) {
        setOrders(response.data.items)
        setTotal(response.data.total)
      } else {
        toast.error("获取订单列表失败")
      }
    } catch {
      toast.error("获取订单列表失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, keyword])

  const handleEdit = async (id: number, data: Partial<Order>) => {
    try {
      await updateOrder(id, data)
      toast.success("更新成功")
      fetchOrders()
    } catch  {
      toast.error("更新失败")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id)
      toast.success("删除成功")
      fetchOrders()
    } catch  {
      toast.error("删除失败")
    }
  }

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">订单管理</h1>
      </div>

      <div className="flex space-x-2">
        <Input
          placeholder="搜索订单..."
          className="max-w-sm"
          value={keyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
        />
        <Button variant="secondary" onClick={() => setPage(1)}>
          <Search className="h-4 w-4 mr-2" />
          搜索
        </Button>
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单ID</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>商店</TableHead>
              <TableHead>商品数量</TableHead>
              <TableHead>总价</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: Order) => (
                <motion.tr key={order.id} variants={item}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{order.store.name}</TableCell>
                  <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {order.status === 'completed' ? '已完成' :
                        order.status === 'pending' ? '待处理' : '已取消'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <EditDialog
                      title="编辑订单"
                      description="修改订单状态"
                      fields={[
                        {
                          name: "status",
                          label: "状态",
                          type: "select",
                          options: [
                            { value: "pending", label: "待处理" },
                            { value: "completed", label: "已完成" },
                            { value: "cancelled", label: "已取消" },
                          ]
                        },
                      ]}
                      onSave={(data) => handleEdit(order.id, data)}
                      triggerButton={
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            您确定要删除订单 #{order.id} 吗？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(order.id)}>
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      <div className="flex justify-between items-center">
        <div>
          共 {total} 条记录
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            disabled={page * pageSize >= total}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

