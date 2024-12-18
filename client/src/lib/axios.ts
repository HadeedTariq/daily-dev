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

export { authApi, profileApi };
