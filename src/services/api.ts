import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // ajuste se necessário
});

// Adiciona o token automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
