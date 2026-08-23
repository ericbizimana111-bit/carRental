export const PLATFORM_FEE_RATE = 0.05

export const isRevenueStatus = status => ['confirmed', 'completed'].includes(status)

export const platformShare = amount => Math.round(Number(amount || 0) * PLATFORM_FEE_RATE * 100) / 100

export const ownerShare = amount => Math.round(Number(amount || 0) * (1 - PLATFORM_FEE_RATE) * 100) / 100
