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
      console.log(e.target.address.value)
      const name = e.target.name.value;
      const address = e.target.address.value;
      const description = e.target.description.value;
      const phone = e.target.phone.value;
      const site = e.target.site.value;
      const owner = decode.id;
      const schedule = e.target.schedule.value;
      const capacityOnTable = e.target.capacityOnTable.value;
      const logo = e.target.logo.value;
      const preview = e.target.preview.value;
      console.log(decode)
      setRestaurant({
          name,
          address,
          description,
          phone,
          site,
          owner,
          schedule,
          capacityOnTable,
          //logo,
          //preview
      })


      try {
        const response = await api.post("/restaurant/", restaurant);
        setResponse(response.data.response);
        navigate('/home')
      } catch (error) {
        console.log(error);
        setResponse(error);
      }
  }


  return (
      <div className='dashboard'>
          <form onSubmit={handleSubmit}>

              <label>Name:</label>
              <input
                  type="name"
                  name="name"
                  required/>

              <label>Address:</label>
              <input
                  type="address"
                  name="address"
                  required/>

              <label>Phone:</label>
              <input
                  type="phone"
                  name="phone"
                  required/>

              <label>Site:</label>
              <input
                  type="site"
                  name="site"
                  required/>

              <label>Description:</label>
              <input
                  type="description"
                  name="description"
                  required/>

              <label>Schedule:</label>
              <input
                  type="schedule"
                  name="schedule"
                  required/>

              <label>CapacityOnTable:</label>
              <input
                  type="number"
                  name="capacityOnTable"
                  required/>

              <label>Logo:</label>
              <input
                  type="logo"
                  name="logo"
                  />

              <label>Preview:</label>
              <input
                  type="preview"
                  name="preview"
                  />


              <div className='btn-container'>
                  <button type='submit'>Добавить ресторан</button>
              </div>
          </form>
      </div>
  )
}

export default AddRestaurant;