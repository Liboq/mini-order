"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IceCream, Users, ShoppingBag, Store, LayoutDashboard, ChevronLeft, ChevronRight, History, LogOut } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, text: "仪表板" },
  { href: "/dashboard/users", icon: Users, text: "用户管理" },
  { href: "/dashboard/orders", icon: ShoppingBag, text: "订单管理" },
  { href: "/dashboard/stores", icon: Store, text: "店铺管理" },
  { href: "/dashboard/logs", icon: History, text: "操作记录" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [])
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <div className="flex h-screen">
        <motion.aside
          className="bg-white flex flex-col items-center dark:bg-gray-800 shadow-md h-full overflow-hidden"
          initial={{ width: "16rem" }}
          animate={{ width: isCollapsed ? "4rem" : "16rem" }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4  flex justify-between items-center">
            <motion.h1
              className="text-2xl font-bold text-center flex items-center text-pink-600 dark:text-pink-400"
              animate={{ opacity: isCollapsed ? 0 : 1 }}
            >
              <IceCream className="h-8 w-8" />
              <span className="ml-2">mini后台</span>
            </motion.h1>
            <ThemeToggle />
          </div>
          <nav className="mt-8 flex-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <motion.div
                    className="flex items-center"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <item.icon className="h-4 w-4 text-pink-600 *:hover:text-pink-400  dark:text-pink-400 mr-2" />
                    <span className={isCollapsed ? "hidden" : "text-pink-600 *:hover:text-pink-400 dark:text-pink-400"}>{item.text}</span>
                  </motion.div>
                </Link>
              </Button>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="w-full m-1 bg-red-400 text-white"
            onClick={() => handleLogout()}
          >
            <LogOut />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full bg-green-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </motion.aside>
        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

