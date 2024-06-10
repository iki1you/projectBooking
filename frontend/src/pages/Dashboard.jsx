import React, {useState, useContext, useEffect, useRef} from 'react'
import DefaultImage from "../assets/default-picture.png";
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import baseURL from '../config';


const Dashboard = () => {
  const [response, setResponse] = useState("");
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const {logoutUser} = useContext(AuthContext);

  const [avatarURL, setAvatarURL] = useState(DefaultImage);
  const fileUploadRef = useRef(null);
  
  const decode = jwtDecode(token);
  // console.log(decode)
  let user_id = decode.user_id;
  let email = decode.email;

  const [fullName, setFullName] = useState(decode.fullName);
  const [birthDate, setBirthDate] = useState(decode.birth_date);
  const [phoneNumber, setPhoneNumber] = useState(decode.phone_number);
  

  useEffect(() => {
      const getAvatar = async () => {
        const response = await api.get("/user/" + user_id + "/");
        setResponse(response.data.response);
        setFullName(response.data.full_name);
        setBirthDate(response.data.birth_date);
        setPhoneNumber(response.data.phone_number);

        if (response.data.avatar) {
            setAvatarURL(response.data.avatar);
        }
      };
      getAvatar().catch((error) => {
             console.log(error);
             setAvatarURL(DefaultImage);
             setResponse(error);
        });
  }, [])

  const handleImageUpload = (e) => {
    e.preventDefault();
    fileUploadRef.current.click();
  }

  const uploadImageDisplay = async () => {
    try {
      const uploadedFile = fileUploadRef.current.files[0];

      const formData = new FormData();
      formData.append("avatar", uploadedFile);

      const uploadImage = async () => {
        const response = await api.patch("/user/" + user_id + "/", formData);
        setResponse(response.data.response);
        setAvatarURL(response.data.avatar);
      };

      await uploadImage();


    } catch(error) {
      console.error(error);
      setAvatarURL(DefaultImage);
    }
  }

  const handleSubmit = (e) => {
        e.preventDefault()

        const postForm = async () => {
            const response = await api.patch("/user/" + user_id + "/", {
                full_name: fullName,
                birth_date: birthDate,
                phone_number: phoneNumber
            });
        }

        postForm().catch((error) => {
                console.log(error);
            });
    }
  

  return (
      <div className='dashboard'>

          <h1>Dashboard</h1>
          <img src={avatarURL} alt="Avatar" className="h-96 w-96 rounded-full" width="200" height="200" />
          <form encType='multipart/form-data'>
              <button type='submit' onClick={handleImageUpload}>
                  Загрузить
              </button>
              <input type="file" id="file" ref={fileUploadRef} onChange={uploadImageDisplay} hidden/>
          </form>

          <br/>
          <span>Email: {email}</span>
          <br/>
          <span>UserID: {user_id}</span>
          <br/>
          <form onSubmit={handleSubmit}>
              <p><label htmlFor="date">Имя: </label>
                  <input type="name" id="name" name="name" value={fullName}
                         onChange={e => setFullName(e.target.value)}/></p>

              <p><label htmlFor="phone">Телефон: </label>
                  <input type="phone" id="phone" name="phone" value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}/></p>

              <p><label htmlFor="date">Дата рождения: </label>
                  <input type="date" id="date" name="date" value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}/></p>

              <p>Согласие на обработку данных: <input type="checkbox" required/></p>

              <button type="submit">Изменить</button>
          </form>
          <Link to="/">Главная</Link>
          <br/>
          <Link onClick={logoutUser}>Выйти</Link>

      </div>
  )
}

export default Dashboard