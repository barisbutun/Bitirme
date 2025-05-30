import { getAuthHeaders } from "../../utils/auth";

export const getReviewCount = async (productId) => {
  const response = await fetch(`http://localhost:8082/api/product/${productId}/reviews/count`);
  if (!response.ok) throw new Error("Yorum sayısı alınamadı");
  return await response.json();
};

export const submitReview = async (reviewData) => {
  try {
    const response = await fetch(`http://localhost:8082/review/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error("Değerlendirme gönderilemedi");
    }

    return await response.json();
  } catch (error) {
    console.error("Değerlendirme gönderilemedi", error);
    throw error;
  }
};

//kayıtlı değerlendirmeyi gösterme

export const getUserReview = async (productId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `http://localhost:8082/review/v1/user?productId=${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Kullanıcı değerlendirmesi alınamadı");
    }

    return await response.json();
  } catch (error) {
    console.error("Kullanıcı değerlendirmesi alınamadı", error);
    return null;
  }
};
  
