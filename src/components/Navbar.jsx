'use client'

import Audio from '@/components/Audio'
import UserProfile from '@/components/UserProfile'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { FaBullseye, FaUser } from 'react-icons/fa'

// مسیرهای ناوبری
const routes = [
  {
    name: 'روز من',
    path: '/',
    icon: <FaBullseye className="w-6 h-6" />,
  },
]

export default function Navbar({ isNavVisible, setIsNavVisible }) {
  const pathname = usePathname()
  const controls = useAnimation()
  const [name, setName] = useState('')
  const [showProfileSetting, setShowProfileSetting] = useState(false)
  const [logo, setLogo] = useState('')

  useEffect(() => {
    // دریافت نام کاربر و لوگو از لوکال استورج
    const storedName = localStorage.getItem('userName')
    const storedLogo = localStorage.getItem('logo')

    if (storedName) {
      setName(storedName)
    }
    if (storedLogo) {
      setLogo(storedLogo)
    }

    // گوش دادن به تغییرات در لوکال استورج
    const handleStorageChange = (e) => {
      if (e.key === 'logo') {
        setLogo(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // پاک کردن گوش‌دهنده
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleNameChange = (e) => {
    const newName = e.target.value
    setName(newName)
    localStorage.setItem('userName', newName) // ذخیره نام کاربر در لوکال استورج
  }

  const toggleNavVisibility = () => {
    if (controls.isAnimating) return

    if (!isNavVisible) {
      setIsNavVisible(true)
      controls.start({ x: '0%', opacity: 1 }) // نمایش نوار ناوبری
    } else {
      controls.start({ x: '100%', opacity: 0.4 }).then(() => {
        setIsNavVisible(false) // پنهان کردن نوار ناوبری
      })
    }
  }

  return (
    <div className="relative hidden lg:block">
      <motion.nav
        initial={{ x: '0%', opacity: 1 }}
        animate={controls}
        exit={{ x: '100%', opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-screen w-60 text-white backdrop px-4 py-8"
      >
        {/* بخش کاربر */}
        <div className="flex items-center gap-2 pb-6">
          <div
            className="flex items-center justify-center w-[59px] h-[40px] rounded-full overflow-hidden cursor-pointer"
            onClick={() => {
              setShowProfileSetting(true) // نمایش تنظیمات پروفایل
            }}
          >
            {logo ? (
              <figure>
                <Image
                  width={90}
                  height={90}
                  src={logo}
                  alt="Profile"
                  className="w-12 h-12 object-cover"
                />
              </figure>
            ) : (
              <FaUser />
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="اسم شما"
              className="bg-transparent w-full border border-white/20 p-2 rounded-2xl placeholder-white/40 focus:outline-none"
            />
          </div>
        </div>

        {/* مسیرهای ناوبری */}
        <ul className="space-y-2 border-t-2 py-4">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.path}
              className={`group flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors duration-300 ${
                pathname === route.path
                  ? 'bg-primary text-white'
                  : 'text-secondary hover:bg-secondary hover:text-black'
              }`}
            >
              {React.cloneElement(route.icon, {
                className: `w-6 h-6 transition-colors duration-300 ${
                  pathname === route.path
                    ? 'text-white'
                    : 'text-primary group-hover:text-black'
                }`,
              })}
              <span className="text-lg">{route.name}</span>
            </Link>
          ))}
        </ul>

        <div className="w-full fixed bottom-0 right-0 py-8">
          <Audio />
        </div>
      </motion.nav>

      {/* دکمه تغییر وضعیت نوار ناوبری */}
      <button
        onClick={toggleNavVisibility}
        className={`fixed top-1/2 ${
          isNavVisible
            ? 'right-[216px] duration-[420ms]'
            : 'right-2 duration-[300ms]'
        } transform -translate-y-1/2 p-2 backdrop text-white rounded-full transition-all cursor-pointer z-10`}
      >
        {isNavVisible ? (
          <AiOutlineArrowRight className="w-6 h-6" />
        ) : (
          <AiOutlineArrowLeft className="w-6 h-6" />
        )}
      </button>

      {/* تنظیمات پروفایل */}
      <UserProfile
        name={name}
        logo={logo}
        setLogo={setLogo}
        showProfileSetting={showProfileSetting}
        setShowProfileSetting={setShowProfileSetting}
        handleNameChange={handleNameChange}
      />
    </div>
  )
}
