import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import api from '../services/api'

const Cars = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [cars, setCars] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get('/cars', { params: { search, category, sort } })
        const loadedCars = response.data.data || []
        setCars(loadedCars)
        setCategories(['All', ...new Set(loadedCars.map(car => car.category))])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load cars right now')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(loadCars, 250)
    return () => clearTimeout(timer)
  }, [search, category, sort])

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#f3f7fc] px-6 md:px-16 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Available Cars
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse our selection of premium vehicles available for your next adventure
          </p>

          <div className="mt-5 flex items-center bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm">
            <img src={assets.search_icon} alt="" className="w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search by make, model, or features"
              className="w-full ml-2 outline-none text-sm text-gray-600"
            />
            <img src={assets.filter_icon} alt="" className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading cars...' : `Showing ${cars.length} Cars`}
          </p>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="input-field !w-auto !py-1.5"
          >
            {categories.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-field !w-auto !py-1.5">
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {error && <p className="col-span-full text-center text-sm text-red-500">{error}</p>}
          {!loading && !error && cars.length === 0 && <p className="col-span-full text-center text-sm text-gray-500 py-12">No cars match your search.</p>}
          {cars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Cars