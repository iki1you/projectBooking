import React, {useEffect, useState} from "react";
import "./Menu.scss"
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import "./Booking.scss"

function Booking({active, setActive, restaurant, setNotification})  {
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const [date, setDate] = useState({});
    const [time, setTime] = useState({});
    const [compound, setCompound] = useState({});
    const [wishes, setWishes] = useState({});


    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(e.target)

        const date = e.target.date.value;
        const time = e.target.time.value;
        const compound = e.target.compound.value;
        const wishes = e.target.wishes.value;


        const postForm = async () => {
            const response = await api.post("/restaurant/" + restaurant.id + "/booking/", {
                date: date + 'T' + time,
                count_people: compound,
                wishes: wishes,
                booking_date: date,
                booking_time: time,
                user: decode.user_id
            });

            setWishes(wishes);
            setTime(time);
            setCompound(compound);
            setDate(date)

        }

        postForm().catch((error) => {
                console.log(error);
                setNotification("Ошибка " + error);
            });

        setActive(false);
        setNotification("Форма успешно отправлена")
    }

    return (
        <div className={active ? 'modal-booking active': 'modal-booking'} onClick={() => setActive(false)}>
            <div className={active ? 'modal-booking__content active' : 'modal-booking__content'}
                 onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>Забронировать место:</h2>
                    <p>
                        <label htmlFor="date">Дата: </label>
                        <input type="date" id="date" name="date" required/>
                        {' '}
                        <label htmlFor="time">Время: </label>
                        <input type="time" id="time" name="time" required/>
                    </p>
                    <p>
                        <label htmlFor="compound">Количество гостей: </label>
                        <input type="number" step="1" min="1" max="15" id="compound" name="compound" required/>
                    </p>
                    <p>
                        <label htmlFor="wishes">Пожелания:</label><br/>
                        <textarea id="wishes" name="wishes" placeholder="Добавить пожелания"
                                  cols="30" rows="7"></textarea>
                    </p>
                    <button type="submit">Отправить</button>
                </form>

            </div>
        </div>
    )
}

export default Booking;