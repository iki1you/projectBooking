import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";

function Restaurant()  {
    let { restaurantId } = useParams();
    const [response, setResponse] = useState("");
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const [restaurant, setRestaurant] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect( () => {
        setLoading(true);

        const getRestaurants = async () => {
            const response = await api.get("/restaurant/" + restaurantId + "/");
            setResponse(response.data.response);
            setRestaurant(response.data);
            setLoading(false);
        };

        getRestaurants().catch((error) => {
             console.log(error);
             setResponse(error);
        });
    }, []);

    if (loading) {
       return <h2>Loading...</h2>
    }
    return (
        <div>
            <h2>{restaurantId}</h2>
            <p>name: {restaurant.name}</p>
            <p>owner: {restaurant.owner}</p>
            <p>rating: {restaurant.rating}{!restaurant.rating && <>null</>}</p>
        </div>
    )
}

export default Restaurant;