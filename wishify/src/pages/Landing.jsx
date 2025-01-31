import React from 'react'
import Navbar from '../components/Navbarlanding/landingheader'
import Hero from '../components/HeroLanding/hero'
import Footer from '../components/FooterLanding/Footer'
import Card from "../components/CardLanding/Card";


const Landing = () => {
  return (
    <>
        <Navbar />
        <Hero />
        <Card />
        <Footer />
    </>
  )
}

export default Landing