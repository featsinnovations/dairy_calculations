import axios from "axios";

const api = axios.create({
  baseURL: "https://dairy-app-backend-3z13.onrender.com/",
  timeout: 10000,
});


export default api;
