import React, { useState } from "react";

function Category(props)  {
    const [dishItem, setCategory] = useState(props.dishItem);

    return (
        <div>
            <p>{dishItem.name}</p>
            <p>{dishItem.price}</p>
            <p>{dishItem.weight}</p>
            <p>{dishItem.compound}</p>
            <p><img src={dishItem.photo} alt="..." className="dish-item-photo"/></p>
        </div>
    )
}

export default Category;