import React, { useState, useEffect } from "react";
import { Layout, Table, Typography, notification, Button } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fetchAllOrders } from "../../services/ProductService/OrdersService";
import { fetchProductImages } from "../../services/ProductService/ProductService";
import ImageCollage from "../../components/ImageCollage";
import { useNavigate } from "react-router-dom";
import "../User/UserCss/Orders.css";

const { Text } = Typography;

const OrderList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [categorizedOrders, setCategorizedOrders] = useState({
    pending: [],
    preparing: [],
    shipping: [],
    delivered: [],
  });
  const [paginationStates, setPaginationStates] = useState({
    pending: { current: 1, pageSize: 5 },
    preparing: { current: 1, pageSize: 5 },
    shipping: { current: 1, pageSize: 5 },
    delivered: { current: 1, pageSize: 5 },
  });
  const [loading, setLoading] = useState(false);
  const [productImagesMap, setProductImagesMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllOrdersCompletely = async () => {
      const pageSize = 20;
      let currentPage = 0;
      let allOrders = [];
      let totalPages = 1;

      while (currentPage < totalPages) {
        try {
          const { content, totalPages: fetchedTotalPages } =
            await fetchAllOrders(currentPage, pageSize);
          allOrders = [...allOrders, ...content];
          totalPages = fetchedTotalPages;
          currentPage++;
        } catch (error) {
          notification.error({
            message: "Siparişler Yüklenemedi",
            description:
              error.message || "Siparişler getirilirken bir hata oluştu.",
          });
          break;
        }
      }

      setOrders(allOrders);
    };

    setLoading(true);
    fetchAllOrdersCompletely().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const categorizeOrders = () => {
      const pending = [];
      const preparing = [];
      const shipping = [];
      const delivered = [];

      orders.forEach((order) => {
        const paymentState = order.payment_state;
        const deliveryState = order.delivery?.delivery_state;

        if (
          !paymentState ||
          paymentState === "FAILED" ||
          paymentState === "CANCELLED" ||
          paymentState === "REFUNDED"
        ) {
          // null, başarısız, iptal edilmiş, iade edilmiş ödemeler
          pending.push(order);
        } else if (paymentState === "SUCCESS") {
          if (deliveryState === "Hazırlanıyor") {
            preparing.push(order);
          } else if (deliveryState === "Teslimatta") {
            shipping.push(order);
          } else if (deliveryState === "Teslim Edildi") {
            delivered.push(order);
          } else {
            // payment SUCCESS ama teslimat durumu belirsizse, yine pending'e alalım istersen
            pending.push(order);
          }
        } else {
          // Diğer bilinmeyen durumlar da pending'e
          pending.push(order);
        }
      });

      setCategorizedOrders({ pending, preparing, shipping, delivered });
    };

    if (orders.length > 0) {
      categorizeOrders();
    }
  }, [orders]);

  useEffect(() => {
    const fetchImagesForAllProducts = async () => {
      const allProductIds = new Set();
      orders.forEach((order) =>
        order.orderItems.forEach((item) => {
          if (item.product_id) allProductIds.add(item.product_id);
        })
      );

      const productIdsArray = Array.from(allProductIds);
      const promises = productIdsArray.map(async (id) => {
        try {
          const images = await fetchProductImages(id);
          return { id, images };
        } catch (error) {
          console.error("Resim alınamadı:", id, error);
          return { id, images: [] };
        }
      });

      const results = await Promise.all(promises);
      const imagesMap = {};
      results.forEach(({ id, images }) => {
        imagesMap[id] = images;
      });

      setProductImagesMap(imagesMap);
    };

    if (orders.length > 0) {
      fetchImagesForAllProducts();
    }
  }, [orders]);

  const handlePayment = (orderId) => {
    navigate(`/user/Payment?orderId=${orderId}`);
  };

  const generateColumns = (categoryKey) => [
    {
      title: "Sipariş ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Resimler",
      key: "images",
      width: 100,
      render: (_, record) => {
        const allImages = record.orderItems.flatMap(
          (item) => productImagesMap[item.product_id] || []
        );
        const productsForCollage = allImages.map((img) => ({ image: img }));
        return <ImageCollage products={productsForCollage} />;
      },
    },
    {
      title: "Sipariş Adı",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Sipariş Tarihi",
      dataIndex: "sale_date",
      key: "sale_date",
      render: (date) => new Date(date).toLocaleString("tr-TR"),
      width: 180,
    },
    {
      title: "Toplam Tutar",
      dataIndex: "sum_price",
      key: "sum_price",
      render: (price) => `${price.toFixed(2)} ₺`,
      width: 120,
    },
    {
      title: "Adres",
      dataIndex: "address",
      key: "address",
      render: (addr) => addr || <Text type="secondary">Adres yok</Text>,
      ellipsis: true,
    },
    {
      title: "Sipariş Durumu",
      key: "delivery_state",
      width: 150,
      render: (_, record) =>
        record.delivery?.delivery_state || (
          <Text type="secondary">Belirtilmemiş</Text>
        ),
    },
    ...(categoryKey === "pending"
      ? [
          {
            title: "İşlem",
            key: "action",
            width: 120,
            align: "center",
            render: (_, record) => (
              <Button
                type="primary"
                block
                onClick={() => handlePayment(record.id)}
                style={{ fontWeight: "normal" }}
              >
                Ödeme Yap
              </Button>
            ),
          },
        ]
      : []),
  ];

  const expandedRowRender = (order) => {
    const itemColumns = [
      {
        title: "Ürün ID",
        dataIndex: "product_id",
        key: "product_id",
        width: 100,
      },
      {
        title: "Resimler",
        key: "images",
        width: 100,
        render: (_, record) => {
          const images = productImagesMap[record.product_id] || [];
          return (
            <ImageCollage products={images.map((img) => ({ image: img }))} />
          );
        },
      },
      {
        title: "Adet",
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
      },
      {
        title: "Beden",
        dataIndex: "size",
        key: "size",
        width: 80,
      },
    ];

    return (
      <Table
        columns={itemColumns}
        dataSource={order.orderItems}
        pagination={false}
        rowKey={(record) => `${order.id}-${record.product_id}`}
        locale={{ emptyText: "Sipariş ürünü bulunamadı" }}
      />
    );
  };

  const handlePaginationChange = (category) => (pagination) => {
    setPaginationStates((prev) => ({
      ...prev,
      [category]: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    }));
  };

  const renderCategory = (title, data, categoryKey) => {
    const { current, pageSize } = paginationStates[categoryKey];
    const paginatedData = data.slice(
      (current - 1) * pageSize,
      current * pageSize
    );

    return (
      <div className="orders-category">
        <h2>{title}</h2>
        <Table
          columns={generateColumns(categoryKey)}
          dataSource={paginatedData}
          loading={loading}
          rowKey={(record) => record.id}
          expandable={{ expandedRowRender }}
          pagination={{
            current,
            pageSize,
            total: data.length,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
          onChange={handlePaginationChange(categoryKey)}
          bordered
          locale={{ emptyText: "Bu kategoriye ait sipariş yok" }}
        />
      </div>
    );
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="orders-layout"
        style={{ marginLeft: collapsed ? 0 : 200, padding: 20 }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="orders-container">
          {renderCategory(
            "🕒 Ödeme Bekleyen Siparişler",
            categorizedOrders.pending,
            "pending"
          )}
          {renderCategory(
            "🛠 Hazırlanıyor",
            categorizedOrders.preparing,
            "preparing"
          )}
          {renderCategory(
            "🚚 Teslimatta",
            categorizedOrders.shipping,
            "shipping"
          )}
          {renderCategory(
            "📦 Teslim Edildi",
            categorizedOrders.delivered,
            "delivered"
          )}
        </div>
        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default OrderList;
