'use client'

import { useRef, useState } from 'react'
import {
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa'

// لیست آهنگ‌ها
const audioTracks = [
  '/audio/Mark Eliyahu - Journey (s l o w e d r e v e r b).mp3',
]

// تابعی برای دریافت نام آهنگ
const getTrackName = (track) => {
  // نام کامل آهنگ را با حذف مسیر و پسوند دریافت می‌کند
  const fullTrackName = track
    .split('/')
    .pop()
    .replace('.mp3', '')
    .replace(/[-_]/g, ' ')

  // تقسیم نام به کلمات
  const words = fullTrackName.split(' ')

  // محدود کردن به حداکثر 10 کلمه
  const limitedTrackName =
    words.length > 10 ? '...' + words.slice(0, 3).join(' ') : fullTrackName

  return limitedTrackName
}

export default function Audio() {
  const audioRef = useRef(null) // مرجع به عنصر audio
  const [isPlaying, setIsPlaying] = useState(false) // وضعیت پخش
  const [volume, setVolume] = useState(0.2) // مقدار صدا
  const [isMuted, setIsMuted] = useState(false) // وضعیت بی‌صدا بودن
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0) // ایندکس آهنگ جاری

  // تابع برای تغییر وضعیت پخش آهنگ
  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause() // توقف پخش
    } else {
      audioRef.current.play().catch((error) => {
        console.error('خطا در پخش صدا:', error) // مدیریت خطا در پخش
      })
    }
    setIsPlaying(!isPlaying) // تغییر وضعیت پخش
  }

  // تابع برای تغییر وضعیت بی‌صدا بودن
  const toggleMute = () => {
    audioRef.current.muted = !isMuted // تغییر وضعیت بی‌صدا
    setIsMuted(!isMuted) // تغییر وضعیت بی‌صدا
  }

  // تابع برای تغییر حجم صدا
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value
    audioRef.current.volume = newVolume // تغییر حجم صدا
    setVolume(newVolume) // به‌روزرسانی وضعیت حجم
  }

  // تابع برای پخش آهنگ بعدی
  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % audioTracks.length // محاسبه ایندکس آهنگ بعدی
    setCurrentTrackIndex(nextIndex) // به‌روزرسانی ایندکس آهنگ جاری
    audioRef.current.src = audioTracks[nextIndex] // تنظیم منبع آهنگ
    if (isPlaying) {
      audioRef.current.play() // پخش آهنگ اگر در حال پخش است
    }
  }

  // تابع برای پخش آهنگ قبلی
  const playPreviousTrack = () => {
    const prevIndex =
      (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length // محاسبه ایندکس آهنگ قبلی
    setCurrentTrackIndex(prevIndex) // به‌روزرسانی ایندکس آهنگ جاری
    audioRef.current.src = audioTracks[prevIndex] // تنظیم منبع آهنگ
    if (isPlaying) {
      audioRef.current.play() // پخش آهنگ اگر در حال پخش است
    }
  }

  return (
    <div className="w-full h-full text-white flex flex-col items-center justify-center z-50">
      <audio ref={audioRef} loop className="hidden">
        <source src={audioTracks[currentTrackIndex]} type="audio/mp3" />
      </audio>

      <div className="flex items-center gap-2">
        {/* دکمه بعدی */}
        <button
          onClick={playNextTrack}
          className="p-2 bg-transparent rounded-full hover:bg-secondary transition-all duration-300 mb-4"
        >
          <FaStepForward className="w-6 h-6" />
        </button>

        {/* دکمه پخش و متوقف */}
        <button
          onClick={toggleAudio}
          className="p-4 bg-primary rounded-full hover:bg-primary/70 transition-all duration-300 mb-4"
        >
          {isPlaying ? (
            <FaPause className="w-6 h-6" />
          ) : (
            <FaPlay className="w-6 h-6" />
          )}
        </button>

        {/* دکمه قبلی */}
        <button
          onClick={playPreviousTrack}
          className="p-2 bg-transparent rounded-full hover:bg-secondary transition-all duration-300 mb-4"
        >
          <FaStepBackward className="w-6 h-6" />
        </button>
      </div>

      {/* نام آهنگ */}
      <div className="text-center mb-4">
        <p className="text-sm font-medium">
          {getTrackName(audioTracks[currentTrackIndex])}
        </p>
        <p className="text-xs text-gray-400">Ambient Music</p>
      </div>

      {/* کنترل صدا */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2 text-gray-400 hover:text-white transition-all duration-300"
        >
          {isMuted ? (
            <FaVolumeMute className="w-5 h-5" />
          ) : (
            <FaVolumeUp className="w-5 h-5" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  )
}
