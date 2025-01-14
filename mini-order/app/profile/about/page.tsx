'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Coffee, Pizza, Utensils, Phone, Mail, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import confetti from 'canvas-confetti'

const teamMembers = [
    { name: "小明", role: "创始人兼首席美食官", avatar: "/placeholder.svg", fact: "最爱吃辣" },
    { name: "小红", role: "技术总监", avatar: "/placeholder.svg", fact: "每天都要喝奶茶" },
    { name: "小华", role: "客户服务经理", avatar: "/placeholder.svg", fact: "会做超好吃的蛋糕" },
]

const funFacts = [
    "我们的团队共吃掉了10000+个汉堡! 🍔",
    "我们最远的外卖送到了珠穆朗玛峰大本营! 🏔️",
    "我们有一位员工可以用筷子夹起西瓜籽! 🥢",
    "我们办公室有一只会点单的猫咪! 🐱",
]

export default function AboutPage() {
    const router = useRouter()
    const [hoveredMember, setHoveredMember] = useState<number | null>(null)
    const [visibleFact, setVisibleFact] = useState(0)

    const handleConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200 p-4">
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center mb-6"
            >
                <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                    <ArrowLeft className="h-6 w-6 text-pink-500" />
                </Button>
                <h1 className="text-3xl font-bold text-purple-600">关于我们 🌈</h1>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="p-6 mb-6 bg-white rounded-3xl shadow-lg border-4 border-pink-300">
                    <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">我们的故事 📖</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        从一个小小的创意开始,我们的美食冒险就这样展开啦! 🚀 我们热爱美食,更热爱把美食带给每一个人。
                        无论你是美食达人还是小小吃货,在这里,你都能找到让味蕾跳舞的美味! 💃🕺
                    </p>
                    <div className="flex justify-center">
                        <Button
                            onClick={handleConfetti}
                            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full px-6 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            <Heart className="mr-2 h-5 w-5" /> 为美食打call!
                        </Button>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="p-6 mb-6 bg-white rounded-3xl shadow-lg border-4 border-yellow-300">
                    <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">我们的团队 👥</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                whileHover={{ scale: 1.05 }}
                                onHoverStart={() => setHoveredMember(index)}
                                onHoverEnd={() => setHoveredMember(null)}
                            >
                                <Card className="p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-md border-2 border-purple-200 overflow-hidden">
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <Image
                                            src={member.avatar}
                                            alt={member.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-full"
                                        />
                                        <AnimatePresence>
                                            {hoveredMember === index && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                                                >
                                                    <p className="text-white text-center text-sm p-2">{member.fact}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <h3 className="text-xl font-semibold text-center text-purple-600">{member.name}</h3>
                                    <p className="text-sm text-center text-gray-600">{member.role}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="p-6 mb-6 bg-white rounded-3xl shadow-lg border-4 border-green-300">
                    <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">有趣的小知识 🎈</h2>
                    <div className="relative h-24">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={visibleFact}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-lg text-center text-gray-700 absolute inset-0 flex items-center justify-center"
                            >
                                {funFacts[visibleFact]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button
                            onClick={() => setVisibleFact((prev) => (prev + 1) % funFacts.length)}
                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full px-6 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            下一个趣事 🔄
                        </Button>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Card className="p-6 bg-white rounded-3xl shadow-lg border-4 border-blue-300">
                    <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">联系我们 📞</h2>
                    <div className="flex flex-wrap justify-center gap-4"> {/* Updated grid to flex */}
                        <Button variant="outline" className="flex items-center justify-center space-x-2 rounded-full py-4 px-6 text-base sm:text-lg hover:bg-pink-100 hover:text-pink-600 transition-colors duration-300 flex-grow"> {/* Updated Button className */}
                            <Phone className="h-6 w-6" />
                            <span>123-456-7890</span> {/* Updated phone number */}
                        </Button>
                        <Button variant="outline" className="flex items-center justify-center space-x-2 rounded-full py-4 px-6 text-base sm:text-lg hover:bg-purple-100 hover:text-purple-600 transition-colors duration-300 flex-grow"> {/* Updated Button className */}
                            <Mail className="h-6 w-6" />
                            <span>hello@mini.com</span> {/* Updated email */}
                        </Button>
                        <Button variant="outline" className="flex items-center justify-center space-x-2 rounded-full py-4 px-6 text-base sm:text-lg hover:bg-yellow-100 hover:text-yellow-600 transition-colors duration-300 flex-grow"> {/* Updated Button className */}
                            <MapPin className="h-6 w-6" />
                            <span>美食街88号</span> {/* Updated address */}
                        </Button>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-8 text-center"
            >
                <p className="text-lg text-purple-600 font-semibold">来和我们一起享受美食的旅程吧! 🍽️✨</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <Coffee className="h-8 w-8 text-yellow-500" />
                    <Pizza className="h-8 w-8 text-red-500" />
                    <Utensils className="h-8 w-8 text-green-500" />
                </div>
            </motion.div>
        </div>
    )
}

