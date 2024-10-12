'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'

export default function UserProfile({
  showProfileSetting,
  setShowProfileSetting,
  name,
  logo,
  setLogo,
  handleNameChange,
}) {
  useEffect(() => {
    // چک کردن آیا تصویر قبلا در لوکال استورج ذخیره شده است
    const storedImage = localStorage.getItem('logo')
    if (storedImage) {
      setLogo(storedImage)
    }
  }, [setLogo]) // اضافه کردن setLogo به وابستگی‌ها

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // بررسی نوع فایل
      if (!file.type.startsWith('image/')) {
        alert('لطفاً یک فایل تصویر معتبر بارگذاری کنید.')
        return
      }
      // بررسی اندازه فایل
      if (file.size > 5 * 1024 * 1024) {
        // حداکثر 5 مگابایت
        alert('اندازه فایل نباید بیشتر از 5 مگابایت باشد.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result
        setLogo(imageData)
        localStorage.setItem('logo', imageData) // ذخیره تصویر در لوکال استورج
      }
      reader.readAsDataURL(file) // تبدیل تصویر به فرمت Base64
    }
  }

  const handleOutsideClick = (e) => {
    // اگر کاربر روی زمینه کلیک کند، مودال بسته می‌شود
    if (e.target.id === 'modalBackground') {
      setShowProfileSetting(false)
    }
  }

  return (
    <>
      {showProfileSetting && (
        <div
          id="modalBackground"
          className="fixed inset-0 bg-black/50 flex items-start justify-start z-30"
          onClick={handleOutsideClick}
        >
          <div className="absolute right-4 top-4 text-white bg-gray-900 rounded-2xl overflow-hidden space-y-1">
            <div className="flex items-center gap-16 bg-gray-800 p-4">
              <AiOutlineClose
                className="h-6 w-6 cursor-pointer hover:text-secondary/70 hover:transition-all hover:duration-150"
                onClick={() => setShowProfileSetting(false)}
              />
              <h3>پروفایل من</h3>
            </div>

            <div className="flex flex-col items-center p-4 space-y-4">
              {/* نمایش تصویر پروفایل */}
              <label htmlFor="imageUpload" className="cursor-pointer relative">
                {logo ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden group">
                    <Image
                      width={90}
                      height={90}
                      src={logo}
                      alt="Profile"
                      className="w-24 h-24 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <AiOutlinePlus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 rounded-full border-2 border-gray-500">
                    <FaUser className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {/* ورودی برای نام کاربر */}
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="اسم شما"
                className="bg-transparent border border-white/20 p-2 rounded-2xl placeholder-white/40 focus:outline-none w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
