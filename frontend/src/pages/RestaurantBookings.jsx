import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";


const RestaurantBookings = () => {
  const { restaurantId } = useParams();
  const [response, setResponse] = useState("");
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const decode = jwtDecode(token);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsState, setOptionsState] = useState("Ожидается");


  const [next, setNext] = useState('');
  const [previous, setPrevious] = useState('');
  const [current, setCurrent] = useState("/restaurant/" + restaurantId + '/booking/?status=Ожидается&page=1');

  const [currentNumber, setCurrentNumber] = useState(1);

  const getRestaurants = async ( cur ) => {
      const response = await api.get(cur);
      setPrevious(response.data.previous);
      setNext(response.data.next);
      console.log(response.data);
      console.log(response.data.next);
      setResponse(response.data.response);
      setBookings(response.data.results);
      setLoading(false);
  };


  useEffect( () => {
      setLoading(true);

      getRestaurants(current).catch((error) => {
           console.log(error);
           setResponse(error);
      });
  }, []);


  const previousOnClick = () => {
      if (previous) {
          setCurrentNumber(currentNumber - 1);
          setCurrent(previous);
          getRestaurants(previous).catch((error) => {
            console.log(error);
            setResponse(error);
          });
      }
  }

  const nextOnClick = () => {
      if (next) {
          setCurrent(next);
          setCurrentNumber(currentNumber + 1);
          getRestaurants(next).catch((error) => {
           console.log(error);
           setResponse(error);
      });
      }
  }

  const handlerSelect = (e) => {
      let cur = "/restaurant/" + restaurantId + '/booking/?status=' + e.target.value + '&page=1'
      setOptionsState(e.target.value);
      setLoading(true);
      setCurrent(cur);
      setCurrentNumber(1);
      getRestaurants(cur).catch((error) => {
           console.log(error);
           setResponse(error);
      });
  }


  const handlerAccept = (e, booking) => {
      setLoading(true);

      const acceptBooking = async () => {
        const response = await api.patch("/booking/" + booking.id + "/accept/");
        setResponse(response.data.response);
      };

      acceptBooking().then(() => getRestaurants(current)).catch((error) => {
           console.log(error);
           setResponse(error);
      });
  }

  const handlerReject = (e, booking) => {
      setLoading(true);

      const acceptBooking = async () => {
        const response = await api.patch("/booking/" + booking.id + "/reject/");
        setResponse(response.data.response);
      };

      acceptBooking().then(() => getRestaurants(current)).catch((error) => {
           console.log(error);
           setResponse(error);
      });
  }

  return (
      <div className='dashboard'>
          <h1>История бронирований:</h1>
          <select value={optionsState} onChange={handlerSelect}>
              <option value="Ожидается">Ожидается</option>
              <option value="Отклонено">Отклонено</option>
              <option value="Подтверждено">Подтверждено</option>
          </select>
          {!loading && <ul>

              {bookings && bookings.map((booking, i) => (
                  <div key={booking.id}><li>
                      <ul>
                          <li>Дата: {booking.booking_date} Время: {booking.booking_time}</li>
                          <li>Количество мест: {booking.count_people}</li>
                          <li>Почта: {booking.user_email}</li>
                          <li>Имя: {booking.user_fullname}</li>
                          <li>Номер телефона: {booking.user_phone}</li>
                          <li>Пожелания: {booking.wishes}</li>
                          <li>{booking.status}</li>
                          <div>
                              <button onClick={(e) => handlerAccept(e, booking)}>Принять</button>
                              <button onClick={(e) => handlerReject(e, booking)}>Отклонить</button>
                          </div>
                      </ul>
                  </li></div>)
              )}
              <div>
                  <button onClick={previousOnClick}>previous</button>
                  {currentNumber}
                  <button onClick={nextOnClick}>next</button>
              </div>
          </ul>}
      </div>
  )
}

export default RestaurantBookings;