'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { X, Minus, Square, MoreVertical } from 'lucide-react'

interface AdminWindowProps {
  title: string
  children: ReactNode
  onClose: () => void
  onMinimize?: () => void
  className?: string
  style?: React.CSSProperties
}

export default function AdminWindow({
  title,
  children,
  onClose,
  onMinimize,
  className = '',
  style = {}
}: AdminWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [isMinimized, setIsMinimized] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const titleBarRef = useRef<HTMLDivElement>(null)

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('.window-title-bar')) {
      setIsDragging(true)
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
  }

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const rect = windowRef.current?.getBoundingClientRect()
        if (rect) {
          setSize({
            width: Math.max(400, e.clientX - rect.left + 10),
            height: Math.max(300, e.clientY - rect.top + 10)
          })
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    onMinimize?.()
  }

  const windowStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    width: size.width,
    height: isMinimized ? 40 : size.height,
    zIndex: 1000,
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    ...style
  }

  return (
    <div
      ref={windowRef}
      style={windowStyle}
      className={`admin-window ${className}`}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        className="window-title-bar flex items-center justify-between px-4 py-2 bg-gray-100 border-b cursor-move select-none"
        style={{ height: 40 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-gray-700 ml-2">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-200 rounded"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-auto" style={{ height: size.height - 40 }}>
          {children}
        </div>
      )}

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => {
          e.stopPropagation()
          setIsResizing(true)
        }}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400"></div>
      </div>
    </div>
  )
}
