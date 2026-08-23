const StatusBadge = ({ status }) => {
    const styles = {
        confirmed: 'bg-green-100 text-green-600',
        completed: 'bg-blue-100 text-blue-600',
        pending: 'bg-yellow-100 text-yellow-600',
        live: 'bg-green-100 text-green-600',
        available: 'bg-green-100 text-green-600',
        unavailable: 'bg-red-100 text-red-600',
        cancelled: 'bg-red-100 text-red-600',
        rejected: 'bg-red-100 text-red-600',
        declined: 'bg-red-100 text-red-600',
    }

    const labels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
        live: 'Live',
        rejected: 'Rejected',
        declined: 'Declined',
        available: 'Available',
        unavailable: 'Unavailable',
    }

    const statusKey = status?.toLowerCase()
    return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${styles[statusKey] || 'bg-gray-100 text-gray-600'}`}>
            {labels[statusKey] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown')}
        </span>
    )
}

export default StatusBadge
