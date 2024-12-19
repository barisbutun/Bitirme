import { getUserIdFromToken } from "../../utils/auth";
import { getToken } from "../../utils/auth";
const API_BASE_URL = "http://localhost:8082/api/shoppingCartItem/v1";

// Sepete ürün ekleme 
export const addToCart = async (productData) => {
  try {
    const token = getToken();  
    const userId = getUserIdFromToken();  

    if (!token || !userId) {
      throw new Error('Kullanıcı girişi yapılmamış. Lütfen giriş yapın.');
    }

    // Sepete ekleme API'sine post işlemi
    const response = await fetch(`http://localhost:8082/api/shoppingCartItem/v1`, {
      method: 'POST',
      body: JSON.stringify({
        product_id:2,  
        quantity: productData.quantity  
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  
      },
    });

    if (!response.ok) {
      throw new Error('Sepete ekleme işlemi başarısız oldu');
    }
console.log("ürün bilgileri:",productData);
    return response.json();  // Başarılı olduğunda dönen veriyi döndür
  } catch (error) {
    console.error('Sepete eklerken hata oluştu:', error);
    throw error;
  }
};

// Sepetten ürün silme
export const removeFromCart = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Sepetten çıkarma hatası!");
      }
    } catch (error) {
      console.error("Sepetten çıkarma hatası:", error);
      throw error;
    }
  };
  
// Kullanıcıya ait tüm ürünleri sepetten silme
export const clearCartByUserId = async () => {
    const userId = getUserIdFromToken(); // Token'dan userId al
    if (!userId) {
      throw new Error("Kullanıcı ID'si bulunamadı. Lütfen giriş yapın.");
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Tüm ürünleri temizleme hatası!");
      }
    } catch (error) {
      console.error("Tüm ürünleri temizleme hatası:", error);
      throw error;
    }
  };
  
// Sepetteki tüm ürünleri getirme
export const getCartByUserId = async () => {
    const userId = getUserIdFromToken(); // Token'dan userId al
    if (!userId) {
      throw new Error("Kullanıcı ID'si bulunamadı. Lütfen giriş yapın.");
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error("Sepet verisini alma hatası!");
      }
  
      const data = await response.json(); // Sepet verisini JSON formatında al
      return data; // Sepet verilerini döndür
    } catch (error) {
      console.error("Sepet verisi alma hatası:", error);
      throw error;
    }
  };
  