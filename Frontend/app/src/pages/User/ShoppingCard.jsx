import React, { useEffect, useState } from "react";
import { Button, Layout, Table, notification } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/ShoppingCard.css";
import {
  getUserIdFromToken,
  isAuthenticated,
  getToken,
} from "../../utils/auth";
import {
  removeFromCart,
  getCartByUserId,
  clearCartByUserId,
  getProductDetails,
  updateCartItemQuantity,
} from "../../services/ProductService/ShoppingCardService";

const ShoppingCard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowData, setExpandedRowData] = useState(null); // Detaylar için yeni state
  const navigate = useNavigate();

  // Sepet verilerini getiren fonksiyon
  const loadCartItems = async () => {
    try {
      if (!isAuthenticated()) {
        notification.warning({
          message: "Giriş Gerekli",
          description: "Lütfen önce giriş yapın.",
          placement: "topRight",
        });
        navigate("/login");
        return;
      }

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("Kullanıcı bilgisi alınamadı");
      }

      setLoading(true);
      const cartItems = await getCartByUserId(userId);
      console.log("Backend'den gelen sepet verisi:", cartItems);

      if (cartItems && cartItems.length > 0) {
        setData(cartItems);
      } else {
        throw new Error("Sepetiniz boş.");
      }
    } catch (error) {
      notification.error({
        message: "Hata",
        description: error.message || "Sepet verisi alınamadı ",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, [navigate]);

  const handleOrder = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        notification.warning({
          message: "Giriş Gerekli",
          description: "Lütfen önce giriş yapın.",
          placement: "topRight",
        });
        navigate("/login");
        return;
      }

      // Sipariş verilerini oluştur
      const orderData = {
        description: "Sipariş Açıklaması", // İsteğe bağlı açıklama
        name: "Sipariş Adı", // İsteğe bağlı sipariş adı
        sale_date: new Date().toISOString().slice(0, 19).replace("T", " "), // Şu anki tarih ve saat
        sum_price: data
          .reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          )
          .toFixed(2), // Toplam fiyat
        stock_state: "AVAILABLE",
        payment_state: "SUCCESS", // Stok durumu
        content: data,
      };

      // Siparişi oluştur
      const response = await fetch("http://localhost:8082/api/order/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(orderData.content), // JSON formatında gönderiyoruz
      });

      if (!response.ok) {
        throw new Error("Sipariş oluşturulamadı");
      }

      // Sepeti temizle
      await clearCartByUserId();

      notification.success({
        message: "Sipariş Başarılı",
        description: "Siparişiniz başarıyla oluşturuldu.",
        placement: "topRight",
      });

      // Siparişler sayfasına yönlendir
      navigate("/Orders");
    } catch (error) {
      notification.error({
        message: "Hata",
        description: error.message || "Sipariş oluşturulurken bir hata oluştu.",
        placement: "topRight",
      });
    }
  };

  // Sepetten ürün çıkarma işlemi
  const handleRemoveFromCart = async (itemId) => {
    try {
      if (!itemId) {
        notification.error({
          message: "Hata",
          description: "Geçersiz ürün ID'si",
          placement: "topRight",
        });
        return;
      }

      // ID'yi sayıya çevir
      const cartItemId = parseInt(itemId, 10);

      console.log("Silinecek ürün ID:", cartItemId);

      await removeFromCart(cartItemId);

      notification.success({
        message: "Başarılı",
        description: "Ürün sepetten çıkarıldı",
        placement: "topRight",
      });

      // Sepeti yenile
      loadCartItems();
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Ürün sepetten çıkarılamadı",
        placement: "topRight",
      });
    }
  };

  const handleQuantityChange = async (itemId, change) => {
    try {
      // Mevcut ürünün miktarını bul
      const item = data.find((product) => product.id === itemId);
      if (!item) {
        notification.error({
          message: "Hata",
          description: "Ürün bulunamadı",
          placement: "topRight",
        });
        return;
      }

      // Yeni miktarı hesapla
      const newQuantity = item.quantity + change;
      if (newQuantity < 1) {
        notification.error({
          message: "Hata",
          description: "Miktar en az 1 olmalıdır",
          placement: "topRight",
        });
        return;
      }

      // API çağrısı yaparak miktarı güncelle
      await updateCartItemQuantity(itemId, newQuantity);

      notification.success({
        message: "Başarılı",
        description: "Ürün miktarı güncellendi",
        placement: "topRight",
      });

      // Sepeti yenile
      loadCartItems();
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Miktar güncellenemedi: " + error.message,
        placement: "topRight",
      });
    }
  };

  const handleExpandRow = async (record) => {
    console.log("Genişletilen kayıt:", record); // Hata ayıklama için
    if (record.product && record.product.id) {
      const details = await getProductDetails(record.product.id); // Doğru ID'yi geçin
      setExpandedRowData(details);
    } else {
      notification.error({
        message: "Hata",
        description: "Ürün ID'si bulunamadı!",
        placement: "topRight",
      });
    }
  };
  const columns = [
    {
      title: "Ürün Resmi",
      dataIndex: ["product", "images"],
      key: "image",
      render: (images) => (
        <img
          className="image"
          src={images && images.length > 0 ? images[0] : ""}
          alt="Ürün Resmi"
          onError={(e) => {
            console.log("Resim yüklenemedi");
            e.target.style.display = "none";
          }}
        />
      ),
    },
    {
      title: "Ürün Adı",
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: "Miktar",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <div>
          <Button onClick={() => handleQuantityChange(record.id, -1)}>-</Button>
          <span>{quantity}</span>
          <Button onClick={() => handleQuantityChange(record.id, 1)}>+</Button>
        </div>
      ),
    },
    {
      title: "Fiyat",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price) => `${price?.toFixed(2)} TL`,
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleRemoveFromCart(record.id)}
        >
          Sepetten Çıkar
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="shopping-card-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Table
          className="shopping-card-table"
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => {
              handleExpandRow(record);
              return (
                <div>
                  {expandedRowData && (
                    <div>
                      <h3>Ürün Detayları</h3>
                      <p>{expandedRowData.description}</p>
                      {/* Diğer detayları burada gösterin */}
                    </div>
                  )}
                </div>
              );
            },
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          footer={() => (
            <div>
              <Button
                className="SiparisButon"
                type="primary"
                onClick={handleOrder}
                disabled={data.length === 0}
              >
                Sepeti Onayla
              </Button>
            </div>
          )}
        />
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ShoppingCard;
