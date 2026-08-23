import React from 'react'

const StarIcon = ({ fill = 'full' }) => {
    const id = `star-grad-${Math.random().toString(36).slice(2, 9)}`

    if (fill === 'full') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
                <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill="#f59e0b"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    if (fill === 'half') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
                <defs>
                    <linearGradient id={id}>
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={`url(#${id})`}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
            <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const StarRating = ({ rating = 0, count, size = 'sm', showValue = true, className = '' }) => {
    const stars = []
    const numericRating = Number(rating) || 0

    for (let i = 1; i <= 5; i++) {
        if (numericRating >= i) {
            stars.push(<StarIcon key={i} fill="full" />)
        } else if (numericRating >= i - 0.5) {
            stars.push(<StarIcon key={i} fill="half" />)
        } else {
            stars.push(<StarIcon key={i} fill="empty" />)
        }
    }

    return (
        <span className={`inline-flex items-center gap-1 ${className}`}>
            <span className="inline-flex items-center gap-0.5">
                {stars}
            </span>
            {showValue && (
                <span className="ml-0.5 text-sm font-medium text-amber-600">
                    {numericRating ? numericRating.toFixed(1) : 'New'}
                </span>
            )}
            {count !== undefined && (
                <span className="text-xs text-slate-400">({count})</span>
            )}
        </span>
    )
}

export default StarRating
