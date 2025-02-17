import React, { useEffect, useState } from "react";
import { Button, Layout, Table, notification } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/ShoppingCard.css";
import { getUserIdFromToken, isAuthenticated } from "../../utils/auth";
import {
  removeFromCart as removeFromCartService,
  getCartByUserId,
} from "../../services/ProductService/ShoppingCardService";

const ShoppingCard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
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
        setData(cartItems);
      } catch (error) {
        console.error("Sepet verisi alınamadı:", error);
        notification.error({
          message: "Hata",
          description: "Sepet verisi alınamadı: " + error.message,
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [navigate]);

  const handleOrder = () => {
    navigate("/Orders");
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCartService(productId);
      const updatedCart = data.filter((item) => item.id !== productId);
      setData(updatedCart);

      notification.warning({
        message: "Sepetten Çıkarıldı",
        description: "Ürün başarıyla sepetten çıkarıldı!",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Sepetten çıkarma işlemi başarısız oldu.",
        placement: "topRight",
      });
    }
  };

  const columns = [
    {
      title: "Ürün Resmi",
      dataIndex: ["product", "image1"],
      key: "image",
      render: (image) => <img className="image" src={image} alt="Ürün Resmi" />,
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
            expandedRowRender: (record) => (
              <Table
                className="orderItem"
                dataSource={record.orderDetails}
                columns={[
                  {
                    title: "Ürün Adı",
                    dataIndex: "productName",
                    key: "productName",
                  },
                  { title: "Adet", dataIndex: "quantity", key: "quantity" },
                  {
                    title: "Birim Fiyatı",
                    dataIndex: "unitPrice",
                    key: "unitPrice",
                  },
                ]}
                pagination={false}
              />
            ),
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
