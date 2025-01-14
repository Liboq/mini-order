'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail,Code, Lock } from 'lucide-react'
import { register, sendRegisterCode } from '@/api'
import { toast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await sendRegisterCode(email)
    console.log(res);
    
    if (res.code === 0) {
      toast({
        title: '发送成功',
        description: '验证码已发送至邮箱',
      })
    }else{
      toast({
        title: '发送失败',
        description: res.message,
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Clear previous errors
    await register({ email, code, password })
    // Basic password validation
    if (password.length < 6) {
      setError('密码长度至少为6个字符')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    // Here you would typically handle the registration logic
    console.log('Registration attempt with:', { email, password, confirmPassword })
    router.push('/login')
  }

  return (
    <div className="p-4 space-y-6 flex flex-col min-h-screen bg-gradient-to-b from-pink-100 to-white">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mt-10 text-pink-600">加入我们 🎉</h1>
        <p className="text-center text-gray-600 mt-2">创建账号，开启美食之旅！</p>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative flex gap-3">
              <Mail className="absolute left-3 top-1 text-gray-400" />
              <Input
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div className="relative flex gap-3">
              <Code className="absolute left-3 top-1 text-gray-400" />
              <Input
                type="tel"  
                placeholder="验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
              <Button onClick={handleSendEmail}  className=" bg-pink-500 hover:bg-pink-600 text-white">
                发送验证码
              </Button>
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
            <div className="relative">
              <Lock className="absolute left-3 top-2 text-gray-400" />
              <Input
                type="password"
                placeholder="确认密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              注册
            </Button>
          </form>
        </Card>
      </motion.div>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-red-500 text-center"
        >
          {error}
        </motion.div>
      )}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <Link href="/login" className="text-pink-500 hover:underline">
          已有账号？立即登录 🚀
        </Link>
      </motion.div>
    </div>
  )
}

