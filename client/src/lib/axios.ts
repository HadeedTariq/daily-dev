import axios from "axios";
let url = import.meta.env.VITE_BACKEND_URL;

const authApi = axios.create({
  baseURL: `${url}/auth`,
  withCredentials: true,
});
const profileApi = axios.create({
  baseURL: `${url}/profile`,
  withCredentials: true,
});
const postApi = axios.create({
  baseURL: `${url}/posts`,
  withCredentials: true,
});
const squadApi = axios.create({
  baseURL: `${url}/squad`,
  withCredentials: true,
});

export { authApi, profileApi, postApi, squadApi };
