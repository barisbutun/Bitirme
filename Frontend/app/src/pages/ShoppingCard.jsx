import React, { useEffect, useState } from "react";
import { Button, Layout, Table } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/ShoppingCard.css"; // CSS dosyasını import ediyoruz

const ShoppingCard = () => {
  const columns = [
    {
      title: "Müşteri ID", // Customer(id)
      dataIndex: "customerId",
      key: "customerId",
    },
    {
      title: "Ürün Listesi", // List(Product(id))
      dataIndex: "productList",
      key: "productList",
      render: (products) =>
        Array.isArray(products) && products.length > 0
          ? products.join(", ") //  Eğer dizi ise ürünleri virgül ile ayırarak göster
          : "Ürün yok", //ürün listesi boş ise
    },
    // {
    //   title: "Açıklama", // description
    //   dataIndex: "description",
    //   key: "description",
    // },
    {
      title: "Satış Tarihi", // sale_date
      dataIndex: "saleDate",
      key: "saleDate",
    },
    {
      title: "Toplam Fiyat", // sum_price
      dataIndex: "sumPrice",
      key: "sumPrice",
    },
    {
      title: "Sipariş Durumu", // order_state
      dataIndex: "orderState",
      key: "orderState",
    },
    {
      title: "Ödeme Durumu", // payment_state
      dataIndex: "paymentState",
      key: "paymentState",
    },
    {
      title: "Ödeme Yöntemi", // payment_method
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Button type="primary" onClick={() => handlePayment(record)}>
          Ödeme Yap
        </Button>
      ),
    },
  ];

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/Shopping.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("vei çekme hatası:", error));
  }, []);

  const handlePayment = (record) => {
    console.log("ödeme işlemi başlatıldı:${record.customerId");
  };
  return (
    <Layout>
      <Sidebar />
      <Layout className="shopping-card-layout">
        <Header />
        <Table
          className="shopping-card-table"
          columns={columns}
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
          dataSource={data}
        />
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ShoppingCard;
