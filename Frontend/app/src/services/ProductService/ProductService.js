//veri getirme
export const fetchProducts = async () => {
    const response = await fetch('/api/product', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Eğer token ya da yetkilendirme bilgisi gerekiyorsa buraya ekleyebilirsin
        'Authorization': `Bearer ${token}`
      },
    });
  
    if (!response.ok) {
      throw new Error('Veri çekme hatası');
    }
  
    return response.json();
  };
  
  //Ürün favori ekleme
  const addToFavorites = async (productId) => {
    try {
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        console.log('Product added to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  //Ürün favori çıkarma

const removeFromCart = async (productId) => {
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

  //Admin Panel için


