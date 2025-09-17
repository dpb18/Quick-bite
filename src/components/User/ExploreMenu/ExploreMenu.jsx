import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Explore the authentic menu from our resturant</p>
        <div className='explore-menu-list'>
            {menu_list.map((item, index) => {
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"all":item.menu_name)} className='explore-menu-item' key={index}>
                        <img className={category===item.menu_name?"Active":""} src={item.menu_image}/>
                        <h3>{item.menu_name}</h3>
                    </div>
                )   
            },)}
        </div>
        <hr/>
    </div>
  )
}

export default ExploreMenu