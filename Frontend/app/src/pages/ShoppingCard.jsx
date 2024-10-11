import React, { useEffect, useState } from "react";
import { Button, Layout, Table } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/ShoppingCard.css"; // CSS dosyasını import ediyoruz
import { useNavigate } from "react-router-dom";

const ShoppingCard = () => {
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
  ];

  const [data, setData] = useState([]);
  // useEffect(() => {
  //   fetch("/Shopping.json")
  //     .then((response) => response.json())
  //     .then((data) => setData(data))
  //     .catch((error) => console.error("vei çekme hatası:", error));
  // }, []);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartData) {
      setData(cartData);
    }
  }, []);
  const navigate = useNavigate();
  const handleOrder = (record) => {
    navigate("/Orders");
  };

  const [collapsed, setCollapsed] = useState(false);

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
                onClick={() => handleOrder()}
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
