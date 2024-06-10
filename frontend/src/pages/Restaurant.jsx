import {useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import Menu from "../components/Menu";
import MenuDelete from "../components/MenuDelete";
import DefaultImage from "../assets/default-picture.png";
import Booking from "../components/Booking";
import RestaurantReviews from "../components/RestaurantReviews";
import TagsMenu from "../components/TagsMenu";

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
    const [modalBookingActive, setModalBookingActive] = useState(false);
    const [menu, setMenu] = useState({});

    const [modalMenuDeleteActive, setModalMenuDeleteActive] = useState(false);
    const [menuArrayId, setMenuArrayId] = useState(0);

    const [avatarURL, setAvatarURL] = useState(DefaultImage);
    const fileUploadRef = useRef(null);

    const [notification, setNotification] = useState('');

    const [tags, setTags] = useState({});
    const [active, setActive] = useState(false);

    const [phone, setPhone] = useState("");
    const [site, setSite] = useState("");
    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState("");
    const [compound, setCompound] = useState(5);

    const [isFavourite, setIsFavourite] = useState(false);

    const getMenus = async () => {
        const response = await api.get("/restaurant/" + restaurantId + "/menu/");
        setResponse(response.data.response);
        setLoading(false);
        setMenus(response.data);
    };


    const handleSubmit = (e) => {
        e.preventDefault()

        const name = e.target.name.value;
        const address = e.target.address.value;
        const phone = e.target.phone.value;
        const site = e.target.site.value;
        const schedule = e.target.schedule.value;
        const description = e.target.description.value;
        const compound = e.target.compound.value;

        const getRestaurants = async () => {
            if (decode.user_id !== restaurant.owner) {
                return;
            }
            const response = await api.patch("/restaurant/" + restaurantId + "/",
                {
                    name: name,
                    address: address,
                    phone: phone,
                    site: site,
                    schedule: schedule,
                    description: description,
                    capacityOnTable: compound
                });
            setName(response.data.name);
            setOwner(response.data.owner);
            setAddress(response.data.address);
            setResponse(response.data.response);
            setPhone(response.data.phone);
            setSite(response.data.site);
            setSchedule(response.data.schedule);
            setDescription(response.data.description);
            setCompound(response.data.capacityOnTable);
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
            setPhone(response.data.phone);
            setSite(response.data.site);
            setSchedule(response.data.schedule);
            setDescription(response.data.description);
            setCompound(response.data.capacityOnTable);
            if (response.data.preview) {
                setAvatarURL(response.data.preview)
            }
        };

        getRestaurants().catch((error) => {
             console.log(error);
             setResponse(error);
        });


        getMenus().catch((error) => {
             console.log(error);
             setResponse(error);
             setLoading(false);
        });

         const getRestaurantTags = async () => {
            const response = await api.get("/restaurant/" + restaurantId + "/tag/");
            setTags(response.data);
        };

         getRestaurantTags().catch((error) => {
             console.log(error);
             setResponse(error);


        });

        const getFavourite = async () => {
            const response = await api.get("/user/" + decode.user_id + "/favorite/" + restaurantId + "/");
            setIsFavourite(true);
        };

        getFavourite().catch((error) => {
             console.log(error.response.data);
             setIsFavourite(false);
        });

        setLoading(false);
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

    const handleMenuOpen = (e, menu, menuId) => {
         e.preventDefault();
         setModalMenuActive(true);
         setMenu(menu);
         setMenuArrayId(menuId);
    }

    const handleMenuDeleteOpen = (e, menu) => {
         e.preventDefault();
         setModalMenuDeleteActive(true);
         setMenu(menu);
    }

     const handleBookingOpen = (e) => {
         e.preventDefault();
         setModalBookingActive(true);
    }

    const handleImageUpload = (e) => {
    e.preventDefault();
    fileUploadRef.current.click();
  }

  const handleFavourite = () => {
        if (!isFavourite) {
            const postFavourite = async () => {
                const response = await api.post("/user/" + decode.user_id + "/favorite/", {
                    restaurant: restaurantId
                });
                setIsFavourite(true);
            };

        postFavourite().catch((error) => {
             console.log(error.response.data);
             setNotification(error.response.data);
        });
        }

  }

    const handleFavouriteDelete = () => {
        if (isFavourite) {
            const postFavourite = async () => {
                const response = await api.delete("/user/" + decode.user_id + "/favorite/" + restaurantId + "/");
                setIsFavourite(false);
            };

        postFavourite().catch((error) => {
             console.log(error.response.data);
             setNotification(error.response.data);
        });
        }

  }

  const uploadImageDisplay = async () => {
    try {
      const uploadedFile = fileUploadRef.current.files[0];

      const formData = new FormData();
      formData.append("preview", uploadedFile);

      const uploadImage = async () => {
        const response = await api.patch("/restaurant/" + restaurantId + "/", formData);
        setResponse(response.data.response);
        setAvatarURL(response.data.preview);
      };

      await uploadImage();


    } catch(error) {
      console.error(error);
      setAvatarURL(DefaultImage);
    }
  }


    if (loading) {
       return <h2>Loading...</h2>
    }
    return (
        <div>
            <h1>Restaurant</h1>
            {restaurant.owner !== decode.user_id && <div>
                <img src={avatarURL} alt="Avatar" className="h-96 w-96 rounded-full" width="200" height="200"/>
                <p>
                    <button className='booking-open-btn' onClick={(e) => handleBookingOpen(e)}>Забронировать</button>
                </p>
                {notification}
                {!isFavourite && <p>
                    <button onClick={handleFavourite}>Добавить в избранное</button>
                </p>}
                {isFavourite && <p>
                    <button onClick={handleFavouriteDelete}>Удалить из избранного</button>
                </p>}
                <p>name: {restaurant.name}</p>
                <p>address: {restaurant.address}</p>
                <p>rating: {(Math.round(restaurant.rating * 100) / 100).toFixed(2)}{!restaurant.rating && <>null</>}</p>
                <h3>Тэги:</h3>
                <ul>
                    {tags && Object.entries(tags).map((tagGroup) => (
                        <li>
                            <ul>
                                <h3>{tagGroup[0]}</h3>
                                {
                                    tagGroup[1].map((tag) => (
                                        <li key={tag.id}>
                                            {tag.name}
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))}
                </ul>
                {menus.map((menu, i) => (<div key={menu.id}>
                    <button className='menu-open-btn' onClick={(e) => handleMenuOpen(e, menu)}>{menu.name}</button>
                </div>))}
                {restaurant.id && <RestaurantReviews restaurant={restaurant}/>}
            </div>
            }

            {restaurant.owner === decode.user_id && <div>
                <h2><a href={"/restaurant/" + restaurantId + "/bookings"} className="booking-href">Брони:</a></h2>
                <p><button onClick={(e) => setActive(true)}>Настроить теги</button></p>
                <img src={avatarURL} alt="Avatar" className="h-96 w-96 rounded-full" width="200" height="200"/>
                <form encType='multipart/form-data'>
                    <button type='submit' onClick={handleImageUpload}>
                        Загрузить
                    </button>
                    <input type="file" id="file" ref={fileUploadRef} onChange={uploadImageDisplay} hidden/>
                </form>
                <form onSubmit={handleSubmit}>
                    <p><label>Название: </label>
                        <input value={name}
                               onChange={e => setName(e.target.value)}
                               type="name"
                               name="name"/></p>

                    <p><label>Адрес: </label>
                        <input value={address}
                               onChange={e => setAddress(e.target.value)}
                               type="address"
                               name="address"/></p>

                    <p><label>Телефон: </label>
                        <input value={phone}
                               onChange={e => setPhone(e.target.value)}
                               type="phone"
                               name="phone"/></p>

                    <p><label>Сайт: </label>
                        <input value={site}
                               onChange={e => setSite(e.target.value)}
                               type="site"
                               name="site"/></p>

                    <p><label>Описание: </label>
                        <input value={description}
                               onChange={e => setDescription(e.target.value)}
                               type="description"
                               name="description"/></p>

                    <p><label>Расписание: </label>
                        <input value={schedule}
                               onChange={e => setSchedule(e.target.value)}
                               type="schedule"
                               name="schedule"/></p>

                    <p><label>Максимальное количество мест: </label>
                        <input value={compound}
                               onChange={e => setCompound(e.target.value)}
                               type="number"
                               name="compound"/></p>


                    <p>rating: {restaurant.rating}{!restaurant.rating && <>null</>}</p>
                    <button type='submit'>Сохранить</button>
                </form>
                {menus.map((menu, i) => (<div key={menu.id}>
                    <button className='menu-open-btn' onClick={(e) => handleMenuOpen(e, menu, i)}>{menu.name}</button>
                    <button className='menu-delete-btn' onClick={(e) => handleMenuDeleteOpen(e, menu)}>удалить</button>
                    </div>)
                )}
                <button onClick={handleAddMenu}>Добавить меню</button>
                {restaurant.id && <RestaurantReviews restaurant={restaurant}/>}
            </div>
            }

            <Menu active={modalMenuActive}
                  setActive={setModalMenuActive}
                  menu={menu}
                  owner={restaurant.owner}
                  restaurantId={restaurantId}
                  menuArrayId={menuArrayId}
                  setMenus={setMenus}
            />

            <MenuDelete active={modalMenuDeleteActive}
                        setActive={setModalMenuDeleteActive}
                        menu={menu}
                        setMenus={setMenus}
                        restaurantId={restaurantId}
            />
            <Booking active={modalBookingActive}
                     setActive={setModalBookingActive}
                     restaurant={restaurant}
                     setNotification={setNotification}
            />

            <TagsMenu active={active} setActive={setActive} setTags={setTags} restaurant={restaurant} canEdit={true} />
        </div>
    )
}

export default Restaurant;