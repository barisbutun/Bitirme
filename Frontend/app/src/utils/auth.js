import {jwtDecode} from "jwt-decode"; // Doğru import şekli

export const decodeToken = (token) => {
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.roles;
    } catch (error) {
      console.error("Token'ı çözümleme sırasında hata:", error);
    }
  }
  return null;
};
