import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IceCream, Users, ShoppingBag, Store, LayoutDashboard } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-center flex items-center justify-center text-pink-600">
              <IceCream className="mr-2 h-8 w-8" />
              mini后台
            </h1>
          </div>
          <nav className="mt-8">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4 text-pink-500" />
                仪表板
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/users">
                <Users className="mr-2 h-4 w-4 text-purple-500" />
                用户管理
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/orders">
                <ShoppingBag className="mr-2 h-4 w-4 text-indigo-500" />
                订单管理
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/stores">
                <Store className="mr-2 h-4 w-4 text-blue-500" />
                店铺管理
              </Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

