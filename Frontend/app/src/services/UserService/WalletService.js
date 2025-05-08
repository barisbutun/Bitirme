import axios from "axios";

const API = "http://localhost:8080/api"; // Backend base URL

export const loadBalance = (data) => {
  return axios.post(`${API}/v1/loadBalance`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updateBalance = (data) => {
  return axios.put(`${API}/v1/balance`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getUserBalance = async () => {
  // Eğer kullanıcı bilgilerini JWT'den almıyorsan ayrı bir endpoint düşünülmeli.
  // Şimdilik mock veri döndürelim:
  return {
    balance: 500, // Örnek bakiye
  };
};
