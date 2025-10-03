'use client'

import { useState, useCallback } from 'react'
import AdminWindow from './AdminWindow'
import dynamic from 'next/dynamic'

// Dynamic imports for admin pages
const AdminDashboard = dynamic(() => import('@/app/admin/page'), { ssr: false })
const AdminSettings = dynamic(() => import('@/app/admin/settings/page'), { ssr: false })

interface WindowState {
  id: string
  title: string
  component: string
  isOpen: boolean
  isMinimized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface AdminWindowManagerProps {
  children: React.ReactNode
}

export default function AdminWindowManager({ children }: AdminWindowManagerProps) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [nextWindowId, setNextWindowId] = useState(1)

  const openWindow = useCallback((component: string, title: string) => {
    const windowId = `window-${nextWindowId}`

    // Calculate position for new window (cascade effect)
    const baseX = 100 + (windows.length * 30)
    const baseY = 100 + (windows.length * 30)

    const newWindow: WindowState = {
      id: windowId,
      title,
      component,
      isOpen: true,
      isMinimized: false,
      position: { x: baseX, y: baseY },
      size: { width: 900, height: 700 }
    }

    setWindows(prev => [...prev, newWindow])
    setNextWindowId(prev => prev + 1)
  }, [nextWindowId, windows.length])

  const closeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId))
  }, [])

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ))
  }, [])

  const renderWindowContent = (component: string) => {
    switch (component) {
      case 'dashboard':
        return <AdminDashboard />
      case 'settings':
        return <AdminSettings />
      default:
        return <div className="p-4">محتوى غير متاح</div>
    }
  }

  return (
    <>
      {children}

      {/* Render Admin Windows */}
      {windows.map((window) => (
        <AdminWindow
          key={window.id}
          title={window.title}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height
          }}
        >
          {renderWindowContent(window.component)}
        </AdminWindow>
      ))}

      {/* Hidden component to expose openWindow function globally */}
      <WindowOpener openWindow={openWindow} />
    </>
  )
}

// Helper component to expose openWindow function
function WindowOpener({ openWindow }: { openWindow: (component: string, title: string) => void }) {
  // Expose function globally for use in other components
  useState(() => {
    ;(window as any).openAdminWindow = openWindow
  })

  return null
}
