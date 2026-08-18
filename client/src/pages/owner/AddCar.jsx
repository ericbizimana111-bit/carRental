import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const AddCar = () => {
    const [image, setImage] = useState(null)

    return (
        <div className="p-6 md:p-8 max-w-5xl">
            <h1 className="text-2xl font-semibold">Add New Car</h1>
            <p className="text-xs text-gray-500 mt-1">
                Fill in details to list a new car for booking, including pricing, availability, and car specifications.
            </p>

            <form className="mt-7 max-w-3xl space-y-5">
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
                        <input className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="e.g. BMW, Mercedes, Audi..." />
                    </div>

                    <div>
                        <label className="text-xs">Model</label>
                        <input className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="e.g. X5, E-Class..." />
                    </div>

                    <div>
                        <label className="text-xs">Year</label>
                        <input type="number" className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="2025" />
                    </div>

                    <div>
                        <label className="text-xs">Daily Price ($)</label>
                        <input type="number" className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="100" />
                    </div>

                    <div>
                        <label className="text-xs">Category</label>
                        <select className="w-full border rounded-md p-2 mt-1 text-xs outline-none">
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Luxury</option>
                            <option>Sports</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs">Transmission</label>
                        <select className="w-full border rounded-md p-2 mt-1 text-xs outline-none">
                            <option>Automatic</option>
                            <option>Manual</option>
                            <option>Semi-Automatic</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs">Fuel Type</label>
                        <select className="w-full border rounded-md p-2 mt-1 text-xs outline-none">
                            <option>Gasoline</option>
                            <option>Diesel</option>
                            <option>Hybrid</option>
                            <option>Electric</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs">Seating Capacity</label>
                        <input type="number" className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="5" />
                    </div>
                </div>

                <div>
                    <label className="text-xs">Location</label>
                    <input className="w-full border rounded-md p-2 mt-1 text-xs outline-none" placeholder="e.g. San Francisco, CA" />
                </div>

                <div>
                    <label className="text-xs">Description</label>
                    <textarea rows="4" className="w-full border rounded-md p-2 mt-1 text-xs outline-none resize-none" placeholder="Describe your car, its condition, and any notable details..." />
                </div>

                <button className="bg-primary text-white px-5 py-2 rounded-md text-xs hover:bg-primary-dull transition">
                    List Your Car
                </button>
            </form>
        </div>
    )
}

export default AddCar