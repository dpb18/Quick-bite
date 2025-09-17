import React, { useState } from 'react'
import './Home.css'
import Header from '../../../components/User/Header/Header'
import ExploreMenu from '../../../components/User/ExploreMenu/ExploreMenu'
import DisplayMenu from '../../../components/User/DisplayMenu/DisplayMenu'
import FeedbackSection from '../../../components/User/FeedbackSection/FeedbackSection'

const Home = () => {

  const [category,setCategory] = useState('all')
  return (
    <div>
      <div className="main-content">
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <DisplayMenu category={category}/>
        <FeedbackSection/>
      </div>
    </div>
  )
}

export default Home