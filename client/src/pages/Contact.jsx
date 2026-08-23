import React, { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import api from '../services/api'

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async event => {
        event.preventDefault()
        setSubmitting(true)
        setError('')
        try {
            await api.post('/contact', form)
            setSubmitted(true)
            setForm({ name: '', email: '', message: '' })
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to send message. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-50 to-slate-50 px-6 py-20 md:px-16">
                <div className="mx-auto max-w-4xl text-center">
                    <ScrollReveal>
                        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                            We're here to help.
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
                            Have a question about booking, listing your car, or something else? Reach out — we usually respond within 24 hours.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="px-6 py-16 md:px-16">
                <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.2fr_1fr]">
                    {/* Contact Form */}
                    <ScrollReveal>
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                            {submitted ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Message Sent</h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Thanks — we've received your message and will get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="btn-primary mt-6 !rounded-lg"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Your full name"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="you@example.com"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                                        <textarea
                                            required
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us how we can help..."
                                            rows={5}
                                            className="input-field resize-none"
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <button disabled={submitting} className="btn-primary w-full !rounded-lg">
                                        {submitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Contact Details */}
                    <ScrollReveal delay={200}>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Get in Touch</h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    Our team is ready to help with any questions about bookings, listings, payments, or your account.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Email us</p>
                                        <p className="text-sm text-slate-500">support@carrental.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Call us</p>
                                        <p className="text-sm text-slate-500">+250 788 123 456</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Visit us</p>
                                        <p className="text-sm text-slate-500">Kigali, Rwanda</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Hours</p>
                                        <p className="text-sm text-slate-500">Monday – Saturday, 8:00 AM – 6:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-sm font-medium text-slate-900">Follow us</p>
                                <div className="mt-3 flex items-center gap-3">
                                    {[
                                        { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                                        { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                                        { name: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                                    ].map(social => (
                                        <a
                                            key={social.name}
                                            href="#"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition hover:bg-primary hover:text-white text-slate-500"
                                            title={social.name}
                                        >
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d={social.path} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    )
}

export default Contact
