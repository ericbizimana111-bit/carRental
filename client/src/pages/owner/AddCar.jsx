import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import api from '../../services/api'
import { compressImage } from '../../utils/imageUpload'

const AddCar = () => {
    const [image, setImage] = useState(null)
    const [form, setForm] = useState({ brand: '', model: '', year: '', pricePerDay: '', category: 'Sedan', transmission: 'Automatic', fuel_type: 'Gasoline', seating_capacity: '', location: '', description: '' })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    const updateField = event => setForm({ ...form, [event.target.name]: event.target.value })
    const handleSubmit = async event => {
        event.preventDefault()
        setSubmitting(true)
        setMessage('')
        try {
            let imageUrl = ''
            if (image) {
                imageUrl = await new Promise(resolve => {
                    compressImage(image).then(resolve).catch(() => resolve(''))
                })
            }
            await api.post('/cars', { ...form, image: imageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80' })
            setMessage('Car listed successfully')
            setForm({ brand: '', model: '', year: '', pricePerDay: '', category: 'Sedan', transmission: 'Automatic', fuel_type: 'Gasoline', seating_capacity: '', location: '', description: '' })
            setImage(null)
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to list car')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl">
            <h1 className="text-2xl font-semibold">Add New Car</h1>
            <p className="text-xs text-gray-500 mt-1">
                Fill in details to list a new car for booking, including pricing, availability, and car specifications.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 max-w-3xl space-y-5">
                <label className="border border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={e => setImage(e.target.files[0])}
                    />

                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            className="h-28 w-full object-contain"
                            alt=""
                        />
                    ) : (
                        <>
                            <img src={assets.upload_icon} className="w-7" alt="" />
                            <span className="text-[10px] text-gray-500 mt-2">
                                Upload a picture of your car
                            </span>
                        </>
                    )}
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs">Brand</label>
                        <input name="brand" value={form.brand} onChange={updateField} required className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="e.g. BMW, Mercedes, Audi..." />
                    </div>

                    <div>
                        <label className="text-xs">Model</label>
                        <input name="model" value={form.model} onChange={updateField} required className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="e.g. X5, E-Class..." />
                    </div>

                    <div>
                        <label className="text-xs">Year</label>
                        <input name="year" value={form.year} onChange={updateField} required type="number" className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="2025" />
                    </div>

                    <div>
                        <label className="text-xs">Daily Price ($)</label>
                        <input name="pricePerDay" value={form.pricePerDay} onChange={updateField} required min="0" type="number" className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="100" />
                    </div>

                    <div>
                        <label className="text-xs">Category</label>
                        <select name="category" value={form.category} onChange={updateField} className="w-full border rounded-md p-2 mt-1 text-xs outline-none">
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Luxury</option>
                            <option>Sports</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs">Transmission</label>
                        <select name="transmission" value={form.transmission} onChange={updateField} className="w-full border rounded-md p-2 mt-1 text-xs outline-none">
                            <option>Automatic</option>
                            <option>Manual</option>
                            <option>Semi-Automatic</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs">Fuel Type</label>
                        <select name="fuel_type" value={form.fuel_type} onChange={updateField} className="w-full border rounded-md p-2 mt-1 text-xs outline-none">
                            <option>Gasoline</option>
                            <option>Diesel</option>
                            <option>Hybrid</option>
                            <option>Electric</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs">Seating Capacity</label>
                        <input name="seating_capacity" value={form.seating_capacity} onChange={updateField} required min="1" type="number" className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="5" />
                    </div>
                </div>

                <div>
                    <label className="text-xs">Location</label>
                    <input name="location" value={form.location} onChange={updateField} required className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="e.g. San Francisco, CA" />
                </div>

                <div>
                    <label className="text-xs">Description</label>
                    <textarea name="description" value={form.description} onChange={updateField} required rows="4" className="w-full border rounded-md p-2 mt-1 text-xs outline-none resize-none" placeholder="Describe your car, its condition, and any notable details..." />
                </div>

                {message && <p className="text-xs text-gray-600">{message}</p>}
                <button disabled={submitting} className="bg-primary disabled:bg-gray-300 text-white px-5 py-2 rounded-md text-xs hover:bg-primary-dull transition">
                    {submitting ? 'Listing...' : 'List Your Car'}
                </button>
            </form>
        </div>
    )
}

export default AddCar