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
 
export const getUserIdFromToken=()=>{
  const token=localStorage.getItem("token");
  if(!token)
    return null;//token yoksa null döner
  const decodedToken=jwtDecode(token);
  return decodedToken.userId;
}