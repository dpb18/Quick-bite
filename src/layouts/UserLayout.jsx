import React from 'react'
import Navbar from '../components/User/Navbar/Navbar'
import Footer from '../components/User/Footer/Footer'

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout
