import React, {useEffect, useState} from "react";
import "./Menu.scss"
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import DefaultImage from "../assets/default-picture.png";
import "./Booking.scss";


function RestaurantReviews({restaurant})  {
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([])


    const getReviews = async () => {
            const response = await api.get("/restaurant/" + restaurant.id + "/reviews/");
            setReviews(response.data);
            console.log(response.data);
        };


    useEffect( () => {
        setLoading(true);

        getReviews().catch((error) => {
             console.log(error);
        });

        setLoading(false);

    }, []);

    const handleDelete = (e, review) => {
        e.preventDefault();

        const deleteReview = async () => {
            const response = await api.delete("/reviews/" + review.id + "/");
        }

        deleteReview().then(getReviews).catch((error) => {
                console.log(error);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const text = e.target.review.value;
        const rating = e.target.rating.value;

        const postForm = async () => {
            const response = await api.post("/restaurant/" + restaurant.id + "/reviews/", {
                user: decode.user_id,
                rating: rating,
                text: text,
            });
        }

        postForm().then(getReviews).catch((error) => {
                console.log(error);
            });
    }


    if (loading) {
        return (<div>
            <h1>Отзывы:</h1>
            {loading && <div>Загрузка...</div>}
        </div>)

    }
    return (
        <div>
            <h1>Отзывы:</h1>

            <ul>
                {decode.user_id !== restaurant.owner && <div>
                    <form onSubmit={handleSubmit}>
                        <p>
                            <label htmlFor="review">Написать отзыв: </label><br/>
                            <textarea id="review" name="review" placeholder="Добавить отзыв" cols="30" rows="7" required/>
                        </p>

                        <p>
                            <label htmlFor="rating">Оценка: </label>
                            <input type="number" id="rating" name="rating" min="1" max="5" required/>
                        </p>


                        <button type='submit'>Отправить</button>
                    </form>
                </div>}
                {!loading && reviews.map((review, i) => (<li key={review.id}>
                        <ul key={review.id + 'content'}>

                            <li><img src={review.user_avatar ? review.user_avatar : DefaultImage} alt="Avatar"
                                     className="h-96 w-96 rounded-full" width="70" height="70"/></li>
                            <li>Оценка {review.rating}/5</li>
                            <li>Имя: {review.user_name}</li>
                            <li>Количество отзывов: {review.user_reviews}</li>
                            <li>Отзыв: {review.text}</li>
                            <li>Время: {review.time}</li>
                            {decode.user_id === review.user &&
                                <button onClick={(e) => handleDelete(e, review)}>Удалить</button>}
                        </ul>
                    </li>)
                )}
            </ul>
        </div>
    )
}

export default RestaurantReviews;