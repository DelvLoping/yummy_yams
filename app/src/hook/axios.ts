import axios, { AxiosRequestConfig } from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants/api";

const useAxios = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customAxios = async (config: AxiosRequestConfig) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers = {
        Authorization: jwt,
      };
    }

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log("error", error);
        if (
          error.response &&
          (error.response.status === 403 || error.response.status === 401)
        ) {
          console.log("response", error);
          localStorage.removeItem("jwt");
          dispatch(logout());
          navigate("/");
        }
        return Promise.reject(error);
      }
    );
    config.baseURL = API_URL;
    return axios(config);
  };
  return { customAxios };
};
export default useAxios;
