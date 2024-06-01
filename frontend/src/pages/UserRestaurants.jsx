import React, {useState, useContext, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import Restaurant from "../components/Restaurant";


const UserRestaurants = () => {
  const [response, setResponse] = useState("");
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const decode = jwtDecode(token);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect( () => {
      setLoading(true);

      const getRestaurants = async () => {
          const response = await api.get("/user/" + decode.id + "/restaurant/");
          setResponse(response.data.response);
          setRestaurants(response.data);
          setLoading(false);
      };

      getRestaurants().catch((error) => {
           console.log(error);
           setResponse(error);
      });
  }, []);


  return (
      <div className='dashboard'>
          <h1>Мои заведения:</h1>
          <Restaurant restaurants={restaurants} loading={loading}/>
      </div>
)
}

export default UserRestaurants;