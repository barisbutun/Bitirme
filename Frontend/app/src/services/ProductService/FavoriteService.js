import { notification } from "antd";
import { getUserIdFromToken } from "../../utils/auth";

const API_BASE_URL = "http://localhost:8082/api/favourite";

// Favori Ekleme
export const addFavorite = async (product) => {
  const token = localStorage.getItem("token");
  if (!token) { 
    notification.info({
      message: "Giriş Yapın",
      description: "Favori eklemek için giriş yapmalısınız.",
      placement: "topRight",
    });
    return false; // Başarısız durumu döndür
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    throw new Error("Geçersiz token.");
  }
// Hem categoryId hem de category_id'yi kontrol et
const categoryId = product.categoryId || product.category_id;
  
if (!categoryId) {
  console.error('Category ID eksik:', product);
  notification.error({
    message: "Hata",
    description: "Kategori bilgisi eksik.",
    placement: "topRight",
  });
  return false;
}
  const favoriteData = {
    product_id: product.id,
    category_id: categoryId,

  };

  console.log('Backende gönderilen veri:', favoriteData);

  try {
    const response = await fetch(`${API_BASE_URL}/v1/getAllByUserId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(favoriteData),
    });

    if (response.ok) {
      // İşlem başarılıysa local storage'deki favoriyi temizle
      localStorage.removeItem("pendingFavorite");
      notification.success({
        message: "Favori Eklendi",
        description: "Ürün favorilere başarıyla eklendi.",
        placement: "topRight",
      });
      return true;
    } else {
      const errorData = await response.json();
      console.error("Favori eklerken hata:", errorData);
      notification.error({
        message: "Favori Eklenemedi",
        description: "Bir hata oluştu, lütfen tekrar deneyin.",
        placement: "topRight",
      });
      return false;
    }
  } catch (error) {
    console.error("Favori eklerken hata:", error);
    notification.error({
      message: "Bağlantı Hatası",
      description: "Sunucuyla bağlantı kurulurken bir hata oluştu.",
      placement: "topRight",
    });
    return false;
  }
};

// Favori Silme
export const removeFavorite = async (productId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    notification.error({
      message: "Hata",
      description: "Favori silmek için giriş yapmalısınız.",
      placement: "topRight",
    });
    return false;
  }
  if (!productId) {
    notification.error({
      message: "Hata",
      description: "Geçersiz ürün ID'si",
      placement: "topRight",
    });
    return false;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/v1/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      notification.success({
        message: "Favori Silindi",
        description: "Ürün favorilerden başarıyla çıkarıldı.",
        placement: "topRight",
      });
      return true;
    } else {
      throw new Error("Favoriden çıkarma sırasında bir hata oluştu.");
    }
  } catch (error) {
    console.error("Favori silme hatası:", error);
    notification.error({
      message: "Hata",
      description: "Favori silinirken bir sorun oluştu.",
      placement: "topRight",
    });
    return false;
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
    const response = await fetch(`${API_BASE_URL}/v1/getAllByUserId`, {
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