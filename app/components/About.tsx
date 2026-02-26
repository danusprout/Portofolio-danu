// About.tsx
'use client'

import type { About } from '@/app/data/about' // Change to type-only import
import { aboutData } from '@/app/data/about'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function About() {
  const [aboutMe, setAboutMe] = useState<About[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setAboutMe(aboutData)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-auto mt-12 mb-8 lg:ml-[-1.25em] flex items-center space-x-4 text-white">
        <div className="text-[#10B981] text-4xl">
          <HiOutlineExclamationCircle />
        </div>
        <div>
          <h2 className="text-3xl font-bold">About</h2>
          <p className="text-lg mt-2 text-slate-400">Get to know me better.</p>
        </div>
      </div>

      <div className="w-full">
        {aboutMe.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-[#10B981] bg-clip-text text-transparent">
              {item.heading}
            </h3>
            <div className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
              {item.description}
            </div>
          </motion.div>
        ))}

        <motion.div
          className="flex flex-wrap gap-4 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            asChild
            className="rounded-full bg-[#10B981] hover:bg-[#0D9668] text-white font-medium px-6 py-2 transition-all duration-300 hover:scale-105"
          >
            <Link href="mailto:Dhanuwardhan12@gmail.com">Say hi!</Link>
          </Button>

          <Button
            asChild
            className="rounded-full bg-[#273344] hover:bg-[#354459] text-white font-medium px-6 py-2 transition-all duration-300 hover:scale-105"
          >
            <Link
              href="/cv/Syahrial-Danu-Wardhana-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
