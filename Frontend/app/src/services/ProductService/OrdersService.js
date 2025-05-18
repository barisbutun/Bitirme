
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
  

// Sipariş İptal etme
// export const cancelOrder = async (orderId) => {
//   const response = await fetch(`http://localhost:8082/api/order/v1/${orderId}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Sipariş iptal edilemedi");
//   }

//   return await response.json();
// };


// Sipariş içindeki ürün iptal etme
export const cancelOrderItem = async (orderId, productIds, orderItems = []) => {
 

  const filteredOrderItems = orderItems
    .filter((item) => productIds.includes(item.product_id.toString()))
    .map((item) => ({
      id: item.id,
      product_id: item.product_id,
      cancel_quantity: item.quantity,
    }));

  const payload = {
    order_id: orderId,
    description: "Siparişi iptal etmek istiyorum",
    order_items: filteredOrderItems,
  };

  const response = await fetch("http://localhost:8082/api/cancellation/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Sipariş iptal edilemedi");
  }

  return await response.json();
};



//Sipariş iptal etme
export const cancelOrder = async (order) => {
  const { order_id, description, order_items } = order;

  console.log(order_id, description, order_items);

  const response = await fetch("http://localhost:8082/api/cancellation/v1/all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      description,
      order_id,
      order_items,
    }),
  });

  if (!response.ok) {
    throw new Error("Sipariş iptal edilemedi");
  }

  return await response.json();
};


