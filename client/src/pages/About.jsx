import React from 'react'
import ScrollReveal from '../components/ScrollReveal'

const values = [
    {
        title: 'Trust First',
        desc: "Every listing is reviewed before it goes live, and every booking is tracked from request to completion.",
    },
    {
        title: 'Fair to Owners',
        desc: 'Owners keep 95% of every booking; we only take a small platform fee to keep things running.',
    },
    {
        title: 'Transparency for Renters',
        desc: 'Real reviews, real ratings, and clear pricing with no hidden fees.',
    },
    {
        title: 'Community-Driven',
        desc: "We're built around real people renting from real people, not a faceless fleet.",
    },
]

const steps = [
    { step: '01', title: 'Owners list their car', desc: 'Add details, photos, and a price. Listings are reviewed before they go live.' },
    { step: '02', title: 'Renters browse and book', desc: 'Search available cars, pick your dates, and send a booking request.' },
    { step: '03', title: 'Owners confirm the booking', desc: 'Once accepted, the booking is locked in and ready to go.' },
    { step: '04', title: 'Drive, return, and review', desc: 'After the rental, renters can leave a rating and review to help the next person choose with confidence.' },
]

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="border-b border-slate-100 px-6 py-24 md:px-16">
                <div className="mx-auto max-w-3xl text-center">
                    <ScrollReveal>
                        <span className="text-2xl font-semibold  text-primary">
                            About CarRental
                        </span>
                        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
                            Your car, your rules. Your ride, your way.
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500">
                            CarRental is a peer-to-peer car rental platform that connects everyday car owners with people who need a reliable ride — for a day, a weekend, or longer.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Who We're For */}
            <section className="px-6 py-16 md:px-16">
                <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[160px_1fr]">
                    <ScrollReveal>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Who We're For
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <p className="text-base leading-relaxed text-slate-600">
                            We built CarRental for two kinds of people: car owners with a vehicle sitting idle more often than it's driven, and renters who want a better, more affordable alternative to traditional rental agencies. Whether you're listing your car to earn extra income or booking one for your next trip, CarRental makes the process simple, transparent, and secure.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* The Problem We Solve */}
            <section className="border-y border-slate-100 bg-slate-50/60 px-6 py-16 md:px-16">
                <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[160px_1fr]">
                    <ScrollReveal>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            The Problem
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <p className="text-base leading-relaxed text-slate-600">
                            Traditional car rental is expensive, inflexible, and often limited to airport counters and corporate fleets. Meanwhile, thousands of privately owned cars sit parked and unused for most of the week. CarRental bridges that gap — giving owners a way to turn idle vehicles into income, and giving renters access to a wider variety of cars at better prices, booked directly from people in their own community.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Our Mission */}
            <section className="px-6 py-16 md:px-16">
                <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[160px_1fr]">
                    <ScrollReveal>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Our Mission
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <p className="text-base leading-relaxed text-slate-600">
                            To make car ownership work harder for owners, and car access easier for everyone else — through a platform built on trust, transparency, and fair pricing.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Our Values */}
            <section className="border-t border-slate-100 bg-slate-50/60 px-6 py-16 md:px-16">
                <div className="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold text-slate-900">Our Values</h2>
                    </ScrollReveal>
                    <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
                        {values.map((value, i) => (
                            <ScrollReveal key={value.title} delay={i * 100}>
                                <div className="h-full bg-white p-6">
                                    <span className="text-xs font-semibold text-primary">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="mt-2 text-base font-semibold text-slate-900">
                                        {value.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                        {value.desc}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="px-6 py-16 md:px-16">
                <div className="mx-auto max-w-4xl">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
                    </ScrollReveal>
                    <div className="relative mt-10">
                        {/* Connecting line */}
                        <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-200" />
                        <div className="space-y-10">
                            {steps.map(({ step, title, desc }, i) => (
                                <ScrollReveal key={step} delay={i * 100}>
                                    <div className="relative flex items-start gap-5 pl-0">
                                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-900">
                                            {step}
                                        </div>
                                        <div className="pt-1.5">
                                            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                                            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About