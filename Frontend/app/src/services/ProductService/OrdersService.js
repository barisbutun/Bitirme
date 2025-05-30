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
export const cancelOrderItem = async (orderId, productIds, payload) => {
  try {
    console.log("Starting cancellation process for order:", orderId);
    console.log("Product IDs to cancel:", productIds);
    console.log("Initial payload:", payload);

    if (!payload.order_items || payload.order_items.length === 0) {
      throw new Error("İptal edilecek ürün bilgileri eksik");
    }

    // Önce mevcut iptal kaydını kontrol et
    const checkResponse = await fetch(`http://localhost:8082/api/cancellation/v1/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    let response;
    if (checkResponse.ok) {
      // Mevcut kayıt varsa güncelle
      const existingCancellation = await checkResponse.json();
      console.log("Existing cancellation:", existingCancellation);

      if (!existingCancellation || !existingCancellation.id) {
        throw new Error("Mevcut iptal kaydı bulunamadı veya geçersiz");
      }

      // URL'de id'yi kullan
      const updateUrl = `http://localhost:8082/api/cancellation/v1/${existingCancellation.id}`;
      console.log("Update URL:", updateUrl);

      // API'nin beklediği formatta payload oluştur
      const updatePayload = {
        order_id: orderId,
        order_items: payload.order_items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          cancel_quantity: item.cancel_quantity
        }))
      };

      console.log("Update payload:", updatePayload);

      response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updatePayload),
      });
    } else {
      // Yeni kayıt oluştur
      const createPayload = {
        order_id: orderId,
        order_items: payload.order_items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          cancel_quantity: item.cancel_quantity
        })),
        description: "Sipariş ürünlerini iptal etmek istiyorum"
      };

      console.log("Create payload:", createPayload);

      response = await fetch("http://localhost:8082/api/cancellation/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(createPayload),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Sipariş iptal edilemedi");
    }

    const responseData = await response.json();
    console.log("Success response:", responseData);

    // Eğer tüm ürünler iptal edildiyse sipariş durumunu güncelle
    const orderResponse = await fetch(`http://localhost:8082/api/order/v1/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      const remainingItems = orderData.orderItems.filter(item => !item.cancelled && item.quantity > 0);

      // Eğer iptal edilmemiş veya miktarı 0'dan büyük ürün kalmadıysa
      if (remainingItems.length === 0) {
        const updateOrderResponse = await fetch(`http://localhost:8082/api/order/v1/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            payment_state: "CANCELLED",
            delivery: {
              delivery_state: "CANCELLED"
            }
          }),
        });

        if (!updateOrderResponse.ok) {
          console.error("Order status update failed");
        }
      }
    }

    return {
      ...responseData,
      cancelledProductIds: productIds
    };
  } catch (error) {
    console.error("Cancellation error:", error);
    throw error;
  }
};



//Sipariş iptal etme
export const cancelOrder = async (payload) => {
  try {
    if (!payload.order_items || payload.order_items.length === 0) {
      throw new Error("İptal edilecek ürün bulunamadı");
    }

    // Önce mevcut iptal kaydını kontrol et
    const checkResponse = await fetch(`http://localhost:8082/api/cancellation/v1/${payload.order_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    let response;
    if (checkResponse.ok) {
      // Mevcut kayıt varsa güncelle
      const existingCancellation = await checkResponse.json();
      console.log("Existing cancellation:", existingCancellation);

      if (!existingCancellation || !existingCancellation.id) {
        throw new Error("Mevcut iptal kaydı bulunamadı veya geçersiz");
      }

      // URL'de id'yi kullan
      const updateUrl = `http://localhost:8082/api/cancellation/v1/${existingCancellation.id}`;
      console.log("Update URL:", updateUrl);

      // PUT isteği için payload
      const updatePayload = {
        order_id: payload.order_id,
        order_items: payload.order_items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          cancel_quantity: item.cancel_quantity
        }))
      };

      console.log("Update payload:", updatePayload);

      response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updatePayload),
      });
    } else {
      // Yeni kayıt oluştur
      const createPayload = {
        order_id: payload.order_id,
        description: payload.description || "Siparişi iptal etmek istiyorum",
        order_items: payload.order_items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          cancel_quantity: item.cancel_quantity
        }))
      };

      console.log("Create payload:", createPayload);

      // Tam iptal için /all endpoint'ini kullan
      const endpoint = payload.order_items.length === payload.order_items.filter(item => item.cancel_quantity === item.quantity).length
        ? "http://localhost:8082/api/cancellation/v1/all"
        : "http://localhost:8082/api/cancellation/v1";

      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(createPayload),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Sipariş iptal edilemedi");
    }

    const responseData = await response.json();
    console.log("Cancellation response:", responseData);

    // Sipariş durumunu güncelle
    const orderUpdateResponse = await fetch(`http://localhost:8082/api/order/v1/${payload.order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        payment_state: "CANCELLED",
        delivery: {
          delivery_state: "CANCELLED"
        }
      }),
    });

    if (!orderUpdateResponse.ok) {
      console.error("Order status update failed");
    }

    return responseData;
  } catch (error) {
    console.error("Cancellation error:", error);
    throw error;
  }
};


//iptal edilen siparişi iptal etme

