import { notification } from "antd";
import { getUserIdFromToken } from "../../utils/auth";
import { fetchProductImages } from "./ProductService";

const API_BASE_URL = "http://localhost:8082/api/favourite";

// Favori Bilgilerini Çekme
export const fetchFavorites = async () => {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  if (!userId) {
    console.error("Kullanıcı ID'si bulunamadı.");
    return [];
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
      throw new Error(`API Hatası: ${response.status}`);
    }

    const favoriteProducts = await response.json();
    console.log("Backend'den dönen favoriler:", favoriteProducts);

    // Her favori ürün için resim bilgisini çek
    const favoritesWithImages = await Promise.all(
      favoriteProducts.map(async (favorite) => {
        try {
          const images = await fetchProductImages(favorite.product_id);
          return {
            ...favorite,
            favoriteId: favorite.id, // Favori ID'sini ayrı bir field olarak saklayalım
            image1: images?.[0] || null,
          };
        } catch (error) {
          console.error(`Ürün ${favorite.product_id} için resim çekilemedi:`, error);
          return {
            ...favorite,
            image1: null,
          };
        }
      })
    );

    console.log("Resimlerle birlikte favoriler:", favoritesWithImages);
    return favoritesWithImages;
  } catch (error) {
    console.error("Favori ürünler çekilirken hata oluştu:", error);
    return [];
  }
};

// Favori Ekleme
export const addFavorite = async (product) => {
  const token = localStorage.getItem("token");
  if (!token) {
    notification.info({
      message: "Giriş Yapın",
      description: "Favori eklemek için giriş yapmalısınız.",
      placement: "topRight",
    });
    return false;
  }

  const favoriteData = {
    product_id: Number(product.id),
    category_id: Number(product.categoryId || product.category_id),
    price: Number(product.price),
    name: product.name
  };

  console.log('Backende gönderilen veri:', favoriteData);

  try {
    const response = await fetch(`${API_BASE_URL}/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(favoriteData),
    });

    const data = await response.json();

    if (response.ok) {
      notification.success({
        message: "Favori Eklendi",
        description: "Ürün favorilere başarıyla eklendi.",
        placement: "topRight",
      });
      return true;
    } else {
      if (data.status === "BAD_REQUEST" && data.message === "Product exist in this system") {
        notification.info({
          message: "Bilgi",
          description: "Bu ürün zaten favorilerinizde bulunuyor.",
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Hata",
          description: data.message || "Favori eklenirken bir hata oluştu.",
          placement: "topRight",
        });
      }
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
      description: "Geçerli bir ürün ID'si bulunamadı.",
      placement: "topRight",
    });
    return false;
  }

  try {
    console.log("Silinecek ürün ID:", productId);

    const response = await fetch(
      `${API_BASE_URL}/v1/${Number(productId)}?page=1&size=10`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      notification.success({
        message: "Favori Silindi",
        description: "Ürün favorilerden başarıyla çıkarıldı.",
        placement: "topRight",
      });
      return true;
    } else {
      const errorData = await response.json();
      console.error("Backend hatası:", errorData);
      
      notification.error({
        message: "Hata",
        description: errorData.message || "Favori silinirken bir sorun oluştu.",
        placement: "topRight",
      });
      return false;
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