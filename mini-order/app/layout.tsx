'use client'

import { Inter } from 'next/font/google'
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"
import { useEffect } from "react"
import { getUserInfo } from "@/api"
import { useUserStore } from "@/store"
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const uestStore = useUserStore(state => state)
  const getUser = async () => {
    const localToken = localStorage.getItem("token") || ''
    uestStore.setToken(localToken)
    if (!localToken) return
    const res = await getUserInfo()
    if (res.code === 0) {
      uestStore.setUser(res.data)
    }
  }
  useEffect(() => {
    getUser()
  }, [uestStore.token])

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FFF5F2]`}>
        <main className="max-w-md mx-auto min-h-screen pb-16 relative">
          {children}
          <BottomNav />
          <Toaster />
        </main>
      </body>
    </html>
  )
}

