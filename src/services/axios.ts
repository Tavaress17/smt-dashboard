// src/services/axios.ts

import axios from "axios";

const axiosService = axios.create({
  baseURL: "http://localhost/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const updateAxiosServiceToken = (token: string) => {
    axiosService.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export { axiosService };