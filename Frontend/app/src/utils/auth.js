// auth.js ( auth yardımcı dosyası)
// JWT token çözümleyip rol bilgisi almayı sağlar

import {jwtDecode} from "jwt-decode";

export const getRoleFromToken = () => {
  const token = localStorage.getItem("token"); // Token'ı localStorage'dan alın
  if (token) {
    const decodedToken = jwtDecode(token); // Token'i çözümle
    return decodedToken.role; // Rol bilgisini döner
  }
  return null;
};
