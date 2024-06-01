import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/";

const useAxios = () => {
    const {authTokens, setUser, setAuthTokens } = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization : `Bearer ${authTokens?.access}`
        }
    })

    axiosInstance.interceptors.request.use(
        async req => {
            const user = jwtDecode(authTokens.access)
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
            if (!isExpired) return req;
            const response = await axios.post(`${baseURL}api/token/refresh/`, {
                refresh: authTokens.refresh
            });
            console.log(user)
            let tokens = {
                refresh: authTokens.refresh,
                access: response.data.access
            }
            console.log(tokens)
            localStorage.setItem("authTokens", JSON.stringify(tokens));
            setAuthTokens(tokens);
            setUser(jwtDecode(tokens.access));

            req.headers.Authorization = `Bearer ${tokens.access}`

            return req;
        }
    )

    return axiosInstance
}

export default useAxios;