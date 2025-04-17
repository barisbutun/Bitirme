import{getAuthHeaders} from "../../utils/auth"

const API_BASE_URL = "http://localhost:8082/api";
//ürünleri çekme
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



export const fetchProductById=async(id)=>{
  const response=await fetch(`http://localhost:8082/api/product/v1/${id}`);
  if(!response.ok){
    throw new Error("ürün getirilemedi");
  }
  return await response.json();
}

export const fetchFilteredProducts = async (filters) => {
  try {
    const response = await fetch(
      `http://localhost:8082/api/product/v1/filter?name=${filters.name}&category=${filters.category}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Filtrelenmiş ürünler alınamadı", error);
  }
};


export const fetchFilteredProductsWithImages = async (filters) => {
  try {
    const filteredProducts = await fetchFilteredProducts(filters);

    const productsWithImages = await Promise.all(
      filteredProducts.map(async (product) => {
        const images = await fetchProductImages(product.id);
        return {
          ...product,
          images,
        };
      })
    );

    return productsWithImages;
  } catch (error) {
    console.error("Filtrelenmiş ürün + resim verileri alınamadı", error);
    return [];
  }
};

export const ProductCategories = async () => {
  
  const response = await fetch("http://localhost:8082/api/categories/v1", {
    method: "GET",
    headers:{
      'Content-Type':'application/json',
    },
  });
  if (!response.ok) {
    throw new Error("Kategori bilgileri çekilirken bir hata oluştu.");
  }
  return response.json();
};