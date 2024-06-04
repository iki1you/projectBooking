import React from "react";
import "./Menu.scss"
import Category from "./Category";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";

function Menu({menu, active, setActive})  {
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const categories = menu.category;



    return (
        <div className={active ? 'modal-menu active': 'modal-menu'} onClick={() => setActive(false)}>
            <div className={active ? 'modal-menu__content active' : 'modal-menu_content'}
                 onClick={e => e.stopPropagation()}>
                <h2>{menu.name}</h2>
                <ul>
                    {categories && categories.map((category, i) => (
                        <li key={i}><Category category={category}/></li>)
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Menu;