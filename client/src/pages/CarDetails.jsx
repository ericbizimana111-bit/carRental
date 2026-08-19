import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

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

  if (loading) return <p className="mt-20 text-center text-gray-500">Loading car details...</p>
  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>
  if (!car) {
    return <p className="mt-20 text-center text-gray-500">Car not found</p>
  }

  const submitBooking = async event => {
    event.preventDefault()
    setBookingLoading(true)
    setBookingMessage('')
    try {
      await api.post('/bookings', { carId: car._id, pickupLocation, pickupDate, returnDate })
      setBookingMessage('Booking request created successfully')
    } catch (requestError) {
      setBookingMessage(requestError.response?.data?.message || 'Unable to create booking')
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
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
      <button
        onClick={() => navigate('/cars')}
        className="flex items-center gap-2 text-xs text-gray-500 mb-5"
      >
        <img src={assets.arrow_icon} className="w-3 rotate-180" alt="" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_190px] gap-6">
        <div>
          <div className="rounded-lg overflow-hidden">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-[350px] md:h-[430px] object-cover"
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mt-4">
            {car.brand} {car.model}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-amber-600">{rating ? `${rating}/5` : 'No ratings yet'}</span>
            <button onClick={toggleFavorite} className="text-xs text-primary">{favorite ? 'Remove favorite' : 'Save favorite'}</button>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {car.year} · {car.category}
          </p>

          <div className="border-b border-gray-200 mt-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.users_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.seating_capacity} Seats</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.fuel_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.fuel_type}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.car_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.transmission}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <img src={assets.location_icon} className="w-4 h-4 mx-auto mb-2" alt="" />
              <p className="text-xs">{car.location}</p>
            </div>
          </div>

          <h2 className="font-medium text-sm mt-5">Description</h2>
          <p className="text-xs text-gray-500 leading-5 mt-2">
            {car.description}
          </p>

          <h2 className="font-medium text-sm mt-5">Features</h2>

          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              Leather Seats
            </p>
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              Panoramic Sunroof
            </p>
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              Wireless Charging
            </p>
            <p className="flex items-center gap-2">
              <img src={assets.check_icon} className="w-3" alt="" />
              360 Camera
            </p>
          </div>
          <h2 className="font-medium text-sm mt-7">Reviews ({reviews.length})</h2>
          <div className="mt-3 space-y-3">{reviews.map(review => <div key={review._id} className="border-b pb-3"><p className="text-xs font-medium">{review.user?.name || 'Customer'} <span className="text-amber-600 ml-2">{review.rating}/5</span></p><p className="text-xs text-gray-500 mt-1">{review.comment}</p></div>)}</div>
          {user && <form onSubmit={submitReview} className="mt-4 space-y-2"><select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: e.target.value })} className="border rounded p-2 text-xs"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><textarea required value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience" className="w-full border rounded p-2 text-xs" /><button className="bg-primary text-white rounded px-3 py-2 text-xs">Submit review</button></form>}
          {reviewMessage && <p className="text-xs text-gray-500 mt-2">{reviewMessage}</p>}
        </div>

        <form onSubmit={submitBooking} className="border border-gray-100 shadow-lg rounded-lg p-4 h-fit">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-xl font-semibold">
              {import.meta.env.VITE_CURRENCY}{car.pricePerDay}
            </h2>
            <span className="text-[10px] text-gray-500">per day</span>
          </div>

          <div className="mt-5">
            <label className="text-[10px]">Pickup Location</label>
            <input value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} required placeholder="Enter pickup location" className="w-full border border-gray-200 rounded-md px-2 py-2 mt-1 text-xs outline-none" />
          </div>

          <div className="mt-3">
            <label className="text-[10px]">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={e => setPickupDate(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-2 py-2 mt-1 text-xs outline-none"
            />
          </div>

          <div className="mt-3">
            <label className="text-[10px]">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-2 py-2 mt-1 text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!car.isAvailable || bookingLoading}
            className="w-full bg-primary disabled:bg-gray-300 text-white rounded-md py-2 mt-5 text-xs"
          >
            {bookingLoading ? 'Booking...' : 'Book Now'}
          </button>

          {bookingMessage && <p className="text-[10px] text-center text-gray-500 mt-3">{bookingMessage}</p>}

          <p className="text-[9px] text-gray-400 text-center mt-3">
            No credit card required to reserve
          </p>
        </form>
      </div>
    </div>
  )
}

export default CarDetails