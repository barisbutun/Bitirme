
import { getToken } from "../../utils/auth";

// Tüm siparişleri getir
export const fetchAllOrders = async (page = 0, size = 100) => {
  const response = await fetch(`http://localhost:8082/api/order/v1?page=${page}&size=${size}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Siparişler alınamadı.");
  }

  const data = await response.json();
  return {
    content: data.content,          // sipariş listesi
    totalElements: data.totalElements, // toplam sipariş sayısı
    totalPages: data.totalPages,
    currentPage: data.number,
  };
};

// Sipariş oluşturma
export const createOrder = async (orderData) => {
  const response = await fetch("http://localhost:8082/api/order/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error( "Sipariş oluşturulamadı.");
  }

  return response.json();
};

//Belirli Siparişin Ürünleri(Kullanıcıya Özel)
export const getOrderItemsByUser= async () => {
  const response = await fetch(` http://localhost:8082/api/order/v1`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) throw new Error("Sipariş ürünleri getirilemedi.");
  return await response.json();
};


//Sipariş Güncelleme
export const updateOrder = async (id, updatedData) => {
    const response = await fetch(`http://localhost:8082/api/order/v1/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error("Sipariş güncellenemedi.");
    return await response.json();
  };
  
// Sipariş Silme
export const deleteOrder = async (id) => {
    const response = await fetch(`http://localhost:8082/api/order/v1/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error("Sipariş silinemedi.");
  };
  
// Siparişteki Ürünlerin Özeti
export const getOrderItemSummary = async (orderId) => {
    const response = await fetch(`http://localhost:8082/api/order/v1/orderItem/${orderId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error("Sipariş ürün bilgisi alınamadı.");
    return await response.json();
  };
  

// Kullanıcı ID'sine göre siparişleri filtrele
// export const fetchOrdersByUserId = async (orderId) => {
//   const response = await fetch(
//     `http://localhost:8082/api/order/v1/`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getToken()}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Kullanıcı ID'sine göre siparişler alınamadı.");
//   }

//   return await response.json();
// };





