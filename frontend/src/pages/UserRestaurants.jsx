import React, {useState, useContext, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Restaurant from "../components/Restaurant";


const UserRestaurants = () => {
  const [response, setResponse] = useState("")
  const api = useAxios();
  const token = localStorage.getItem("authTokens")
  const {logoutUser} = useContext(AuthContext)

  const decode = jwtDecode(token)
  // console.log(decode)
  let navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  useEffect( () => {
      let loading = true;

      const getRestaurants = async () => {
          const response = await api.get("/user/" + decode.id + "/restaurant/");
          console.log(response.data);
          setResponse(response.data.response);

          if (loading) {
              setRestaurants(response.data);
          }
      };

      getRestaurants().catch((error) => {
           console.log(error);
           setResponse(error);
      });

      return () => loading = true;
  }, [restaurants]);



  return (
      <div className='dashboard'>
          {console.log(restaurants)}
          {restaurants && restaurants.map((item) => (
              <Restaurant name={item.name} owner={item.owner} />
          ))}
      </div>
)
}

export default UserRestaurants;