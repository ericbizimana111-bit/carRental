import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import api from '../../services/api'
import { compressImage } from '../../utils/imageUpload'

const AddCar = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const [currentImage, setCurrentImage] = useState('')
    const [form, setForm] = useState({ brand: '', model: '', year: '', pricePerDay: '', category: 'Sedan', transmission: 'Automatic', fuel_type: 'Gasoline', seating_capacity: '', location: '', description: '' })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!id) return
        api.get(`/cars/${id}`).then(response => {
            const car = response.data.data
            setCurrentImage(car.image)
            setForm({ brand: car.brand, model: car.model, year: car.year, pricePerDay: car.pricePerDay, category: car.category, transmission: car.transmission, fuel_type: car.fuel_type, seating_capacity: car.seating_capacity, location: car.location, description: car.description })
        }).catch(error => setMessage(error.response?.data?.message || 'Unable to load car'))
    }, [id])

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
            const payload = { ...form, image: imageUrl || currentImage || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80' }
            await (id ? api.put(`/cars/${id}`, payload) : api.post('/cars', payload))
            setMessage(id ? 'Car updated successfully' : 'Car listed successfully')
            if (id) setTimeout(() => navigate('/owner/manage-cars'), 500)
            setForm({ brand: '', model: '', year: '', pricePerDay: '', category: 'Sedan', transmission: 'Automatic', fuel_type: 'Gasoline', seating_capacity: '', location: '', description: '' })
            setImage(null)
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to list car')
        } finally {
            setSubmitting(false)
        }
    }

    const inputClass = "w-full rounded-lg border border-slate-200 bg-white p-2.5 mt-1.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
    const labelClass = "text-xs font-medium text-slate-600"

    return (
        <div className="p-6 md:p-8 max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Car' : 'Add New Car'}</h1>
            <p className="text-sm text-slate-500 mt-1.5">
                Fill in details to list a new car for booking, including pricing, availability, and car specifications.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-8">

                {/* Photo upload */}
                <div>
                    <label className={labelClass}>Car Photo</label>
                    <label className="mt-1.5 flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-primary/40 hover:bg-slate-50/80">
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={e => setImage(e.target.files[0])}
                        />

                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                className="h-32 w-full object-contain p-2"
                                alt=""
                            />
                        ) : currentImage ? <img src={currentImage} className="h-32 w-full object-contain p-2" alt="Current car" /> : (
                            <>
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
                                    <img src={assets.upload_icon} className="w-4" alt="" />
                                </div>
                                <span className="text-xs text-slate-500 mt-3">
                                    Upload a picture of your car
                                </span>
                                <span className="text-[11px] text-slate-400 mt-0.5">
                                    PNG or JPG, up to 5MB
                                </span>
                            </>
                        )}
                    </label>
                </div>

                {/* Vehicle details */}
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2.5">
                        Vehicle Details
                    </h2>
                    <div className="grid md:grid-cols-2 gap-x-4 gap-y-5 mt-5">
                        <div>
                            <label className={labelClass}>Brand</label>
                            <input name="brand" value={form.brand} onChange={updateField} required className={inputClass} placeholder="e.g. BMW, Mercedes, Audi..." />
                        </div>

                        <div>
                            <label className={labelClass}>Model</label>
                            <input name="model" value={form.model} onChange={updateField} required className={inputClass} placeholder="e.g. X5, E-Class..." />
                        </div>

                        <div>
                            <label className={labelClass}>Year</label>
                            <input name="year" value={form.year} onChange={updateField} required type="number" className={inputClass} placeholder="2025" />
                        </div>

                        <div>
                            <label className={labelClass}>Daily Price ($)</label>
                            <input name="pricePerDay" value={form.pricePerDay} onChange={updateField} required min="0" type="number" className={inputClass} placeholder="100" />
                        </div>

                        <div>
                            <label className={labelClass}>Category</label>
                            <select name="category" value={form.category} onChange={updateField} className={inputClass}>
                                <option>Sedan</option>
                                <option>SUV</option>
                                <option>Luxury</option>
                                <option>Sports</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Transmission</label>
                            <select name="transmission" value={form.transmission} onChange={updateField} className={inputClass}>
                                <option>Automatic</option>
                                <option>Manual</option>
                                <option>Semi-Automatic</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Fuel Type</label>
                            <select name="fuel_type" value={form.fuel_type} onChange={updateField} className={inputClass}>
                                <option>Gasoline</option>
                                <option>Diesel</option>
                                <option>Hybrid</option>
                                <option>Electric</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Seating Capacity</label>
                            <input name="seating_capacity" value={form.seating_capacity} onChange={updateField} required min="1" type="number" className={inputClass} placeholder="5" />
                        </div>
                    </div>
                </div>

                {/* Location & description */}
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2.5">
                        Listing Information
                    </h2>
                    <div className="mt-5 space-y-5">
                        <div>
                            <label className={labelClass}>Location</label>
                            <input name="location" value={form.location} onChange={updateField} required className={inputClass} placeholder="e.g. San Francisco, CA" />
                        </div>

                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea name="description" value={form.description} onChange={updateField} required rows="4" className={`${inputClass} resize-none`} placeholder="Describe your car, its condition, and any notable details..." />
                        </div>
                    </div>
                </div>

                {message && (
                    <p className={`text-sm rounded-lg px-3 py-2 ${message.toLowerCase().includes('unable') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {message}
                    </p>
                )}

                <div className="flex items-center gap-3 pt-1">
                    <button disabled={submitting} className="bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dull transition-colors">
                        {submitting ? (id ? 'Saving...' : 'Listing...') : (id ? 'Save Changes' : 'List Your Car')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddCar