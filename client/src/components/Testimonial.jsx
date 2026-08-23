import React from 'react'
import Title from './Title'
import ScrollReveal from './ScrollReveal'

const QuoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-primary/25">
        <path
            d="M7.17 6C4.87 8.13 3.5 11 3.5 14.3c0 3.13 1.9 5.2 4.2 5.2 1.9 0 3.3-1.4 3.3-3.2 0-1.6-1.1-2.9-2.7-3.1-.3 0-.5-.1-.5-.4 0-1.5 1.4-3.4 3.3-4.6L9.9 6c-1 .4-2 .9-2.73 0zm10 0c-2.3 2.13-3.67 5-3.67 8.3 0 3.13 1.9 5.2 4.2 5.2 1.9 0 3.3-1.4 3.3-3.2 0-1.6-1.1-2.9-2.7-3.1-.3 0-.5-.1-.5-.4 0-1.5 1.4-3.4 3.3-4.6L19.9 6c-1 .4-2 .9-2.73 0z"
            fill="currentColor"
        />
    </svg>
)

// Each testimonial gets a unique photo via a distinct seed — swap these
// for real customer photos or your own asset imports whenever you have them.
const testimonialsRow1 = [
    {
        name: "Biz. Eric",
        location: "New York, USA",
        image: "https://i.pravatar.cc/150?img=12",
        testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic."
    },
    {
        name: "Mush. Aline",
        location: "Barcelona, Spain",
        image: "https://i.pravatar.cc/150?img=47",
        testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional and genuinely welcoming."
    },
    {
        name: "Muk. Esperance",
        location: "Sydney, Australia",
        image: "https://i.pravatar.cc/150?img=33",
        testimonial: "I highly recommend CarRental. Their fleet is excellent, and I always feel like I'm getting the best deal with great service."
    },
    {
        name: "Daniel K.",
        location: "Toronto, Canada",
        image: "https://i.pravatar.cc/150?img=53",
        testimonial: "Booking was seamless from start to finish. The car was spotless and exactly as pictured. Will absolutely rent again."
    },
]

const testimonialsRow2 = [
    {
        name: "Sofia M.",
        location: "Milan, Italy",
        image: "https://i.pravatar.cc/150?img=25",
        testimonial: "A genuinely premium experience. Clear pricing, no hidden surprises, and the support team was quick to respond."
    },
    {
        name: "James O.",
        location: "London, UK",
        image: "https://i.pravatar.cc/150?img=15",
        testimonial: "Rented a car for a week-long business trip and everything was smooth — pickup, drop-off, all of it."
    },
    {
        name: "Amara N.",
        location: "Cape Town, South Africa",
        image: "https://i.pravatar.cc/150?img=44",
        testimonial: "Their fleet quality stood out immediately. Clean, well-maintained cars and a booking process that took minutes."
    },
    {
        name: "Liu Wei",
        location: "Singapore",
        image: "https://i.pravatar.cc/150?img=68",
        testimonial: "Excellent value and even better service. The team went out of their way to accommodate a last-minute change."
    },
]

const TestimonialCard = ({ testimonial }) => (
    <div className="w-[320px] shrink-0 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <img
                    className="h-11 w-11 rounded-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                />
                <div>
                    <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.location}</p>
                </div>
            </div>
            <QuoteIcon />
        </div>
        <p className="mt-4 text-sm font-light leading-relaxed text-slate-500">
            "{testimonial.testimonial}"
        </p>
    </div>
)

const Testimonial = () => {
    return (
        <div className="py-28">
            <div className="px-6 md:px-16 lg:px-24 xl:px-44">
                <ScrollReveal>
                    <Title
                        title="What Our Customers Say"
                        subTitle="Discover why discerning travelers choose CarRental for their luxury car rentals around the world."
                    />
                </ScrollReveal>
            </div>

            {/* Big rectangular frame holding both marquee rows, with side margins */}
            <ScrollReveal delay={150}>
                <div className="mx-6 mt-16 rounded-2xl border border-slate-200 bg-slate-50/50 py-10 md:mx-16 lg:mx-24 xl:mx-44">
                    <div className="space-y-6">
                        {/* Row 1 — scrolls left */}
                        <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                            <div className="flex w-max animate-[marquee-left_38s_linear_infinite] gap-6 group-hover:[animation-play-state:paused]">
                                {[...testimonialsRow1, ...testimonialsRow1].map((t, i) => (
                                    <TestimonialCard key={`r1-${i}`} testimonial={t} />
                                ))}
                            </div>
                        </div>

                        {/* Row 2 — scrolls right */}
                        <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                            <div className="flex w-max animate-[marquee-right_38s_linear_infinite] gap-6 group-hover:[animation-play-state:paused]">
                                {[...testimonialsRow2, ...testimonialsRow2].map((t, i) => (
                                    <TestimonialCard key={`r2-${i}`} testimonial={t} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <style>{`
                @keyframes marquee-left {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    from { transform: translateX(-50%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    )
}

export default Testimonial