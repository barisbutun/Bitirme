// src/services/apiService.js
export const getProtectedData = async () => {
    const token = getCurrentToken();
    const response = await fetch("http://localhost:8082/api/auth/v1", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    

    if (response.ok) {
      const data = await response.json();
      console.log("Korumalı veri:", data);
      return data;
    } else {
      console.error("Erişim hatası:", response.status);
      return null;
    }
  };
  



  

