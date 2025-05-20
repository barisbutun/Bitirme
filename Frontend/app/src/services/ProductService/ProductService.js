import{getAuthHeaders} from "../../utils/auth"

const API_BASE_URL = "http://localhost:8082/api";

export const fetchAllProducts = async (page = 0, size = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/v1/home?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Ürünler getirilemedi.");
    }

    const data = await response.json();
    const products = data.content || [];

    // ✅ totalElements artık doğru yerden alınıyor
    const total = data.page?.totalElements ?? products.length;

    return { products, total };
  } catch (error) {
    console.error("fetchAllProducts Error:", error);
    throw error;
  }
};


//ürünleri çekme
export const fetchProducts = async (page = 0, size = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/v1/home?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // throw new Error("Ürün bilgileri alınamadı");
    }

    const data = await response.json();

  
    const totalElements = data.totalElements||data.content.length; 
    const formattedProducts = data.content.map(product => ({
      ...product,
      category_id: product.category_id,
    }));

    return {
      content: formattedProducts,
      totalElements:totalElements, 
    };
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
    const queryParams = new URLSearchParams();

    // Sayfalama ve sıralama
    queryParams.append("page", filters.page ?? 0);
    queryParams.append("size", filters.size ?? 12);
    queryParams.append("sortBy", filters.sortBy ?? "asc");

    // Fiyat aralığı
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      queryParams.append("minPrice", filters.minPrice);
    }

    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      queryParams.append("maxPrice", filters.maxPrice);
    }

    // Kategoriler (çoklu)
    if (filters.category && filters.category.length > 0) {
      filters.category.forEach((cat) => queryParams.append("category", cat));
    }

    const response = await fetch(
      `http://localhost:8082/api/product/v1/filter?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Filtrelenmiş ürünler alınamadı");
    }

    const data = await response.json();
    return data.content; 
  } catch (error) {
    console.error("Filtrelenmiş ürünler alınamadı", error);
    throw error;
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