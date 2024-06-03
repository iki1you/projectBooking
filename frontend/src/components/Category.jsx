import React, { useState } from "react";
import DishItem from "./DishItem";

function Category(props)  {
    const [category, setCategory] = useState(props.category);
    const dishItems = category.dish_item;

    return (
        <div>
            {category.name}
            <img src={category.photo} className="category-image" alt='...'/>
            <ul>
                {dishItems && dishItems.map((dishItem, i) => (
                    <li key={i}><DishItem dishItem={dishItem} /></li>)
                )}
            </ul>

        </div>
    )
}

export default Category;