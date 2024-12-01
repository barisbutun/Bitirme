import { jwtDecode } from "jwt-decode"; // jwt-decode kütüphanesini import ediyoruz

// Token'dan rolleri çözümleyen fonksiyon
export const decodeToken = (token) => {
  if (token) {
    try {
      const decodedToken = jwtDecode(token);  // Token'ı decode ediyoruz
      console.log("decoded token:",decodedToken);
      return decodedToken.roles;  // Kullanıcı rolleri döndürülüyor
    } catch (error) {
      console.error("Token'ı çözümleme sırasında hata:", error);
    }
  }
  return null;  // Token yoksa null döndürülür
};

// Token'dan userId'yi almak için fonksiyon
// export const getUserIdFromToken = () => {
//   const token = localStorage.getItem("token");  // Token'ı localStorage'dan alıyoruz
//   if (!token) {
//     return null;  // Token yoksa null döndürüyoruz
//   }

//   try {
//     const decodedToken = jwtDecode(token);  // Token'ı decode ediyoruz
//     return decodedToken.userId;  // UserId'yi döndürüyoruz
  
//   } catch (error) {
//     console.error("Token decode hatası:", error);
//     return null;  // Hata durumunda null döndürüyoruz
//   }
// };
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");  // Token'ı localStorage'dan alıyoruz
  if (!token) {
    console.warn("Token bulunamadı.");  // Token yoksa uyarı ver
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);  // Token'ı decode ediyoruz
    console.log("Çözümlenmiş Token:", decodedToken);  // Çözümlenmiş tokenın tamamını yazdır
    console.log("Kullanıcı ID:", decodedToken.userId);  // Kullanıcı ID'yi yazdır
    return decodedToken.userId;  // UserId'yi döndürüyoruz
  } catch (error) {
    console.error("Token decode hatası:", error.message);  // Hata varsa mesajını yazdır
    return null;
  }
};
