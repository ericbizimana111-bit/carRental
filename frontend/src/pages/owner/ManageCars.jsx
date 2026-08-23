import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import CarCard from '../../components/CarCard'
import ConfirmModal from '../../components/ConfirmModal'

const ManageCars = () => {
    const [cars, setCars] = useState([])
    const [message, setMessage] = useState('')
    const [deleteId, setDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [loading, setLoading] = useState(true)

    const loadCars = async () => {
        setLoading(true)
        try {
            const response = await api.get('/cars/owner/list')
            setCars(response.data.data || [])
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to load cars')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadCars() }, [])

    const deleteCar = async () => {
        if (!deleteId) return
        setDeleting(true)
        try {
            await api.delete(`/cars/${deleteId}`)
            setDeleteId(null)
            loadCars()
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to delete car')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="page-container !max-w-7xl">
            <h1 className="page-title">Manage Cars</h1>
            <p className="page-subtitle">
                View, edit, or remove your listed vehicles from the platform.
            </p>

            {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

            {loading ? (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />)}
                </div>
            ) : cars.length === 0 ? (
                <p className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    You have not listed any cars yet.
                </p>
            ) : (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {cars.map(car => (
                        <CarCard key={car._id} car={car} ownerMode onDelete={setDeleteId} />
                    ))}
                </div>
            )}

            <ConfirmModal
                open={Boolean(deleteId)}
                title="Delete this car?"
                message="Are you sure you want to delete this car?"
                confirmLabel="Delete car"
                onConfirm={deleteCar}
                onCancel={() => setDeleteId(null)}
                busy={deleting}
            />
        </div>
    )
}

export default ManageCars
