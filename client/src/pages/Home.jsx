import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <div>
      <Hero />
      <div id="about"><FeaturedSection /></div>
      <Banner />
      <Testimonial />
      <div id="contact"><NewsLetter /></div>
    </div>
  )
}

export default Home
