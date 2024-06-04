import React from "react";
import "./MenuDelete.scss"
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";

function MenuDelete({menu, active, setActive, setMenus, restaurantId})  {
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const categories = menu.category;

    const getMenus = async () => {
        const response = await api.get("/restaurant/" + restaurantId + "/menu/");
        setMenus(response.data);
    };

    const handleDeleteMenu = (e) => {
        e.preventDefault()
        const deleteMenu = async () => {
            const response = await api.delete("/menu/" + menu.id + "/");
        };
        deleteMenu().then(getMenus).catch((error) => {
             console.log(error);
        })
        setActive(false);
    }

    return (
        <div className={active ? 'modal-menu-delete active': 'modal-menu-delete'} onClick={() => setActive(false)}>
            <div className={active ? 'modal-menu-delete__content active' : 'modal-menu-delete_content'}
                 onClick={e => e.stopPropagation()}>
                <p>Уверены, что хотите удалить {menu.name}?</p>
                <button onClick={handleDeleteMenu}>Да, удалить</button>
            </div>
        </div>
    )
}

export default MenuDelete;