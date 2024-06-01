import React from "react";

function Restaurant({restaurants, loading}) {
    if (loading) {
       return <h2>Loading...</h2>
    }
    return (<ul className="list-group" >
        {restaurants.length === 0 && <h2>Нет заведений</h2>}
        {restaurants.length !== 0 && restaurants.map((restaurant, i) => (
            <li key={i} className="list-group-item">
                {restaurant.name}
                {restaurant.owner}
            </li>
          ))}
    </ul>);
}

export default Restaurant;