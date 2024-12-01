import { getUserIdFromToken } from "../../utils/auth";

const API_BASE_URL = "http://localhost:8082/api/shoppingCartItem/v1"; // Backend'inizin URL'si

// Sepete ürün ekleme
export const addToCart = async (productId, quantity) => {
    const userId = getUserIdFromToken(); // Token'dan userId al
    if (!userId) {
      throw new Error("Kullanıcı ID'si bulunamadı. Lütfen giriş yapın.");
    }
  
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: { id: productId }, // DTO yapısına uygun
          quantity,                     // Direkt miktar
          user_id: { id: userId },      // DTO yapısına uygun
        }),
      });
  
      if (!response.ok) {
        throw new Error("Sepete ekleme hatası!");
      }
  
      const data = await response.json();
      return data; // Sepete eklenen ürün verisini döndür
    } catch (error) {
      console.error("Sepete ekleme hatası:", error);
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
  