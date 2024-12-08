import React, { useEffect, useState } from "react";
import { Button, Layout, Table, notification } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/ShoppingCard.css";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart as removeFromCartService,
  getCartByUserId,
} from "../../services/ProductService/ShoppingCardService";

const ShoppingCard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Sepet verisini backend'den alıyoruz
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const userId = 1; // Kullanıcı ID'si, genellikle oturumdan alınır
        const cartItems = await getCartByUserId(userId); // Servisten sepet verisini alıyoruz
        setData(cartItems); // Veriyi state'e kaydediyoruz
      } catch (error) {
        console.error("Sepet verisi alınamadı:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleOrder = () => {
    navigate("/Orders"); // Sepeti onaylamak için "Orders" sayfasına yönlendiriyoruz
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      // Ürünü API'den silme işlemi
      await removeFromCartService(productId);

      // Sepetten ürünü çıkarıyoruz
      const updatedCart = data.filter((item) => item.id !== productId);
      setData(updatedCart);

      // Kullanıcıyı bilgilendiriyoruz
      notification.warning({
        message: "Sepetten Çıkarıldı",
        description: "Ürün başarıyla sepette çıkarıldı!",
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
      title: "Ürün Resmi", // Product Image
      dataIndex: "image", // image alanını kullanıyoruz
      key: "image",
      render: (image) => <img className="image" src={image} alt="Ürün Resmi" />, // Resmi gösteriyoruz
    },
    {
      title: "Ürün Adı", // Product Name
      dataIndex: "name", // name alanını kullanıyoruz
      key: "name",
    },
    {
      title: "Açıklama", // Description
      dataIndex: "description", // description alanı mevcutsa bunu kullanabilirsiniz
      key: "description",
      render: (text) => text || "Açıklama yok", // Eğer açıklama yoksa "Açıklama yok" yazdır
    },
    {
      title: "Fiyat", // Price
      dataIndex: "price", // price alanını kullanıyoruz
      key: "price",
      render: (price) => `${price.toFixed(2)} TL`, // Fiyatı TL cinsinden gösteriyoruz
    },
    {
      title: "Stok Durumu", // Stock Status
      dataIndex: "stock", // stock alanını kullanıyoruz
      key: "stock",
    },
    {
      title: "İşlem", // Action
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleRemoveFromCart(record.id)}>
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
          rowKey={(record) => record.id} // Verilerin benzersizliğini sağlıyoruz
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
