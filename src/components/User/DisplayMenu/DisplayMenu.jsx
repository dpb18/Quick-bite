import React, { useContext, useState } from 'react';
import './DisplayMenu.css';
import { StoreContext } from '../../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const ITEMS_PER_PAGE = 8;

const DisplayMenu = ({ category }) => {
  const { dynamic_food_list } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState(1);

  // Use dynamic food list from backend
  const foodList = dynamic_food_list;

  // Filter items by category
  const filteredList = foodList.filter(item => category === "all" || category === item.category);

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedItems = filteredList.slice(startIdx, endIdx);

  return (
    <div className='food-display' id='food-display'>
      <h2>The best dishes from our restaurant</h2>
      <div className='food-display-list'>
        {paginatedItems.map((item) => (
          <FoodItem
            key={item.id || item._id}
            id={item.id || item._id}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.imgUrl || item.image}
          />
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={currentPage === idx + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayMenu;