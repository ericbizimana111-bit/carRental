import React from 'react'
import ScrollReveal from '../components/ScrollReveal'

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-50 to-slate-50 px-6 py-20 md:px-16">
                <div className="mx-auto max-w-4xl text-center">
                    <ScrollReveal>
                        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                            Your car, your rules. Your ride, your way.
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
                            CarRental is a peer-to-peer car rental platform that connects everyday car owners with people who need a reliable ride — for a day, a weekend, or longer.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Who We're For */}
            <section className="px-6 py-16 md:px-16">
                <div className="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <h2 className="text-2xl font-semibold text-slate-900">Who We're For</h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            We built CarRental for two kinds of people: car owners with a vehicle sitting idle more often than it's driven, and renters who want a better, more affordable alternative to traditional rental agencies. Whether you're listing your car to earn extra income or booking one for your next trip, CarRental makes the process simple, transparent, and secure.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* The Problem We Solve */}
            <section className="bg-slate-50 px-6 py-16 md:px-16">
                <div className="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <h2 className="text-2xl font-semibold text-slate-900">The Problem We Solve</h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            Traditional car rental is expensive, inflexible, and often limited to airport counters and corporate fleets. Meanwhile, thousands of privately owned cars sit parked and unused for most of the week. CarRental bridges that gap — giving owners a way to turn idle vehicles into income, and giving renters access to a wider variety of cars at better prices, booked directly from people in their own community.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Our Mission */}
            <section className="px-6 py-16 md:px-16">
                <div className="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <h2 className="text-2xl font-semibold text-slate-900">Our Mission</h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            To make car ownership work harder for owners, and car access easier for everyone else — through a platform built on trust, transparency, and fair pricing.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Our Values */}
            <section className="bg-slate-50 px-6 py-16 md:px-16">
                <div className="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <h2 className="text-2xl font-semibold text-slate-900">Our Values</h2>
                    </ScrollReveal>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <ScrollReveal delay={100}>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900">Trust First</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    Every listing is reviewed before it goes live, and every booking is tracked from request to completion.
                                </p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900">Fair to Owners</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    Owners keep 95% of every booking; we only take a small platform fee to keep things running.
                                </p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={300}>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900">Transparency for Renters</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    Real reviews, real ratings, and clear pricing with no hidden fees.
                                </p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={400}>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900">Community-Driven</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    We're built around real people renting from real people, not a faceless fleet.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="px-6 py-16 md:px-16">
                <div className="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <h2 className="text-2xl font-semibold text-slate-900">How It Works</h2>
                    </ScrollReveal>
                    <div className="mt-8 space-y-6">
                        {[
                            { step: '1', title: 'Owners list their car', desc: 'Add details, photos, and a price. Listings are reviewed before they go live.' },
                            { step: '2', title: 'Renters browse and book', desc: 'Search available cars, pick your dates, and send a booking request.' },
                            { step: '3', title: 'Owners confirm the booking', desc: 'Once accepted, the booking is locked in and ready to go.' },
                            { step: '4', title: 'Drive, return, and review', desc: 'After the rental, renters can leave a rating and review to help the next person choose with confidence.' },
                        ].map(({ step, title, desc }) => (
                            <ScrollReveal key={step} delay={Number(step) * 100}>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                                        {step}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
