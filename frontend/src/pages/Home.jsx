import React, {useState, useEffect} from 'react';
import useAxios from "../utils/useAxios";
import { jwtDecode } from 'jwt-decode';
import Restaurants from "../components/Restaurants";
import baseURL from "../config";


const Home = () => {
  const [response, setResponse] = useState("");
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [next, setNext] = useState('');
  const [previous, setPrevious] = useState('');
  const [current, setCurrent] = useState('/restaurant/?page=1');

  const [currentNumber, setCurrentNumber] = useState(1);

  const getRestaurants = async ( cur ) => {
      const response = await api.get(cur);
      setPrevious(response.data.previous);
      setNext(response.data.next);
      console.log(response.data);
      console.log(response.data.next);
      setResponse(response.data.response);
      setRestaurants(response.data.results);
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


  return (
      <div className='dashboard'>
          <h2>Список заведений:</h2>

          <Restaurants restaurants={restaurants} loading={loading}/>
          <div>
              <button onClick={previousOnClick}>previous</button>
              {currentNumber}
              <button onClick={nextOnClick}>next</button>
          </div>
      </div>
  )
}

export default Home;