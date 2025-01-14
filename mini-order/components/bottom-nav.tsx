'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, ClipboardList, User, MessageSquare } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/register' || pathname === '/reset-password') {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
      <div className="flex justify-around py-2">
        <Link
          href="/"
          className={`flex flex-col items-center p-2 ${pathname === '/' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs">首页</span>
        </Link>
        <Link
          href="/menu"
          className={`flex flex-col items-center p-2 ${pathname === '/menu' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <ShoppingBag size={24} />
          <span className="text-xs">点餐</span>
        </Link>
        <Link
          href="/orders"
          className={`flex flex-col items-center p-2 ${pathname === '/orders' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <ClipboardList size={24} />
          <span className="text-xs">订单</span>
        </Link>
        <Link
          href="/messages"
          className={`flex flex-col items-center p-2 ${pathname === '/messages' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <MessageSquare size={24} />
          <span className="text-xs">消息</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center p-2 ${pathname === '/profile' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <User size={24} />
          <span className="text-xs">我的</span>
        </Link>
      </div>
    </nav>
  )
}

