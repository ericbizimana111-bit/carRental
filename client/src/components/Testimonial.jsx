import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import ScrollReveal from './ScrollReveal'

const StarIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
        <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={filled ? '#f59e0b' : 'none'}
            stroke="#f59e0b"
            strokeWidth="1"
            strokeLinejoin="round"
        />
    </svg>
)

const Testimonial = () => {
    const testimonials = [
        {
            name: "Biz.Eric",
            location: "New York, USA",
            image: assets.user_profile,
            testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!"
        },
        {
            name: "Mush.Aline",
            location: "Barcelona, Spain",
            image: assets.testimonial_image_1,
            testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional."
        },
        {
            name: "Muk.Esperance",
            location: "Sydney, Australia",
            image: assets.testimonial_image_2,
            testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service."
        }
    ]

    return (
        <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
            <ScrollReveal>
                <Title title="What Our Customers Say" subTitle="Discover why discerning travelers choose CarRental for their luxury car rentals around the world." />
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial, index) => (
                    <ScrollReveal key={index} delay={index * 150}>
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">
                            <div className="flex items-center gap-3">
                                <img className="w-12 h-12 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} />
                                <div>
                                    <p className="text-xl">{testimonial.name}</p>
                                    <p className="text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <StarIcon key={i} filled={true} />
                                ))}
                            </div>
                            <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    )
}

export default Testimonial
