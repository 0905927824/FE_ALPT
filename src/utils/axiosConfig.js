import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/', // Thay đổi thành URL API của bạn
  timeout: 10000,
});

export default axiosInstance;