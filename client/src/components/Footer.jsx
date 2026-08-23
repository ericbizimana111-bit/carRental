import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='px-6 md:px-16 lg:px-32 mt-60 text-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 md:gap-6 pb-6 border-borderColor border-b'>
                <div>
                    <img src={assets.logo} alt="logo" className='h-8 md:h-9' />
                    <p className='max-w-80 mt-3'>
                        Premium car rental platform connecting car owners with renters for a better, more affordable experience.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        <a href="#" className="transition hover:opacity-70"><img src={assets.instagram_logo} className='w-5 h-5' alt="Instagram" /></a>
                        <a href="#" className="transition hover:opacity-70"><img src={assets.facebook_logo} className='w-5 h-5' alt="Facebook" /></a>
                        <a href="#" className="transition hover:opacity-70"><img src={assets.twitter_logo} className='w-5 h-5' alt="Twitter" /></a>
                        <a href="#" className="transition hover:opacity-70"><img src={assets.gmail_logo} className='w-5 h-5' alt="Email" /></a>
                    </div>
                </div>

                <div>
                    <p className='text-base font-medium text-gray-800 uppercase'>Quick Links</p>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
                        <li><Link to="/cars" className="hover:text-primary transition">Browse Cars</Link></li>
                        <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition">Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li>Kigali, Rwanda</li>
                        <li>+250 788 123 456</li>
                        <li>support@carrental.com</li>
                        <li>Mon - Sat, 8:00 AM - 6:00 PM</li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition">Help Center</Link></li>
                        <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>&copy; {new Date().getFullYear()} CarRental. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                    <li><a href="#" className="hover:text-primary transition">Cookie</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer
