import React from 'react'
import './Header.css'

const Header = () => {
  const scrollToMenu = () => {
    const menuElement = document.getElementById('explore-menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='header' style={{backgroundImage: `url(/header_img.jpg)`}}>
        <div className='header-content'>
            <h2>Order Your favorite food here</h2>
            <p>Order the best food from our resturant. The best and the most authentic food in India since 1957.</p>
            <button onClick={scrollToMenu}>View Menu</button>
        </div>

    </div>
  )
}

export default Header