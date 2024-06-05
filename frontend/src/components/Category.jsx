import React, { useState } from "react";
import DishItem from "./DishItem";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";

function Category(props)  {
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const [category, setCategory] = useState(props.category);
    const [categoryName, setCategoryName] = useState(props.category.name);
    const canEdit = props.canEdit;

    const handleEditCategory = (e, category) => {
        e.preventDefault();
        setCategory(category);
        let ctg = category;
        ctg.name = categoryName;
        setCategory(ctg);
        console.log(ctg);

        const categoryNamePatch = async () => {
          const response = await api.patch("/category/" + category.id + "/",
              {
                  name: categoryName,
              });
          setCategoryName(response.data.name);
        };

      categoryNamePatch().catch((error) => {
          console.log(error);
      });

    }

    const handleAddDishItem = (e) => {
        let ctg = structuredClone(category);
        let newDish = {
                name: "новая позиция",
                price: -1,
                weight: -1,
                compound: "-1",
                category: category.id,
                photo: null
          };

        const postDishItem = async () => {
          const response = await api.post("/dish-item/", newDish);
          //setCategory(response.data);
          console.log(response.data);
          console.log(ctg.dish_item);
          ctg.dish_item.push(response.data);
          setCategory(ctg);
        };

        postDishItem().catch((error) => {
            console.log(error);
        });
    }

    return (
        <div>
            {!canEdit && <div>
                {category.name}
                <img src={category.photo} className="category-image" alt='...'/>
                <ul>
                {category.dish_item && category.dish_item.map((dishItem, i) => (
                    <li key={dishItem.id}><DishItem dishItem={dishItem} canEdit={canEdit} setCategory={setCategory}/></li>)
                )}
                </ul>
            </div>
            }

            {canEdit && <div>
                <form>
                    <input name="category-name"
                           value={categoryName}
                           onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <button onClick={(e) => handleEditCategory(e, category)}>
                        Сохранить
                    </button>
                </form>


                <img src={category.photo} className="category-image" alt='...'/>
                <ul>
                    {category.dish_item && category.dish_item.map((dishItem, i) => (
                        <li key={dishItem.id}>
                            <DishItem dishItem={dishItem}
                                                        canEdit={canEdit}
                                                        setCategory={setCategory}
                                                        category={category}
                                                        itemId={i}
                        /></li>)
                    )}
                    <button onClick={(e) => handleAddDishItem(e)}>
                        Добавить позицию
                    </button>
                </ul>

            </div>
            }
        </div>
    )
}

export default Category;