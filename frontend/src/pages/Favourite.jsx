import React, {useContext, useEffect, useState} from 'react'
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import DefaultImage from "../assets/default-picture.png";

const Favourite = () => {
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const decode = jwtDecode(token);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  useEffect( () => {
        setLoading(true);

        const getRestaurants = async () => {
            const response = await api.get("/user/" + decode.user_id + "/favorite/");
            setRestaurants(response.data);
        };

        getRestaurants().catch((error) => {
             console.log(error);
        });

        setLoading(false);
    }, []);

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

export default Favourite;