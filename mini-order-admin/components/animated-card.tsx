"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface AnimatedCardProps {
  delay?: number
  children?: React.ReactNode
}

export function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  )
}

