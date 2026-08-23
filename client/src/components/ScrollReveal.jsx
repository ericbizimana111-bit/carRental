import React, { useRef, useEffect, useState } from 'react'

const ScrollReveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(node)
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    const directionStyles = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8',
    }

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${className} ${
                isVisible
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : `opacity-0 ${directionStyles[direction]}`
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}

export default ScrollReveal
