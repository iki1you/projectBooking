import React, {useState, useEffect} from 'react';
import useAxios from "../utils/useAxios";
import { jwtDecode } from 'jwt-decode';
import Restaurants from "../components/Restaurants";
import baseURL from "../config";
import TagsMenu from "../components/TagsMenu";


const Home = () => {
  const [response, setResponse] = useState("");
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState("");

  const [next, setNext] = useState('');
  const [previous, setPrevious] = useState('');
  const [current, setCurrent] = useState('/restaurant/?page=1');

  const [active, setActive] = useState(false);

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

  const handleSubmit = (e) => {
        e.preventDefault()
        let queries = [];
        const name = e.target.name.value;
        if (name !== "")
          queries.push("name=" + name);
        if (tags !== "")
            queries.push("tag=" + tags)
        queries.push("page=1");
        let cur = "/restaurant/?" + queries.join('&')
        console.log(cur);
        getRestaurants(cur).catch((error) => {
             console.log(error);
             setResponse(error);
        });
    }

  return (
      <div className='dashboard'>
          <div>
              <form onSubmit={handleSubmit}>
                  <input id="name" type="search" name="name"/>
                  <button type="submit">Поиск</button>
              </form>
              <button onClick={(e) => setActive(true)}>Фильтрация</button>
          </div>
          <h2>Список заведений:</h2>

          <Restaurants restaurants={restaurants} loading={loading}/>
          <div>
              <button onClick={previousOnClick}>previous</button>
              {currentNumber}
              <button onClick={nextOnClick}>next</button>
          </div>

          <TagsMenu active={active} setActive={setActive} setTags={setTags} />
      </div>
  )
}

export default Home;