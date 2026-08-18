import React, { useMemo, useState } from 'react'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'

const Cars = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...new Set(dummyCarData.map(car => car.category))]

  const filteredCars = useMemo(() => {
    return dummyCarData.filter(car => {
      const matchesSearch = `${car.brand} ${car.model} ${car.category} ${car.location}`
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory = category === 'All' || car.category === category

      return matchesSearch && matchesCategory
    })
  }, [search, category])

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
              className="w-full ml-2 outline-none text-xs text-gray-600"
            />
            <img src={assets.filter_icon} alt="" className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-gray-500">
            Showing {filteredCars.length} Cars
          </p>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-1.5 text-xs outline-none"
          >
            {categories.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredCars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Cars