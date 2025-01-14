'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import {  login } from '@/api'
import { useUserStore } from '@/store'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const userStore = useUserStore(state => state)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await login({ email, password })
    if (res.code === 0) {
      userStore.setToken(res.data.token)
      router.push('/')
    }
  }
  return (
    <div className="p-4 space-y-6 flex flex-col min-h-screen bg-gradient-to-b from-pink-100 to-white">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mt-10 text-pink-600">欢迎回来 👋</h1>
        <p className="text-center text-gray-600 mt-2">准备好享受美味了吗？</p>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-2 text-gray-400" />
              <Input
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2 text-gray-400" />
              <Input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div className="text-right">
              <Link href="/reset-password" className="text-sm text-pink-500 hover:underline">
                忘记密码？
              </Link>
            </div>
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              登录
            </Button>
          </form>
        </Card>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <Link href="/register" className="text-pink-500 hover:underline">
          还没有账号？立即注册 🚀
        </Link>
      </motion.div>
    </div>
  )
}

