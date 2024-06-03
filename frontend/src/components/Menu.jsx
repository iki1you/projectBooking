import React from "react";
import Category from "./Category";

function Menu(props)  {
    const menu = props.menu;
    const categories = menu.category;

    return (
        <div>
            <h2>Menu:</h2>
            <ul>
                {categories && categories.map((category, i) => (
                    <li key={i}><Category category={category}/></li>)
                )}
            </ul>
        </div>
    )
}

export default Menu;