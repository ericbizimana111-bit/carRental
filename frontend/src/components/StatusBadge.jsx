const StatusBadge = ({ status }) => {
    const styles = {
        confirmed: 'bg-green-100 text-green-600',
        completed: 'bg-blue-100 text-blue-600',
        pending: 'bg-yellow-100 text-yellow-600',
        available: 'bg-green-100 text-green-600',
        unavailable: 'bg-red-100 text-red-600',
        cancelled: 'bg-red-100 text-red-600'
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

export default StatusBadge