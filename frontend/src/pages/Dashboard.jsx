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
  let username = decode.username;
  let email = decode.email;
  let full_name = decode.full_name;
  let avatar = decode.avatar;
  

  useEffect(() => {
      const getAvatar = async () => {
        const response = await api.get("/user/" + user_id + "/");
        setResponse(response.data.response);
        setAvatarURL(response.data.avatar);
      };
      if (avatar !== "") {
          getAvatar().catch((error) => {
             console.log(error);
             setAvatarURL(DefaultImage);
             setResponse(error);
        });
      }
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

          <p>Welcome, {full_name}</p>
          <span>Your Cridentials are as follows</span>
          <br/>
          <span>Email: {email}</span>
          <br/>
          <span>UserID: {user_id}</span>
          <br/>
          <span>{response}</span>
          <br/><br/>
          <Link to="/">Home</Link>
          <br/>
          <Link onClick={logoutUser}>Logout</Link>

      </div>
  )
}

export default Dashboard