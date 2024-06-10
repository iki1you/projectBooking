import React, {useState, useContext, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'


const AddRestaurant = () => {
  const [response, setResponse] = useState("")
  const api = useAxios();
  const token = localStorage.getItem("authTokens")
  const {logoutUser} = useContext(AuthContext)

  const decode = jwtDecode(token)
  // console.log(decode)
  let navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
      name: null,
      address: null,
      description: null,
      phone: null,
      site: null,
      owner: null,
      schedule: null,
      capacityOnTable: 4,
      logo: null,
      preview: null
  })

  const handleSubmit = async (e) => {
      e.preventDefault()
      console.log(e.target.name.value)
      const name = e.target.name.value;
      const address = e.target.address.value;
      const description = e.target.description.value;
      const phone = e.target.phone.value;
      const site = e.target.site.value;
      const owner = decode.id;
      const schedule = e.target.schedule.value;
      const capacityOnTable = e.target.capacityOnTable.value;
      let restaurant = {
          name,
          address,
          description,
          phone,
          site,
          owner,
          schedule,
          capacityOnTable,
      }


      try {
        const response = await api.post("/restaurant/", restaurant);
        setResponse(response.data.response);
        navigate('/')
      } catch (error) {
        console.log(error);
        setResponse(error);
      }
  }


  return (
      <div className='dashboard'>
          <form onSubmit={handleSubmit}>
              <p>
                  <label>Название:</label>
                  <input
                      type="name"
                      name="name"
                      required/>
              </p>
              <p>
                  <label>Адрес:</label>
                  <input
                      type="address"
                      name="address"
                      required/>
              </p>
              <p>
                  <label>Телефон:</label>
                  <input
                      type="phone"
                      name="phone"
                      required/>
              </p>
              <p>
                  <label>Сайт:</label>
                  <input
                      type="site"
                      name="site"
                      required/>
              </p>
              <p>
                  <label>Описание:</label>
                  <input
                      type="description"
                      name="description"
                      required/>
              </p>
              <p>
                  <label>Расписание:</label>
                  <input
                      type="schedule"
                      name="schedule"
                      required/>
              </p>
              <p>
                  <label>Максимальное количество мест:</label>
                  <input
                      type="number"
                      name="capacityOnTable"
                      required/>
              </p>
                  <div className='btn-container'>
                      <button type='submit'>Добавить ресторан</button>
                  </div>
          </form>
      </div>
  )
}

export default AddRestaurant;