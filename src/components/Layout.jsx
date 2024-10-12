'use client'

import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    checkScreenSize() // Check once on mount
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  return (
    <div className="flex">
      <Navbar isNavVisible={isNavVisible} setIsNavVisible={setIsNavVisible} />
      <motion.main
        className="flex-1"
        animate={{
          marginRight: isLargeScreen
            ? isNavVisible
              ? '-10px'
              : '-300px'
            : '0px',
          scale: isNavVisible && isLargeScreen ? 0.95 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
