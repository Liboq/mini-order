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
import { getUsers, updateUser, deleteUser } from "@/api/admin"
import { User } from "@/api/types/admin"
import { toast } from "sonner"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getUsers({
        page,
        pageSize,
        keyword,
      })
      if (res.code === 0) {
        setUsers(res.data.items)
        setTotal(res.data.total)
      } else {
        toast.error(res.message || "获取用户列表失败")
      }
    } catch {
      toast.error("获取用户列表失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, keyword])

  const handleEdit = async (id: number, data: Partial<User>) => {
    try {
      await updateUser(id, data)
      toast.success("更新成功")
      fetchUsers()
    } catch {
      toast.error("更新失败")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id)
      toast.success("删除成功")
      fetchUsers()
    }catch{
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
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">用户管理</h1>
      </div>

      <div className="flex space-x-2">
        <Input 
          placeholder="搜索用户..." 
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
              <TableHead>姓名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>积分</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <motion.tr key={user.id} variants={item}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.points}</TableCell>
                  <TableCell>
                    <EditDialog
                      title="编辑用户"
                      description="修改用户信息"
                      fields={[
                        { name: "name", label: "姓名", type: "text" },
                        { name: "email", label: "邮箱", type: "email" },
                        { name: "points", label: "积分", type: "number" },
                      ]}
                      onSave={(data) => handleEdit(user.id, data)}
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
                            您确定要删除用户 {user.name} 吗？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user.id)}>确认删除</AlertDialogAction>
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

