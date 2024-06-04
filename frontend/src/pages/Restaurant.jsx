import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import Menu from "../components/Menu";
import MenuDelete from "../components/MenuDelete";

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
    const [modalMenuActive, setModalMenuActive] = useState(false);
    const [menu, setMenu] = useState({});

    const [modalMenuDeleteActive, setModalMenuDeleteActive] = useState(false);

    const getMenus = async () => {
        const response = await api.get("/restaurant/" + restaurantId + "/menu/");
        setResponse(response.data.response);
        setLoading(false);
        setMenus(response.data);
        console.log(response.data);
    };


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
            setLoading(false);
        };
        getRestaurants().catch((error) => {
             console.log(error);
             setResponse(error);
        });
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


        getMenus().catch((error) => {
             console.log(error);
             setResponse(error);
        });
    }, []);

    const handleAddMenu = (e) => {
        e.preventDefault()
        const addMenu = async () => {
            if (decode.user_id !== restaurant.owner) {
                return;
            }
            const addMenu = await api.post("/menu/",
                {
                    name: 'Новое меню',
                    restaurant: restaurantId
                });
            setResponse(addMenu.data.response);
        };
        addMenu()
            .then(getMenus)
            .catch((error) => {
             console.log(error);
             setResponse(error);
        });
    }

    const handleMenuOpen = (e, menu) => {
         e.preventDefault();
         setModalMenuActive(true);
         setMenu(menu);
    }

    const handleMenuDeleteOpen = (e, menu) => {
         e.preventDefault();
         setModalMenuDeleteActive(true);
         setMenu(menu);
    }


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
                <p>rating: {restaurant.rating}{!restaurant.rating && <>null</>}</p>
                {menus.map((menu, i) => (<div>
                    <button className='menu-open-btn' onClick={(e) => handleMenuOpen(e, menu)}>{menu.name}</button>
                </div>))}
            </div>
            }

            {restaurant.owner === decode.user_id && <div>
                    <form onSubmit={handleSubmit}>
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
                     </form>
                    {menus.map((menu, i) => (<div>
                        <button className='menu-open-btn' onClick={(e) => handleMenuOpen(e, menu)}>{menu.name}</button>
                        <button className='menu-delete-btn' onClick={(e) => handleMenuDeleteOpen(e, menu)}>удалить</button>
                    </div>)
                    )}
                    <button onClick={handleAddMenu}>Добавить меню</button>
                </div>
            }
            <Menu active={modalMenuActive} setActive={setModalMenuActive} menu={menu}/>
            <MenuDelete active={modalMenuDeleteActive}
                        setActive={setModalMenuDeleteActive}
                        menu={menu}
                        setMenus={setMenus}
                        restaurantId={restaurantId}
            />
        </div>
    )
}

export default Restaurant;