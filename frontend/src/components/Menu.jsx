import React, {useEffect, useState} from "react";
import "./Menu.scss"
import Category from "./Category";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";

function Menu({menu, active, setActive, owner, restaurantId, menuArrayId, setMenus})  {
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(false);
    const [category, setCategory] = useState({});
    const [menuName, setMenuName] = useState('');
    let user_id = decode.user_id;

    const handleDeleteCategory = (e, categoryId) => {
        const deleteCategory = async () => {
            const response = await api.delete("/category/" + categoryId + "/");
            const newArray = categories.filter((item, index) => item.id !== categoryId);
            setCategories(newArray);
        };

        deleteCategory().catch((error) => {
             console.log(error);
        });

    }
    const getCategories = async () => {
        const response = await api.get("/restaurant/" + restaurantId + "/menu/");
        setCategories(response.data[menuArrayId].category);
    };

    const handleAddCategory = (e) => {
        const addCategory = async () => {
            const response = await api.post("/category/", {
                "name": "Новая категория",
                "photo": null,
                "menu": menu.id
            });
        };

        addCategory().then(getCategories).catch((error) => {
             console.log(error);
        });
    }

    useEffect( () => {
        setCategories(menu.category);
        setMenuName(menu.name);
    }, [menu.category]);

    const getMenus = async () => {
        const response = await api.get("/restaurant/" + restaurantId + "/menu/");
        setMenus(response.data);
        console.log(response.data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(menuName);
        const menuTitle = async () => {
            const response = await api.patch("/menu/" + menu.id + "/", {
                "name": menuName
            });
            setMenuName(response.data.name);
        };
        menuTitle().then(getMenus).catch((error) => {
             console.log(error);
        });

    }

    return (
        <div className={active ? 'modal-menu active': 'modal-menu'} onClick={() => setActive(false)}>
            <div className={active ? 'modal-menu__content active' : 'modal-menu__content'}
                 onClick={e => e.stopPropagation()}>
                {user_id !== owner && <ul>
                    <h2>{menu.name}</h2>
                    {categories && categories.map((category, i) => (
                        <li key={category.id}><Category category={category} canEdit={false}/></li>)
                    )}
                </ul>}
                {user_id === owner && <div>
                    <form onSubmit={handleSubmit}>
                        <input onChange={e => setMenuName(e.target.value)} value={menuName}/>
                        <button type='submit'>Сохранить</button>
                    </form>
                    <ul>{categories && categories.map((category, i) => (
                        <li key={category.id}><Category category={category} canEdit={true}/>
                            <button onClick={(e) => handleDeleteCategory(e, category.id)}>
                                Удалить
                            </button>
                        </li>)
                    )}
                    </ul>
                    <button onClick={handleAddCategory}>Добавить категорию</button>
                </div>}
            </div>
        </div>
    )
}

export default Menu;