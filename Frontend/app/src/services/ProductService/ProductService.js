import { notification } from "antd";

// Ürünleri getirme
export const fetchProducts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/product', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Veri çekme hatası');
  }

  return response.json();
};

// Ürün favorilere ekleme
export const addToFavorites = async (productId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch('/api/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) throw new Error("Favorilere ekleme hatası");

    notification.success({
      message: "Favorilere Eklendi",
      description: "Ürün başarıyla favorilere eklendi!",
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    notification.error({
      message: "Favorilere Eklenemedi",
      description: "Bir hata oluştu, lütfen tekrar deneyin.",
    });
  }
};

// Ürünü favorilerden çıkarma
export const removeToFavorites = async (productId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`/api/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log('Product removed from cart');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

// Sepete ürün ekleme
export const addToCart = async (productId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/api/cart", {
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

// Sepetten ürün çıkarma
export const removeFromCart = async (productId, data, setData) => {
  const token = localStorage.getItem("token");
  try {
    const updatedCart = data.filter((item) => item.id !== productId);
    setData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const response = await fetch(`/api/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error("Sepetten çıkarma hatası");

    notification.warning({
      message: "Sepetten Çıkarıldı",
      description: "Ürün başarıyla sepetten çıkarıldı!",
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    notification.error({
      message: "Ürün Çıkarılamadı",
      description: "Bir hata oluştu, lütfen tekrar deneyin.",
    });
  }
};
