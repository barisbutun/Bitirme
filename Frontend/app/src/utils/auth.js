import { jwtDecode } from "jwt-decode";

export const decodeToken = () => {
  const token = localStorage.getItem("token"); // Token'ı localStorage'dan alın
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Token'i çözümle
      return decodedToken.roles; // Rol bilgilerini döner
    } catch (error) {
      console.error("Token'ı çözümleme sırasında hata:", error);
    }
  }
  return null; // Token yoksa veya hata varsa null döner
};