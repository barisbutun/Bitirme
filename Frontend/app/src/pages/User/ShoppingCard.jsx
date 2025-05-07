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
  updateCartItemQuantity,
} from "../../services/ProductService/ShoppingCardService";

const ShoppingCard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedRowDetails, setExpandedRowDetails] = useState({});

  const loadCartItems = async () => {
    if (!isAuthenticated()) {
      notification.warning({
        message: "Giriş Gerekli",
        description: "Lütfen önce giriş yapın.",
        placement: "topRight",
      });
      navigate("/login");
      return;
    }

    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Kullanıcı bilgisi alınamadı");

      setLoading(true);
      const cartItems = await getCartByUserId(userId);
      setData(cartItems || []);
    } catch (error) {
      notification.error({
        message: "Hata",
        description: error.message || "Sepet verisi alınamadı",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

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

      const content = data.map((item) => ({
        id: item.id,
        product_id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        quantity: item.quantity,
        Size: item.product.Size || "",
      }));

      const orderData = {
        description: "Sipariş Açıklaması",
        name: "Sipariş Adı",
        sale_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        sum_price: data
          .reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          )
          .toFixed(2),
        stock_state: "AVAILABLE",
        payment_state: "SUCCESS",
        content: content,
      };

      const response = await fetch("http://localhost:8082/api/order/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(orderData.content),
      });

      if (!response.ok) throw new Error("Sipariş oluşturulamadı");

      await clearCartByUserId();

      notification.success({
        message: "Sipariş Başarılı",
        description: "Siparişiniz başarıyla oluşturuldu.",
        placement: "topRight",
      });

      navigate("/Orders");
    } catch (error) {
      notification.error({
        message: "Hata",
        description: error.message || "Sipariş oluşturulurken bir hata oluştu.",
        placement: "topRight",
      });
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      notification.success({
        message: "Başarılı",
        description: "Ürün sepetten çıkarıldı",
        placement: "topRight",
      });
      loadCartItems();
    } catch {
      notification.error({
        message: "Hata",
        description: "Ürün sepetten çıkarılamadı",
        placement: "topRight",
      });
    }
  };

  const handleQuantityChange = async (itemId, change) => {
    const item = data.find((product) => product.id === itemId);
    if (!item) {
      notification.error({
        message: "Hata",
        description: "Ürün bulunamadı",
        placement: "topRight",
      });
      return;
    }

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      notification.error({
        message: "Hata",
        description: "Miktar en az 1 olmalıdır",
        placement: "topRight",
      });
      return;
    }

    try {
      await updateCartItemQuantity(itemId, newQuantity);
      notification.success({
        message: "Başarılı",
        description: "Ürün miktarı güncellendi",
        placement: "topRight",
      });
      loadCartItems();
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Miktar güncellenemedi: " + error.message,
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
          <span style={{ margin: "0 8px" }}>{quantity}</span>
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
