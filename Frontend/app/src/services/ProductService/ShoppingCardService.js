import { getUserIdFromToken, getToken } from "../../utils/auth";

const API_BASE_URL = "http://localhost:8082/api/shoppingCartItem/v1";

// Sepete ürün ekleme
export const addToCart = async (productData) => {
  try {
    const token = getToken();
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      throw new Error("Kullanıcı girişi yapılmamış. Lütfen giriş yapın.");
    }

    if (productData.quantity <= 0) {
      throw new Error("Adet 1 veya daha büyük olmalıdır.");
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        product_id: productData.productId,  // Ürün ID'si
        quantity: productData.quantity,     // Sepetteki ürün adedi
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token ile kimlik doğrulaması
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sepete ekleme işlemi başarısız oldu.");
    }

    return response.json();  // Başarılı olduğunda dönen veriyi döndür
  } catch (error) {
    console.error("Sepete eklerken hata oluştu:", error);
    throw error;
  }
};


// Sepetten ürün silme
export const removeFromCart = async (id) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("Kullanıcı girişi yapılmamış. Lütfen giriş yapın.");
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, { // Backend'deki UUID id'yi kullanıyoruz
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Token ile kimlik doğrulaması
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sepetten çıkarma hatası!");
    }
  } catch (error) {
    console.error("Sepetten çıkarma hatası:", error);
    throw error;
  }
};

// Kullanıcıya ait tüm ürünleri sepetten silme
export const clearCartByUserId = async () => {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("Kullanıcı girişi yapılmamış. Lütfen giriş yapın.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Token ile kimlik doğrulaması
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tüm ürünleri temizleme hatası!");
    }
  } catch (error) {
    console.error("Tüm ürünleri temizleme hatası:", error);
    throw error;
  }
};

// Sepetteki tüm ürünleri getirme
export const getCartByUserId = async () => {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("Kullanıcı girişi yapılmamış. Lütfen giriş yapın.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user`, { // Backend'e sadece token ile gidiyoruz
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Token ile kimlik doğrulaması
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sepet verisini alma hatası!");
    }

    const data = await response.json(); // Sepet verisini JSON formatında al
    return data; // Sepet verilerini döndür
  } catch (error) {
    console.error("Sepet verisi alma hatası:", error);
    throw error;
  }
};
