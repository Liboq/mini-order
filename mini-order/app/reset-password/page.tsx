'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, Key } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// 模拟验证码生成函数
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isCodeVerified, setIsCodeVerified] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  const handleSendEmail = () => {
    const code = generateVerificationCode()
    setGeneratedCode(code)
    // 这里应该发送包含验证码的邮件
    console.log('Sending email with verification code:', code)
    toast({
      title: "验证码已发送 📧",
      description: "请查看您的邮箱，输入收到的 6 位验证码。",
    })
    setIsCodeSent(true)
  }

  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      toast({
        title: "验证成功 ✅",
        description: "请设置您的新密码。",
      })
      setIsCodeVerified(true)
    } else {
      toast({
        title: "验证失败 ❌",
        description: "验证码不正确，请重新输入。",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "密码不匹配 ❌",
        description: "两次输入的密码不一致，请重新输入。",
        variant: "destructive",
      })
      return
    }
    // 这里应该更新用户的密码
    console.log('Resetting password for:', email)
    toast({
      title: "密码重置成功 🎉",
      description: "您的密码已成功重置，请使用新密码登录。",
    })
    router.push('/login')
  }

  return (
    <div className="p-4 space-y-6 flex flex-col min-h-screen bg-gradient-to-b from-pink-100 to-white">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center"
      >
        <Button variant="ghost" onClick={() => router.back()} className="p-0 mr-4">
          <ArrowLeft className="h-6 w-6 text-pink-500" />
        </Button>
        <h1 className="text-3xl font-bold text-center flex-grow text-pink-600">重置密码 🔐</h1>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="email"
                placeholder="输入您的邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>
            {!isCodeSent ? (
              <Button type="button" onClick={handleSendEmail} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                发送验证码
              </Button>
            ) : (
              <>
                <div className="relative">
                  <Key className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="输入 6 位验证码"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                    required
                    maxLength={6}
                  />
                </div>
                {!isCodeVerified ? (
                  <Button type="button" onClick={handleVerifyCode} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    验证
                  </Button>
                ) : (
                  <>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="输入新密码"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="确认新密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      重置密码
                    </Button>
                  </>
                )}
              </>
            )}
          </form>
        </Card>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <Link href="/login" className="text-pink-500 hover:underline">
          返回登录页面
        </Link>
      </motion.div>
    </div>
  )
}

