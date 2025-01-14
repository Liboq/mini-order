"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Search, Store as StoreIcon } from 'lucide-react'
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
import { getStores, updateStore, deleteStore, createStore } from "@/api/admin"
import { Store } from "@/api/types/admin"
import { toast } from "sonner"

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await getStores({
        page,
        pageSize,
        keyword,
      })
      if (response.code === 0) {  
        setStores(response.data.items)
        setTotal(response.data.total)
      } else {
        toast.error("获取商店列表失败")
      }
    } catch  {
      toast.error("获取商店列表失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [page, keyword])

  const handleEdit = async (id: number, data: Partial<Store>) => {
    try {
      await updateStore(id, data)
      toast.success("更新成功")
      fetchStores()
    } catch {
      toast.error("更新失败")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteStore(id)
      toast.success("删除成功")
      fetchStores()
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

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">商店管理</h1>
        <EditDialog
          title="添加商店"
          description="添加新商店信息"
          fields={[
            { name: "name", label: "商店名称", type: "text" },
            { name: "description", label: "描述", type: "textarea" },
          ]}
          onSave={async (data) => {
            try {
              await createStore(data)
              toast.success("添加成功")
              fetchStores()
            } catch {
              toast.error("添加失败")
            }
          }}
          triggerButton={
            <Button className="bg-purple-500 hover:bg-purple-600">
              <StoreIcon className="mr-2 h-4 w-4" /> 添加商店
            </Button>
          }
        />
      </div>

      <div className="flex space-x-2">
        <Input 
          placeholder="搜索商店..." 
          className="max-w-sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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
              <TableHead>ID</TableHead>
              <TableHead>商店名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>店主</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              stores.map((store) => (
                <motion.tr key={store.id} variants={item}>
                  <TableCell>{store.id}</TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.description || '-'}</TableCell>
                  <TableCell>{store.user?.name || '-'}</TableCell>
                  <TableCell>{new Date(store.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <EditDialog
                      title="编辑商店"
                      description="修改商店信息"
                      fields={[
                        { name: "name", label: "商店名称", type: "text" },
                        { name: "description", label: "描述", type: "textarea" },
                      ]}
                      onSave={(data) => handleEdit(store.id, data)}
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
                            您确定要删除商店 {store.name} 吗？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(store.id)}>
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

