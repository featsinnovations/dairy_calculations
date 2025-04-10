import axios from "axios";

const api = axios.create({
  baseURL: "https://dairy-app-backend-3z13.onrender.com/",
  // baseURL: "http://localhost:8000/",
  timeout: 30000,
});


export default api;
