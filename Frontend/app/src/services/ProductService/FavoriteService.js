import { notification } from "antd";
import { getUserIdFromToken } from "../../utils/auth";

const API_BASE_URL = "http://localhost:8082/api/favourite/v1";


// Favori Ekleme
export const addFavorite = async (product, navigate) => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);
  
    if (!userId) {
      notification.info({
        message: "Giriş Yapın",
        description: "Favori eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
      navigate("/Login");
      return;
    }
  
    // Ürün bilgilerini içeren favori verisi oluştur
    const favoriteData = {
      userId,
      productId: product.id, 
      productName: product.name, 
      productPrice: product.price, 
      productImage: product.image1, 
      productStock: product.stock, 
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}`, {
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
export const removeFavorite = (id, setFavoriteProducts) => {
    if (!id) {
      console.error("Favori ID değeri bulunamadı!");
      return;
    }
  
    // Favoriden çıkarma isteği gönder
    fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Favoriden çıkarılamadı.");
        // Favoriler listesini güncelle
        setFavoriteProducts((prevFavorites) =>
          prevFavorites.filter((product) => product.id !== id)
        );
      })
      .catch((error) => console.error("Hata:", error.message));
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
    const response = await fetch(`${API_BASE_URL}/?userId=${userId}`, {
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
