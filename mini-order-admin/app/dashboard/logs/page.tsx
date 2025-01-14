"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLogs } from "@/api"
import { ILogItem } from "@/interfaces/log.interface"

export default function LogsPage() {
  const [logs, setLogs] = useState<ILogItem[]>([])

  const fetchLogs = async () => {
    const res = await getLogs({
      page: 1,
      pageSize: 10,
    })
    if (res.code === 0) {
      setLogs(res.data.items)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

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
        <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">操作记录</h1>
      </div>

      <div className="flex space-x-2">
        <Input
          placeholder="搜索操作记录..."
          className="max-w-sm"
        />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择用户" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有用户</SelectItem>
            <SelectItem value="alice">Alice</SelectItem>
            <SelectItem value="bob">Bob</SelectItem>
            <SelectItem value="charlie">Charlie</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary">
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
              <TableHead>用户</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>模块</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <motion.tr key={log.id} variants={item}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.user?.email || log.admin?.email}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>{log.area}</TableCell>
                <TableCell>{log.createdAt}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  )
}

