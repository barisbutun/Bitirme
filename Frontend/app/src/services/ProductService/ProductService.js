//ürünleri çekme

const API_BASE_URL = "http://localhost:8082/api";

export const fetchProducts = async () => {
  try { 
    const response = await fetch(`${API_BASE_URL}/product/v1/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Ürün bilgileri alınamadı");
    }

    const products = await response.json();
    console.log("API'den gelen ürün verisi:", products);// api den gelen verileri kontrol etmek için
  // categoryId'yi category_id'ye dönüştür
  const formattedProducts = products.map(product => ({
    ...product,
    category_id: product.category_id ,// Backend'den gelen categoryId'yi frontend'in beklediği formata dönüştür
  }));
  console.log("Format sonrası ürünler:", formattedProducts); // Debug log 2
  return formattedProducts;
} catch (error) {
    console.error("fetchProducts Error:", error);
    throw error;
  }
};

export const fetchProductImages = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/image/v1/infos/${productId}`, {
      method: "GET"
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