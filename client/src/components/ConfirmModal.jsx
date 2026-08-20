import React from 'react'

const ConfirmModal = ({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, busy = false }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} disabled={busy} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Keep it</button>
                    <button type="button" onClick={onConfirm} disabled={busy} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:bg-slate-300">{busy ? 'Working...' : confirmLabel}</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
