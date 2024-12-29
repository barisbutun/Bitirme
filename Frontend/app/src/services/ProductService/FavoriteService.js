import { notification } from "antd";
import { getUserIdFromToken } from "../../utils/auth";

const API_BASE_URL = "http://localhost:8082/api/favourite/v1";


// Favori Ekleme
export const addFavorite = async (product) => {
    const token = localStorage.getItem("token");
    if(!token){
  notification.info({
        message: "Giriş Yapın",
        description: "Favori eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
       
      return;
    }
    const userId = getUserIdFromToken(token);
    if (!userId) {
      throw new Error("Geçersiz token.");
    }
  
    // Ürün bilgilerini içeren favori verisi oluştur
    const favoriteData = {
      product_id: product.id, 
      category_id:product.category_id
    };
  
    try {
      const response = await fetch(`http://localhost:8082/api/favourite/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favoriteData), // Tüm favori verisini gönder
      });
  
      if (response.ok) {
        notification.success({
          message: "Favorilere Eklendi",
          description: "Ürün favorilerinize başarıyla eklendi.",
          placement: "topRight",
        });
      } else {
        const errorData = await response.json();
        console.error("Favori eklerken hata:", errorData);
        notification.error({
          message: "Favori Eklenemedi",
          description: "Bir hata oluştu, lütfen tekrar deneyin.",
        });
      }
    } catch (error) {
      console.error("Favori eklerken hata:", error);
      notification.error({
        message: "Bağlantı Hatası",
        description: "Sunucuyla bağlantı kurulurken bir hata oluştu.",
        placement: "topRight",
      });
    }
  };
  
// Favori Silme
export const removeFavorite = async (id) => {
  const token=localStorage.getItem("token");

    if (!token) {
      throw new Error("Giriş yapmalısınız");
    }
  
   try{
    const response=await fetch(`${API_BASE_URL}/${id}`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Favoriden çıkarma sırasında bir hata oluştu.");
    }

    return true; // Favori silme başarılıysa true döndür
  } catch (error) {
    throw new Error(error.message || "Bir hata oluştu.");
  }
};
   
// Favori Bilgilerini Çekme
export const fetchFavorites = async (setFavoriteProducts) => {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  if (!userId) {
    console.error("Kullanıcı ID'si bulunamadı.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/getAllUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        const data = await response.json();
      console.log("Backend'den dönen favoriler:", data);
      throw new Error(`API Hatası: ${response.status}`);
    }

    const favoriteProducts = await response.json();
    setFavoriteProducts(favoriteProducts);
  } catch (error) {
    console.error("Favori ürünler çekilirken hata oluştu:", error);
  }
};
