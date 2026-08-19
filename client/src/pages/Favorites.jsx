import React, { useEffect, useState } from 'react'
import CarCard from '../components/CarCard'
import api from '../services/api'

const Favorites = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    useEffect(() => {
        api.get('/favorites').then(response => setCars(response.data.data || [])).catch(requestError => setError(requestError.response?.data?.message || 'Unable to load favorites')).finally(() => setLoading(false))
    }, [])
    return <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <h1 className="text-2xl font-semibold">Favorite Cars</h1>
        {loading && <p className="text-sm text-gray-500 mt-6">Loading favorites...</p>}
        {error && <p className="text-sm text-red-500 mt-6">{error}</p>}
        {!loading && !error && cars.length === 0 && <p className="text-sm text-gray-500 mt-6">You have not saved any cars yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-7">{cars.map(car => <CarCard key={car._id} car={car} />)}</div>
    </div>
}

export default Favorites