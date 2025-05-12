import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Drawer,
  Button,
  Typography,
  Descriptions,
  notification,
  Space,
  Input,
  Checkbox,
} from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import "../User/UserCss/Orders.css";
import {
  fetchAllOrders,
  getOrderItemsByUser,
} from "../../services/ProductService/OrdersService";

const API_BASE_URL = "http://localhost:8082";

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [productImageMap, setProductImageMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip: "",
  });
  const navigate = useNavigate();

  const fetchProductImages = async (productId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/image/v1/infos/${productId}`
      );
      if (!response.ok) throw new Error(`Resim alınamadı: ${productId}`);
      const images = await response.json();
      return images.length > 0 && images[0].data
        ? `data:image/jpeg;base64,${images[0].data}`
        : null;
    } catch (error) {
      console.error("Resim yüklenirken hata:", error);
      return null;
    }
  };

  const fetchOrderProducts = async (orderId) => {
    try {
      const items = await getOrderItemsByUser(orderId);
      const updatedImageMap = { ...productImageMap };

      const productsWithImages = await Promise.all(
        items.map(async (item) => {
          if (!updatedImageMap[item.product.id]) {
            const img = await fetchProductImages(item.product.id);
            updatedImageMap[item.product.id] = img;
          }
          return {
            ...item.product,
            quantity: item.quantity,
            image: updatedImageMap[item.product.id],
          };
        })
      );

      setProductImageMap(updatedImageMap);
      return productsWithImages;
    } catch (error) {
      console.error("Ürün detayları alınamadı", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrdersWithProducts = async () => {
      try {
        const pageData = await fetchAllOrders();
        const data = pageData.content || pageData;

        const formattedOrders = await Promise.all(
          data.map(async (order, index) => {
            const products = await fetchOrderProducts(order.id);
            return {
              ...order,
              key: order.id || index,
              products,
              saleDate: order.sale_date,
              sumPrice: order.sum_price.toFixed(2),
              stockState: order.stock_state
                ? order.stock_state.toString()
                : "Bilinmiyor",
            };
          })
        );

        setOrders(formattedOrders.reverse());
      } catch (error) {
        console.error("Sipariş verileri alınamadı:", error);
        notification.error({
          message: "Hata",
          description: "Sipariş verileri alınamadı.",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithProducts();
  }, []);

  const handleCheckout = (id) => {
    if (!id) {
      notification.error({
        message: "Hata",
        description: "Sipariş ID'si geçersiz!",
      });
      return;
    }
    navigate(`/user/Payment?orderId=${id}`);
  };

  const viewOrderDetails = async (order) => {
    if (!order?.id) {
      notification.error({
        message: "Hata",
        description: "Sipariş ID'si bulunamadı!",
      });
      return;
    }

    try {
      const products = await fetchOrderProducts(order.id);
      setSelectedOrder({ ...order, products });
      setDrawerVisible(true);
    } catch (error) {
      console.error("Sipariş detayları alınamadı:", error);
      notification.error({
        message: "Hata",
        description: "Sipariş detayları alınırken bir hata oluştu.",
        placement: "topRight",
      });
    }
  };

  const handleAddressChange = (e) => {
    setIsSameAddress(e.target.checked);
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    {
      title: "Sipariş ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Toplam Fiyat",
      dataIndex: "sumPrice",
      key: "sumPrice",
      render: (text) => `${text} ₺`,
    },
    {
      title: "Durum",
      dataIndex: "stockState",
      key: "stockState",
    },
    {
      title: "Ürünler",
      key: "products",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {record.products?.length > 0 ? (
            record.products.map((product, index) => (
              <img
                key={index}
                src={product.image}
                alt={product.name}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            ))
          ) : (
            <span>Yok</span>
          )}
        </div>
      ),
    },
    {
      title: "İşlemler",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => viewOrderDetails(record)}>
            Görüntüle
          </Button>
          <Button type="primary" onClick={() => handleCheckout(record.id)}>
            Sipariş Et
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="Orders-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="orders-content">
          <Typography.Title level={2}>Siparişlerim</Typography.Title>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey={(record) => record.key}
            pagination={false}
            loading={loading}
            className="order-table"
          />
        </div>
        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>

      <Drawer
        title="Sipariş Detayları"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={isDrawerVisible}
        width={450}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Sipariş ID">
              {selectedOrder.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tarih">
              {selectedOrder.saleDate}
            </Descriptions.Item>
            <Descriptions.Item label="Toplam Tutar">
              {selectedOrder.sumPrice} ₺
            </Descriptions.Item>
            <Descriptions.Item label="Durum">
              {selectedOrder.stockState}
            </Descriptions.Item>
            <Descriptions.Item label="Ürünler">
              <ul style={{ paddingLeft: "1rem" }}>
                {selectedOrder.products?.length > 0 ? (
                  selectedOrder.products.map((product, index) => (
                    <li key={index} style={{ marginBottom: 10 }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: 50, marginRight: 10 }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      {product.name || "İsimsiz ürün"} -{" "}
                      {product.price || "???"} TL (Adet: {product.quantity})
                    </li>
                  ))
                ) : (
                  <li>Ürün bilgisi bulunamadı</li>
                )}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}

        <div className="address-selection" style={{ marginTop: "1rem" }}>
          <Checkbox checked={isSameAddress} onChange={handleAddressChange}>
            Kayıtlı adresi kullan
          </Checkbox>

          {!isSameAddress && (
            <Space
              direction="vertical"
              style={{ marginTop: 10, width: "100%" }}
            >
              <Input
                placeholder="Sokak Adresi"
                name="street"
                value={newAddress.street}
                onChange={handleNewAddressChange}
              />
              <Input
                placeholder="Şehir"
                name="city"
                value={newAddress.city}
                onChange={handleNewAddressChange}
              />
              <Input
                placeholder="Posta Kodu"
                name="zip"
                value={newAddress.zip}
                onChange={handleNewAddressChange}
              />
            </Space>
          )}
        </div>
      </Drawer>
    </Layout>
  );
};

export default Orders;
