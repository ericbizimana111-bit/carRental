import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import api from '../services/api'
import { useAuth } from '../context/useAuth'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [favorite, setFavorite] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewMessage, setReviewMessage] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const loadCar = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get(`/cars/${id}`)
        setCar(response.data.data)
        const reviewResponse = await api.get(`/reviews/${id}`)
        setReviews(reviewResponse.data.data || [])
        setRating(reviewResponse.data.rating || 0)
        if (user) setFavorite((await api.get(`/favorites/${id}/status`)).data.favorite)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this car')
      } finally {
        setLoading(false)
      }
    }

    loadCar()
  }, [id, user])

  if (loading) return <p className="mt-20 text-center text-slate-500">Loading car details...</p>
  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>
  if (!car) return <p className="mt-20 text-center text-slate-500">Car not found</p>

  const rentalDays = pickupDate && returnDate
    ? Math.max(Math.ceil((new Date(`${returnDate}T00:00:00`) - new Date(`${pickupDate}T00:00:00`)) / 86400000), 0)
    : 0
  const estimatedTotal = rentalDays * car.pricePerDay
  const dateError = !pickupDate || !returnDate
    ? 'Select both pickup and return dates'
    : rentalDays < 1
      ? 'Return date must be on or after pickup date'
      : ''
  const today = new Date().toISOString().slice(0, 10)

  const submitBooking = async event => {
    event.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: `/car-details/${car._id}` } })
      return
    }
    if (dateError || !pickupLocation.trim()) {
      setBookingError(dateError || 'Enter a pickup location')
      return
    }
    setBookingLoading(true)
    setBookingMessage('')
    setBookingError('')
    try {
      await api.post('/bookings', { carId: car._id, pickupLocation, pickupDate, returnDate })
      setBookingMessage('Booking request created successfully')
      setTimeout(() => navigate('/my-bookings'), 800)
    } catch (requestError) {
      setBookingError(requestError.response?.data?.message || 'Unable to create booking')
    } finally {
      setBookingLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) return navigate('/login')
    try { setFavorite((await api.post(`/favorites/${car._id}/toggle`)).data.favorite) } catch (requestError) { setReviewMessage(requestError.response?.data?.message || 'Unable to update favorite') }
  }

  const submitReview = async event => {
    event.preventDefault()
    try {
      const response = await api.post(`/reviews/${car._id}`, reviewForm)
      setReviews([response.data.data, ...reviews])
      setReviewMessage('Review submitted successfully')
      setReviewForm({ rating: 5, comment: '' })
    } catch (requestError) { setReviewMessage(requestError.response?.data?.message || 'Unable to submit review') }
  }

  return (
    <div className="page-container">
      <button
        onClick={() => navigate('/cars')}
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-primary"
      >
        <img src={assets.arrow_icon} className="h-4 w-4 rotate-180" alt="" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="overflow-hidden rounded-xl">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="h-[320px] w-full object-cover md:h-[420px]"
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-slate-900 md:text-3xl">
            {car.brand} {car.model}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
              <img src={assets.star_icon} alt="" className="h-4 w-4" />
              {rating ? `${rating}/5` : 'No ratings yet'}
            </span>
            <span className="text-sm text-slate-500">Listed by {car.owner?.name || 'Car owner'}</span>
            <button onClick={toggleFavorite} className="text-sm font-medium text-primary hover:underline">
              {favorite ? 'Remove favorite' : 'Save favorite'}
            </button>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {car.year} · {car.category}
          </p>

          <div className="mt-6 border-b border-slate-200" />

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              [assets.users_icon, `${car.seating_capacity} Seats`],
              [assets.fuel_icon, car.fuel_type],
              [assets.car_icon, car.transmission],
              [assets.location_icon, car.location],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4 text-center">
                <img src={icon} className="mx-auto mb-2 h-5 w-5 opacity-70" alt="" />
                <p className="text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-lg font-semibold">Description</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {car.description}
          </p>

          <h2 className="mt-8 text-lg font-semibold">Features</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
            {['Leather Seats', 'Panoramic Sunroof', 'Wireless Charging', '360 Camera'].map(feature => (
              <p key={feature} className="flex items-center gap-2">
                <img src={assets.check_icon} className="h-4 w-4" alt="" />
                {feature}
              </p>
            ))}
          </div>

          <h2 className="mt-8 text-lg font-semibold">Reviews ({reviews.length})</h2>
          <div className="mt-4 space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border-b border-slate-100 pb-4">
                <p className="text-sm font-medium text-slate-800">
                  {review.user?.name || 'Customer'}
                  <span className="ml-2 text-amber-600">{review.rating}/5</span>
                </p>
                <p className="mt-1 text-sm text-slate-500">{review.comment}</p>
              </div>
            ))}
          </div>

          {user && (
            <form onSubmit={submitReview} className="mt-6 space-y-3">
              <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: e.target.value })} className="input-field">
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
              <textarea required value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience with this vehicle" className="input-field min-h-[80px]" />
              <button className="btn-primary !rounded-lg">Submit review</button>
            </form>
          )}
          {reviewMessage && <p className="mt-3 text-sm text-slate-500">{reviewMessage}</p>}
        </div>

        <form onSubmit={submitBooking} className="card sticky top-24 p-6 shadow-md lg:self-start">
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              {import.meta.env.VITE_CURRENCY}{car.pricePerDay}
            </h2>
            <span className="text-sm text-slate-500">per day</span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Pickup Location</label>
              <input
                aria-label="Pickup location"
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value)}
                required
                placeholder="Enter pickup location"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Pickup Date</label>
              <input
                type="date"
                aria-label="Pickup date"
                min={today}
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Return Date</label>
              <input
                type="date"
                aria-label="Return date"
                min={pickupDate || today}
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <div className="flex justify-between"><span>Rental days</span><span className="font-medium">{rentalDays || '—'}</span></div>
            <div className="flex justify-between"><span>Price per day</span><span className="font-medium">{import.meta.env.VITE_CURRENCY}{car.pricePerDay}</span></div>
            <div className="flex justify-between text-base font-semibold text-slate-900">
              <span>Estimated total</span>
              <span>{rentalDays ? `${import.meta.env.VITE_CURRENCY}${estimatedTotal}` : '—'}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!user || !car.isAvailable || bookingLoading || Boolean(dateError) || !pickupLocation.trim()}
            className="btn-primary mt-5 w-full !rounded-lg"
          >
            {bookingLoading ? 'Booking...' : 'Book Now'}
          </button>

          {!user && (
            <button
              type="button"
              onClick={() => navigate('/login', { state: { from: `/car-details/${car._id}` } })}
              className="btn-secondary mt-3 w-full !rounded-lg"
            >
              Log in to book
            </button>
          )}

          {bookingMessage && <p role="status" className="mt-3 text-center text-sm text-green-600">{bookingMessage}</p>}
          {bookingError && <p role="alert" className="mt-3 text-center text-sm text-red-500">{bookingError}</p>}
          {dateError && pickupDate && returnDate && <p className="mt-2 text-sm text-red-500">{dateError}</p>}

          <p className="mt-4 text-center text-xs text-slate-400">
            No credit card required to reserve
          </p>
        </form>
      </div>
    </div>
  )
}

export default CarDetails
