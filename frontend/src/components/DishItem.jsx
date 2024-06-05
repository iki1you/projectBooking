import React, {useContext, useState} from "react";
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";
import category from "./Category";

function DishItem(props)  {
    const [response, setResponse] = useState("");
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);

    const [dishItem, setDishItem] = useState(props.dishItem);
    let canEdit = props.canEdit;
    const [name, setName] = useState(props.dishItem.name);
    const [price, setPrice] = useState(props.dishItem.price);
    const [weight, setWeight] = useState(props.dishItem.weight);
    const [compound, setCompound] = useState(props.dishItem.compound);


    const handleSubmit = async (e) => {
      e.preventDefault();
      const name = e.target.name.value;
      const price = e.target.price.value;
      const weight = e.target.weight.value;
      const compound = e.target.compound.value;

      let category = props.category;
      let items = [...props.category.dish_item];
      items[props.itemId] = {
          name: name,
          price: parseInt(price),
          weight: parseInt(weight),
          compound: compound
      };
      category.dish_item = items;
      console.log(category);


      const editDishItem = async () => {
          const response = await api.patch("/dish-item/" + dishItem.id + "/",
              {
                  name: name,
                  price: price,
                  weight: weight,
                  compound: compound
              });
          setName(response.data.name);
          setPrice(response.data.price);
          setWeight(response.data.weight);
          setCompound(response.data.compound);
          setResponse(response.data.response);
          setResponse(response.data.response);
      };

      editDishItem().catch((error) => {
          console.log(error);
          setResponse(error);
      });
    }

    const handleDeleteItem = (e) => {
        e.preventDefault();

        const deleteDishItem = async () => {
          const response = await api.delete("/dish-item/" + dishItem.id + "/");
          let ctg = structuredClone(props.category)
          const newArray = props.category.dish_item.filter((item, index) => index !== props.itemId);
          ctg.dish_item = newArray;
          props.setCategory(ctg);
          console.log(ctg);
        };

        deleteDishItem().catch((error) => {
          console.log(error);
          setResponse(error);
        });
    }

    return (
        <div>
            {!canEdit && <div>
                <p>{dishItem.name}</p>
                <p>{dishItem.price}</p>
                <p>{dishItem.weight}</p>
                <p>{dishItem.compound}</p>
                <p><img src={dishItem.photo} alt="..." className="dish-item-photo"/></p>
            </div>}

            {canEdit && <form onSubmit={handleSubmit}>
                <p>name:<input
                    type="name"
                    name="name"
                    onChange={e => setName(e.target.value)}
                    value={name}></input></p>
                <p>price:<input type="number"
                                name="price"
                                onChange={e => setPrice(e.target.value)}
                                value={price}></input></p>
                <p>weight:<input type="number"
                                 name="weight"
                                 onChange={e => setWeight(e.target.value)}
                                 value={weight}></input></p>
                <p>compound:<input type="compound"
                                   name="compound"
                                   onChange={e => setCompound(e.target.value)}
                                   value={compound}></input></p>
                <p><img src={dishItem.photo} alt="..." className="dish-item-photo"/></p>
                <button type='submit'>Сохранить</button>
                ___________________
                <button onClick={handleDeleteItem}>Удалить</button>
            </form>}
        </div>
    )
}

export default DishItem;