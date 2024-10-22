// Sepete ürün ekleme
export const addToCart = async (productId) => {
    try {
      const response = await fetch('api/shoppingCartItem/v1 ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Kullanıcı token'ı ekle
        },
        body: JSON.stringify({ productId}),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Ürün sepete eklendi!", data);

      } else {
        console.error("Hata oluştu", data);
      }
    } catch (error) {
      console.error("API isteği başarısız oldu:", error);
    }
  };

  //Sepetten ürün çıkar
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`api/shoppingCartItem/v1/${productId}`, {
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

//sipariş sayfasına yönlendirildikten sonra sepeti temizleme

