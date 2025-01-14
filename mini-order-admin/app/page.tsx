"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { IceCream, Lock } from 'lucide-react'
import { sendCode, login } from "@/api"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [code, setCode] = useState('000000')
  const [email, setEmail] = useState('7758258@qq.com')
  const [password, setPassword] = useState('c123456')
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await sendCode({ email })
      if (res.code === 0) {
        setCode(res.data.code)
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } catch {
      toast({
        title: "发送验证码失败",
        variant: "destructive",
      })
    }
  }

  const handleLogin = async () => {
    const res = await login({ email, password, code })
    console.log(res);

    if (res.code === 0) {
      localStorage.setItem('token', res.data.token)
      router.push('/dashboard')
    } else {
      toast({
        title: "登录失败",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <Card className="w-96 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center">
            <IceCream className="mr-2 h-8 w-8 text-pink-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              mini后台
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">邮箱</Label>
              <Input id="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入用户名" required />
            </div>
            <div className="space-y-2 ">
              <Label htmlFor="password">密码</Label>
              <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="请输入密码" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">验证码</Label>
              <div className="flex items-center space-x-2">
                <Input id="password" value={code} type="password" onChange={(e) => setCode(e.target.value)} placeholder="请输入验证码" required />
                <Button onClick={handleSendCode} disabled={countdown > 0}>
                  {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
              <Lock className="mr-2 h-4 w-4" /> 登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

