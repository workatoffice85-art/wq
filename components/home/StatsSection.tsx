'use client'

import { useEffect, useState, useRef } from 'react'
import { TrendingUp, Users, Award, Briefcase } from 'lucide-react'

export default function StatsSection() {
  const [statsData, setStatsData] = useState({
    experience: '15',
    projects: '5000',
    clients: '3500',
    employees: '45',
  })
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('page_home')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.sections?.stats) {
          setStatsData({
            experience: data.sections.stats.experience || statsData.experience,
            projects: data.sections.stats.projects || statsData.projects,
            clients: data.sections.stats.clients || statsData.clients,
            employees: data.sections.stats.employees || statsData.employees,
          })
        }
      } catch (e) {
        console.error('Error loading stats content:', e)
      }
    }
  }, [])

  const stats = [
    { icon: TrendingUp, label: 'سنوات الخبرة', value: parseInt(statsData.experience), suffix: '+' },
    { icon: Briefcase, label: 'مشروع مكتمل', value: parseInt(statsData.projects), suffix: '+' },
    { icon: Users, label: 'عميل راضٍ', value: parseInt(statsData.clients), suffix: '+' },
    { icon: Award, label: 'موظف محترف', value: parseInt(statsData.employees), suffix: '+' },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-primary-500 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="h-12 w-12" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {isVisible ? (
                  <CountUp end={stat.value} suffix={stat.suffix} />
                ) : (
                  '0'
                )}
              </div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [end])

  return <>{count}{suffix}</>
}
