import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";


const UserBookings = () => {
  const [response, setResponse] = useState("");
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const decode = jwtDecode(token);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [next, setNext] = useState('');
  const [previous, setPrevious] = useState('');
  const [current, setCurrent] = useState("/user/" + decode.id + '/booking/?status=Ожидается&page=1');

  const [currentNumber, setCurrentNumber] = useState(1);

  const [optionsState, setOptionsState] = useState("Ожидается");

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
      let cur = "/user/" + decode.id + '/booking/?status=' + e.target.value + '&page=1'
      setOptionsState(e.target.value);
      setLoading(true);
      setCurrent(cur);
      setCurrentNumber(1);
      getRestaurants(cur).catch((error) => {
           console.log(error);
           setResponse(error);
      });
  }


  useEffect( () => {
      setLoading(true);

      getRestaurants(current).catch((error) => {
           console.log(error);
           setResponse(error);
      });
  }, []);

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
                  <li key={booking.id}>
                      <ul>
                          <li>Заведение: {booking.restaurant_name}</li>
                          <li>Дата: {booking.booking_date} Время: {booking.booking_time}</li>
                          <li>Адрес: {booking.restaurant_address}</li>
                          <li>Количество мест: {booking.count_people}</li>
                          <li>{booking.status}</li>
                      </ul>
                      <div>
                          {booking.status === "Ожидается" &&
                              <button onClick={(e) => handlerReject(e, booking)}>Отклонить</button>}

                      </div>
                  </li>)
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

export default UserBookings;