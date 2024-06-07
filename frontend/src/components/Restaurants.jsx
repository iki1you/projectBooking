import React from "react";
import DefaultImage from "../assets/default-picture.png";

function Restaurants({restaurants, loading}) {
    if (loading) {
       return <h2>Loading...</h2>
    }
    return (<ul className="list-group" >
        {restaurants.length === 0 && <h2>Нет заведений</h2>}
        {restaurants.length !== 0 && restaurants.map((restaurant, i) => (
            <li key={i} className="list-group-item">

                <a href={"/restaurant/" + restaurant.id}>{restaurant.name}</a>
                <img src={restaurant.preview ? restaurant.preview : DefaultImage} alt="photo" width="50" height="50"/>
            </li>
        ))}
    </ul>);
}

export default Restaurants;