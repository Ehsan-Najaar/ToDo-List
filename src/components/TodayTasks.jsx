'use client'
import jalaali from 'jalaali-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AiOutlineArrowUp,
  AiOutlineClose,
  AiOutlineFileText,
  AiOutlinePushpin,
} from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa' // آیکون‌های جدید
import { Container, Draggable } from 'react-smooth-dnd'

export default function TodayTasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showInput, setShowInput] = useState(false)
  const [completionFilter, setCompletionFilter] = useState('all')
  const [task, setTask] = useState('')
  const [category, setCategory] = useState('personal')
  const [tasks, setTasks] = useState([])
  const [ShowCompletedTasks, setShowCompletedTasks] = useState(false)
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false)
  const categoryRef = useRef(null)
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [shouldRerender, setShouldRerender] = useState(false)

  useEffect(() => {
    // اطمینان از اینکه کد فقط در کلاینت اجرا می‌شود
    if (typeof window !== 'undefined') {
      const tasksLS = JSON.parse(localStorage.getItem('today')) || []
      setTasks(tasksLS)
      setLoading(false)
      // یک بار کامپوننت خودش را ریرندر کند
      setShouldRerender(true)
    }
  }, [])

  useEffect(() => {
    if (shouldRerender) {
      console.log('کامپوننت رندر شد')
    }
  }, [shouldRerender])

  const handleAddTask = useCallback(() => {
    if (task) {
      const newTask = {
        task,
        category,
        date: new Date(),
        isCompleted: false,
        isPinned: false,
      }

      const completedTasks = tasks.filter((t) => t.isCompleted)
      const pinnedTasks = tasks.filter((t) => t.isPinned)
      const unpinnedTasks = tasks.filter((t) => !t.isPinned && !t.isCompleted)

      let updatedTasks

      if (pinnedTasks.length > 0) {
        // اگر تسک‌های پین شده وجود داشته باشند، تسک جدید به پایین آن‌ها اضافه می‌شود
        updatedTasks = [
          ...pinnedTasks,
          newTask,
          ...unpinnedTasks,
          ...completedTasks,
        ]
      } else {
        // اگر تسک پین شده‌ای وجود نداشته باشد، تسک جدید به صدر لیست اضافه می‌شود
        updatedTasks = [newTask, ...unpinnedTasks, ...completedTasks]
      }

      setTasks(updatedTasks)
      localStorage.setItem('today', JSON.stringify(updatedTasks))
      setTask('') // Reset the input field
    }
  }, [task, category, tasks])

  const handleDragEnd = (dropped) => {
    if (dropped.removedIndex === null && dropped.addedIndex === null) return

    const updatedTasks = [...tasks]

    // بررسی وجود draggedTask
    if (
      dropped.removedIndex >= 0 &&
      dropped.removedIndex < updatedTasks.length
    ) {
      const draggedTask = updatedTasks[dropped.removedIndex]

      if (draggedTask.isCompleted || draggedTask.isPinned) {
        return
      }

      if (
        dropped.addedIndex < updatedTasks.length &&
        updatedTasks[dropped.addedIndex].isCompleted
      ) {
        return
      }

      const hasPinnedBefore =
        dropped.addedIndex > 0 && updatedTasks[dropped.addedIndex - 1].isPinned
      const hasPinnedAfter =
        dropped.addedIndex < updatedTasks.length &&
        updatedTasks[dropped.addedIndex].isPinned

      if (!draggedTask.isPinned && hasPinnedBefore && hasPinnedAfter) {
        return
      }

      const hasPinnedTasks = updatedTasks.some((task) => task.isPinned)
      if (!hasPinnedTasks && dropped.addedIndex === 0) {
        updatedTasks.splice(dropped.removedIndex, 1)
        updatedTasks.splice(0, 0, draggedTask)
      } else if (dropped.addedIndex > 0) {
        updatedTasks.splice(dropped.removedIndex, 1)
        updatedTasks.splice(dropped.addedIndex, 0, draggedTask)
      }

      setTasks(updatedTasks)
      localStorage.setItem('today', JSON.stringify(updatedTasks))
    } else {
      console.error('Invalid removedIndex:', dropped.removedIndex)
    }
  }

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks]
    const taskToUpdate = updatedTasks[index]
    taskToUpdate.isCompleted = !taskToUpdate.isCompleted

    if (taskToUpdate.isCompleted) {
      const [completedTask] = updatedTasks.splice(index, 1)
      updatedTasks.push(completedTask)
    } else {
      updatedTasks.splice(index, 1)
      const insertIndex = updatedTasks.findIndex((t) => t.isCompleted)
      if (insertIndex === -1) {
        updatedTasks.push(taskToUpdate)
      } else {
        updatedTasks.splice(insertIndex, 0, taskToUpdate)
      }
    }

    setTasks(updatedTasks)
    localStorage.setItem('today', JSON.stringify(updatedTasks))
  }

  const toggleTaskPin = (index) => {
    const updatedTasks = [...tasks]
    const taskToUpdate = updatedTasks[index]
    taskToUpdate.isPinned = !taskToUpdate.isPinned

    if (taskToUpdate.isPinned) {
      // اگر تسک پین شده است، آن را به صدر لیست اضافه کنید
      const [pinnedTask] = updatedTasks.splice(index, 1)
      updatedTasks.unshift(pinnedTask)
    } else {
      // اگر تسک از حالت پین خارج شود، آن را به پایین تسک‌های پین شده اضافه کنید
      const pinnedTasks = updatedTasks.filter((t) => t.isPinned)
      const unpinnedTask = updatedTasks.splice(index, 1)[0]

      // اضافه کردن تسک به پایین پین شده‌ها
      updatedTasks.splice(pinnedTasks.length, 0, unpinnedTask)
    }

    setTasks(updatedTasks)
    localStorage.setItem('today', JSON.stringify(updatedTasks))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks]
    updatedTasks.splice(index, 1)

    setTasks(updatedTasks)
    localStorage.setItem('today', JSON.stringify(updatedTasks))
  }

  const getCurrentJalaliDate = () => {
    const today = new Date()
    const jalaliDate = jalaali.toJalaali(today)
    const { jd } = jalaliDate
    const weekday = today.toLocaleDateString('fa-IR', { weekday: 'long' })
    const monthName = today.toLocaleDateString('fa-IR', { month: 'long' })

    return { day: jd, month: monthName, weekday }
  }
  const jalaliDate = getCurrentJalaliDate()

  const handleSearchClick = () => {
    setShowInput(!showInput) // فرض بر این که `showInput` مدیریت شده است
    if (!showInput && inputRef.current) {
      inputRef.current.focus() // فوکوس به اینپوت
    }
  }

  const handleCompletionFilterChange = (filter) => {
    setCompletionFilter(filter)
    // اگر روی تیک یا علامت هش کلیک کردید، همه‌ی تسک‌ها را نمایش دهید
    if (filter === 'completed' || filter === 'incomplete') {
      setShowCompletedTasks(true) // نمایش تسک‌های تکمیل شده
    }
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (activeTab === 'all') return true
      if (activeTab === 'work') return task.category === 'work'
      if (activeTab === 'personal') return task.category === 'personal'
      return false
    })
    .filter((task) => {
      if (completionFilter === 'completed') return task.isCompleted
      if (completionFilter === 'incomplete') return !task.isCompleted
      return true
    })
    .filter((task) =>
      task.task.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="h-screen max-w-[98%] lg:max-w-[87%] lg:mx-auto flex flex-col overflow-hidden p-2 lg:p-[22px] text-white text-md ">
      <header className="flex flex-col gap-2 items-end lg:flex-row lg:items-center lg:justify-between px-4">
        {/* searchBox mobile sieze */}
        <div className="w-full flex lg:hidden backdrop rounded-full items-center gap-2 p-3 cursor-pointer">
          <BiSearch className="w-6 h-6 group" onClick={handleSearchClick} />
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="جستجوی فعالیت..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`rounded-full bg-transparent transition-all duration-500 ease-in-out 
                  border border-transparent focus:outline-none pr-3
                  `}
              style={{
                outline: 'none',
              }}
            />
          </div>
        </div>
        <div className="w-full lg:w-max flex lg:flex-row items-center backdrop lg:mx-0 gap-2 rounded-full overflow-hidden">
          <div className="w-full lg:w-max text-center rounded-full overflow-hidden">
            <button
              className={`w-1/3 lg:w-24 p-2 ${
                activeTab === 'all' ? 'bg-secondary' : ''
              }`}
              onClick={() => setActiveTab('all')}
            >
              همه
            </button>
            <button
              className={`w-1/3 lg:w-24 p-2 border-l border-r border-secondary ${
                activeTab === 'personal' ? 'bg-secondary' : ''
              }`}
              onClick={() => setActiveTab('personal')}
            >
              شخصی
            </button>
            <button
              className={`w-1/3 lg:w-24 p-2 ${
                activeTab === 'work' ? 'bg-secondary' : ''
              }`}
              onClick={() => setActiveTab('work')}
            >
              کاری
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2 p-2 cursor-pointer">
            <BiSearch className="w-6 h-6 group" onClick={handleSearchClick} />
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="جستجوی فعالیت..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`rounded-full bg-transparent transition-all duration-500 ease-in-out 
                  ${showInput ? 'max-w-[200px] px-3' : 'max-w-0 px-0 py-0'} 
                  border border-transparent focus:outline-none
                  `}
                style={{
                  maxWidth: showInput ? '200px' : '0', // تنظیم max-width برای باز و بسته شدن
                  transition:
                    'max-width 0.5s ease-in-out, padding 0.5s ease-in-out', // اضافه کردن transition به max-width و padding
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-max text-sm lg:text-md flex items-center gap-2">
          <div className="hidden w-max lg:flex items-center backdrop rounded-full gap-2 px-4 py-3">
            <h3>{jalaliDate.weekday}</h3>
            <h1>{jalaliDate.day}</h1>
            <h3>{jalaliDate.month}</h3>
          </div>
          {/* Custom Icons for Completion Filter */}
          <div className="relative lg:w-max flex items-center justify-around mx-auto gap-1 backdrop rounded-full px-2 py-1">
            <div
              className={` flex items-center justify-center lg:w-10 lg:h-10 cursor-pointer p-2 rounded-full ${
                completionFilter === 'completed' ? 'bg-white/50' : ''
              }`}
              onClick={() => {
                const newFilter =
                  completionFilter === 'completed' ? 'all' : 'completed'
                handleCompletionFilterChange(newFilter)
              }}
              title="نمایش فعالیت های تکمیل‌شده"
            >
              <FaCheckCircle className="hidden lg:block" />
              <p className="lg:hidden">فعالیت های تکمیل‌شده</p>
            </div>
            <div
              className={`flex items-center justify-center lg:w-10 lg:h-10 cursor-pointer p-2 rounded-full ${
                completionFilter === 'incomplete' ? 'bg-white/50' : ''
              }`}
              onClick={() => {
                const newFilter =
                  completionFilter === 'incomplete' ? 'all' : 'incomplete'
                handleCompletionFilterChange(newFilter)
              }}
              title="نمایش فعالیت های نیمه‌کاره"
            >
              <FaExclamationTriangle className="hidden lg:block" />
              <p className="lg:hidden">فعالیت های تکمیل نشده</p>
            </div>
          </div>
        </div>
      </header>

      <div className="h-full flex flex-col gap-4 justify-between">
        <div className="max-h-[400px] lg:max-h-[550px] overflow-auto p-4">
          <Container onDrop={handleDragEnd}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t, index) => (
                <Draggable key={index}>
                  <div className="flex flex-col backdrop text-lg rounded-lg my-2 p-2 cursor-pointer hover:bg-black/70 transition-all duration-300">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.isCompleted}
                          onChange={() => toggleTaskCompletion(index)}
                          className="h-5 w-5 rounded-full accent-secondary transition-all duration-200 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <small className="text-secondary">
                            {t.category === 'personal' ? 'شخصی' : 'کاری'}
                          </small>
                          <span
                            className={`${
                              t.isCompleted ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {t.task}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        {!t.isCompleted && (
                          <AiOutlinePushpin
                            className={`h-6 w-6 cursor-pointer ${
                              t.isPinned ? 'text-primary' : 'text-secondary'
                            }`}
                            onClick={() => toggleTaskPin(index)}
                          />
                        )}
                        <AiOutlineClose
                          className="h-6 w-6 cursor-pointer"
                          onClick={() => handleDeleteTask(index)}
                        />
                      </div>
                    </div>
                  </div>
                </Draggable>
              ))
            ) : (
              <div className="text-xl text-center text-white p-2 backdrop rounded-full">
                {loading ? 'درحال بارگزاری ...' : 'هیچ فعالیتی وجود ندارد'}
              </div>
            )}
          </Container>
        </div>

        {/* فرم اضافه کردن کار */}
        <div className="w-full backdrop flex items-center justify-between border-2 border-secondary rounded-full p-4">
          <div className="w-full flex items-center gap-2">
            <AiOutlineFileText
              className="w-7 h-7 text-secondary cursor-pointer"
              onClick={() => setIsCategoryModalVisible(!isCategoryModalVisible)}
            />
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="فعالیت خود را اضافه کنید"
              maxLength={100}
              className="w-full bg-transparent focus:outline-none focus:border-none"
            />
          </div>
          <AiOutlineArrowUp
            className={`w-7 h-7 cursor-pointer ${
              task ? 'text-primary' : 'text-secondary'
            }`}
            onClick={handleAddTask}
          />
        </div>

        {/* دیالوگ انتخاب دسته بندی */}
        {isCategoryModalVisible && (
          <div
            ref={categoryRef}
            className="absolute bottom-20 right-5 lg:bottom-24 lg:right-[106px] mx-auto w-[200px] p-4 backdrop text-white rounded-lg shadow-lg"
          >
            <h3 className="font-bold mb-4 border-b-2 pb-2 text-center">
              انتخاب لیست
            </h3>
            <div className="flex flex-col gap-2">
              <button
                className={`rounded-lg py-2 text-center transition-all duration-150
              ${category === 'personal' ? 'bg-primary' : ''}
              `}
                onClick={() => {
                  setCategory('personal')
                  setIsCategoryModalVisible(false)
                }}
              >
                شخصی
              </button>
              <button
                className={`rounded-lg py-2 text-center transition-all duration-150
              ${category === 'work' ? 'bg-primary' : ''}
              `}
                onClick={() => {
                  setCategory('work')
                  setIsCategoryModalVisible(false)
                }}
              >
                کاری
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
