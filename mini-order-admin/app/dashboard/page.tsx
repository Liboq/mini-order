"use client"

import { motion } from "framer-motion"
import { Users, ShoppingBag, Store, DollarSign, TrendingUp, Heart, Star, Coffee } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DonutChart } from "@/components/donut-chart"

const MotionCard = motion(Card)

const statsData = [
  { title: "总用户数", value: "1,234", icon: Users, color: "text-pink-500" },
  { title: "总订单数", value: "5,678", icon: ShoppingBag, color: "text-purple-500" },
  { title: "总店铺数", value: "42", icon: Store, color: "text-blue-500" },
  { title: "总收入", value: "$123,456", icon: DollarSign, color: "text-green-500" },
]

const trendData = [
  { title: "增长率", value: "+12.5%", icon: TrendingUp, color: "text-emerald-500" },
  { title: "客户满意度", value: "4.8/5", icon: Heart, color: "text-red-500" },
  { title: "平均评分", value: "4.9", icon: Star, color: "text-yellow-500" },
  { title: "回头客比例", value: "68%", icon: Coffee, color: "text-amber-500" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.h1 
        className="text-4xl font-bold text-pink-600 dark:text-pink-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        欢迎回来，可爱的管理员！
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <MotionCard 
            key={stat.title}
            className="overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </MotionCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MotionCard
          className="overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-purple-600 dark:text-purple-400">趋势概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {trendData.map((trend) => (
                <div key={trend.title} className="flex items-center space-x-2">
                  <trend.icon className={`h-8 w-8 ${trend.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{trend.title}</p>
                    <p className="text-xl font-semibold">{trend.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard
          className="overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-600 dark:text-blue-400">系统概览</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart />
          </CardContent>
        </MotionCard>
      </div>
    </div>
  )
}

