import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import Menu from "../components/Menu";

function Restaurant()  {
    let { restaurantId } = useParams();
    const [response, setResponse] = useState("");
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const [restaurant, setRestaurant] = useState({});
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [owner, setOwner] = useState("");
    const [address, setAddress] = useState("");

    const [menus, setMenus] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(e.target)

        const name = e.target.name.value;
        const address = e.target.address.value;

        const getRestaurants = async () => {
            if (decode.user_id !== restaurant.owner) {
                return;
            }
            const response = await api.patch("/restaurant/" + restaurantId + "/",
                {
                    name: name,
                    address: address
                });
            setName(response.data.name);
            setOwner(response.data.owner);
            setAddress(response.data.address);
            setResponse(response.data.response);
            setRestaurant(response.data);
            console.log();
            setLoading(false);
        };
        getRestaurants().catch((error) => {
             console.log(error);
             setResponse(error);
        });
        console.log(name);
    }


    useEffect( () => {
        setLoading(true);

        const getRestaurants = async () => {
            const response = await api.get("/restaurant/" + restaurantId + "/");
            setName(response.data.name);
            setOwner(response.data.owner);
            setAddress(response.data.address);
            setResponse(response.data.response);
            setRestaurant(response.data);
        };

        getRestaurants().catch((error) => {
             console.log(error);
             setResponse(error);
        });

        const getMenus = async () => {
            console.log("asffsasfa="+restaurantId);
            const response = await api.get("/restaurant/" + restaurantId + "/menu/");
            setResponse(response.data.response);
            setLoading(false);
            setMenus(response.data);
            console.log(response.data);
        };

        getMenus().catch((error) => {
             console.log(error);
             setResponse(error);
        });
    }, []);

    if (loading) {
       return <h2>Loading...</h2>
    }
    return (
        <div>
            <h1>Restaurant</h1>
            {restaurant.owner !== decode.user_id && <div><h2>{restaurantId}</h2>
            <p>name: {restaurant.name}</p>
            <p>address: {restaurant.address}</p>
            <p>owner: {restaurant.owner}</p>
                <p>rating: {restaurant.rating}{!restaurant.rating && <>null</>}</p></div>
            }

            {restaurant.owner === decode.user_id && <form onSubmit={handleSubmit}>
                <p><label>name: </label>
                <input value={name}
                       onChange={e => setName(e.target.value)}
                       type="name"
                       name="name"/></p>

                <p><label>address: </label>
                    <input value={address}
                       onChange={e => setAddress(e.target.value)}
                       type="address"
                           name="address"/></p>
                <p>owner: {restaurant.owner}</p>
                <p>rating: {restaurant.rating}{!restaurant.rating && <>null</>}</p>
                <button type='submit'>Сохранить</button>
            </form>}
            {menus.map((menu, i) => (<Menu key={i} menu={menu}/>))}
        </div>
    )
}

export default Restaurant;