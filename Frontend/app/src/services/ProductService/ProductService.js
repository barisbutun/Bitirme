import { notification } from "antd";
import { getUserIdFromToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

//ürünleri çekme

const API_BASE_URL = "http://localhost:8082/api";

export const fetchProducts = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/v1/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ürün bilgileri alınamadı");
    }

    const products = await response.json();
    console.log("API'den gelen ürün verisi:", products);
    return products;
  } catch (error) {
    console.error("fetchProducts Error:", error);
    throw error;
  }
};

export const fetchProductImages = async (productId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/image/v1/infos/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Resim alınamadı: ${productId}`);
    }

    const images = await response.json();
    return images.map((base64) => `data:image/jpeg;base64,${base64}`);
  } catch (error) {
    console.error("fetchProductImages Error:", error);
    throw error;
  }
};

// Ürün favorilere ekleme

export const addToFavorites = async (id, navigate) => {
  const userId = getUserIdFromToken(); // Token'dan kullanıcı ID'sini al

  if (!userId) {
    notification.info({
      message: "Giriş Yapın",
      description: "Favori eklemek için giriş yapmalısınız.",
      placement: "topRight",
    });
    navigate("/Login"); 
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/favourite/v1?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: id }), // Göndermek istediğimiz veriyi JSON olarak stringify ediyoruz
    });

    if (response.ok) {
      const data = await response.json();
      notification.success({
        message: "Favorilere Eklendi",
        description: "Ürün favorilerinize başarıyla eklendi.",
        placement: "topRight",
      });
    } else {
      const errorData = await response.json();
      console.error("Favori eklerken hata:", errorData);
    }
  } catch (error) {
    console.error("Favori eklerken hata:", error);
  }
};


// Sepete ürün ekleme
export const addToCart = async (productId, navigate) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    
    if (!response.ok) throw new Error("Sepete ekleme hatası");

    notification.success({
      message: "Sepete Eklendi",
      description: "Ürün başarıyla sepete eklendi!",
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    notification.error({
      message: "Sepete Eklenemedi",
      description: "Bir hata oluştu, lütfen tekrar deneyin.",
    });
  }
};
