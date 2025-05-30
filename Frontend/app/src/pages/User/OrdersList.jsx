import React, { useState, useEffect } from "react";
import { Layout, Table, Typography, Button, Select, Tag, App } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fetchAllOrders } from "../../services/ProductService/OrdersService";
import { fetchProductImages } from "../../services/ProductService/ProductService";
import ImageCollage from "../../components/ImageCollage";
import { useNavigate } from "react-router-dom";
import "../User/UserCss/Orders.css";

import {
  cancelOrder,
  cancelOrderItem,
} from "../../services/ProductService/OrdersService";

const { Text } = Typography;
const { Option } = Select;

const OrderList = () => {
  const { notification } = App.useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [categorizedOrders, setCategorizedOrders] = useState({
    pending: [],
    preparing: [],
    shipping: [],
    delivered: [],
    cancelled: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("pending");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [loading, setLoading] = useState(false);
  const [productImagesMap, setProductImagesMap] = useState({});
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
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
  }, [updateTrigger]); // updateTrigger değişince tekrar fetch et

  useEffect(() => {
    const categorizeOrders = () => {
      const pending = [];
      const preparing = [];
      const shipping = [];
      const delivered = [];
      const cancelled = [];

      orders.forEach((order) => {
        const paymentState = order.payment_state;
        const deliveryState = order.delivery?.delivery_state?.toUpperCase();

        if (paymentState === "CANCELLED" || deliveryState === "CANCELLED") {
          cancelled.push(order);
        } else if (paymentState === null) {
          pending.push(order);
        } else if (paymentState === "SUCCESS") {
          if (deliveryState === "PROCESSING") {
            preparing.push(order);
          } else if (
            deliveryState === "SHIPPED" ||
            deliveryState === "IN_TRANSIT" ||
            deliveryState === "OUT_FOR_DELIVERY"
          ) {
            shipping.push(order);
          } else if (deliveryState === "DELIVERED") {
            delivered.push(order);
          } else if (
            deliveryState === "FAILED_DELIVERY" ||
            deliveryState === "RETURNED"
          ) {
            cancelled.push(order);
          } else {
            preparing.push(order);
          }
        } else {
          pending.push(order);
        }
      });

      setCategorizedOrders({
        pending,
        preparing,
        shipping,
        delivered,
        cancelled,
      });
      setPagination({ current: 1, pageSize: 5 });
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

  const handleItemSelection = (orderId, selectedRowKeys) => {
    setSelectedItemsMap((prev) => ({ ...prev, [orderId]: selectedRowKeys }));
  };

  const handleCancelSelectedItems = async (orderId) => {
    const selectedKeys = selectedItemsMap[orderId] || [];
    const productIds = selectedKeys.map((key) => key.split(`${orderId}-`)[1]);

    try {
      // Önce mevcut siparişi bul
      const currentOrder = orders.find((order) => order.id === orderId);
      if (!currentOrder) {
        throw new Error("Sipariş bulunamadı");
      }

      // İptal edilecek ürünleri filtrele
      const itemsToCancel = currentOrder.orderItems.filter((item) =>
        productIds.includes(item.product_id.toString())
      );

      if (itemsToCancel.length === 0) {
        throw new Error("İptal edilecek ürün bulunamadı");
      }

      console.log("Items to cancel:", itemsToCancel);

      // İptal edilecek ürünlerin detaylarını hazırla
      const orderItems = itemsToCancel.map((item) => {
        const orderItem = currentOrder.orderItems.find(
          (oi) => oi.product_id === item.product_id
        );
        if (!orderItem) {
          throw new Error(
            `Ürün ID ${item.product_id} için order item bulunamadı`
          );
        }

        return {
          id: orderItem.id,
          product_id: item.product_id,
          cancel_quantity: item.quantity,
          quantity: item.quantity,
        };
      });

      console.log("Order items for payload:", orderItems);

      const payload = {
        order_id: orderId,
        order_items: orderItems,
      };

      console.log("Cancellation payload:", payload);

      const response = await cancelOrderItem(orderId, productIds, payload);

      notification.success({
        message: "Seçili ürünler iptal edildi",
      });

      // Frontend'te siparişi güncelle
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            // İptal edilen ürünleri siparişten çıkar
            const updatedItems = order.orderItems.filter(
              (item) => !productIds.includes(item.product_id.toString())
            );

            // Toplam tutarı güncelle
            const newSumPrice = updatedItems.reduce((sum, item) => {
              return sum + (item.product?.price || 0) * item.quantity;
            }, 0);

            // Eğer tüm ürünler iptal edildiyse veya kalan ürünlerin miktarları 0 ise
            if (
              updatedItems.length === 0 ||
              updatedItems.every((item) => item.quantity === 0)
            ) {
              return {
                ...order,
                orderItems: [], // Tüm ürünleri temizle
                sum_price: 0, // Toplam tutarı sıfırla
                delivery: {
                  ...order.delivery,
                  delivery_state: "CANCELLED",
                },
                payment_state: "CANCELLED", // Ödeme durumunu da güncelle
              };
            }

            return {
              ...order,
              orderItems: updatedItems,
              sum_price: newSumPrice,
              payment_state: "UPDATED", // Kısmi iptal durumunda ödeme durumunu güncelle
            };
          }
          return order;
        })
      );

      // Seçimi temizle
      setSelectedItemsMap((prev) => ({ ...prev, [orderId]: [] }));

      // Kategorileri yeniden hesapla
      setUpdateTrigger((prev) => !prev);
    } catch (error) {
      console.error("İptal hatası:", error);
      notification.error({
        message: "Ürünler iptal edilemedi",
        description: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  };

  const handleCancelOrder = async (order) => {
    try {
      // Sadece iptal edilmemiş ürünleri filtrele
      const activeOrderItems = order.orderItems.filter(
        (item) => !item.cancelled
      );

      if (activeOrderItems.length === 0) {
        notification.warning({
          message: "Uyarı",
          description: "Bu siparişte iptal edilecek ürün kalmadı.",
        });
        return;
      }

      // Tüm ürünlerin toplam tutarını hesapla
      const cancelAmount = activeOrderItems.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      const order_items = activeOrderItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        cancel_quantity: item.quantity,
        quantity: item.quantity, // Orijinal miktarı da gönder
      }));

      const payload = {
        order_id: order.id,
        description: "Siparişi iptal etmek istiyorum",
        order_items: order_items,
        cancel_amount: cancelAmount,
      };

      await cancelOrder(payload);

      notification.success({ message: "Sipariş iptal edildi" });

      // Siparişi cancelled kategorisine taşı ve orderItems'ı temizle
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === order.id) {
            return {
              ...o,
              orderItems: [], // Tüm ürünleri temizle
              sum_price: 0, // Toplam tutarı sıfırla
              delivery: {
                ...o.delivery,
                delivery_state: "CANCELLED",
              },
              payment_state: "CANCELLED", // Ödeme durumunu da güncelle
            };
          }
          return o;
        })
      );

      // Kategorileri yeniden hesapla
      setUpdateTrigger((prev) => !prev);
    } catch (error) {
      console.error("Sipariş iptal hatası:", error);
      notification.error({
        message: "Sipariş iptal edilemedi",
        description: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
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
      key: "address",
      render: (_, record) => {
        const isSame = record.delivery?.is_same_address;
        const addressToShow =
          isSame === false ? record.delivery?.delivery_address : record.address;

        return addressToShow ? (
          addressToShow
        ) : (
          <Text type="secondary">Adres yok</Text>
        );
      },
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

    ...(categoryKey === "preparing"
      ? [
          {
            title: "İşlem",
            key: "action",
            width: 120,
            align: "center",
            render: (_, order) => (
              <Button
                danger
                block
                onClick={() => handleCancelOrder(order)}
                style={{ fontWeight: "normal" }}
              >
                İptal Et
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
      {
        title: "Durum",
        key: "status",
        width: 100,
        render: (_, record) => {
          const isCancelled = record.cancelled || false;
          return isCancelled ? (
            <Tag color="red">İptal Edildi</Tag>
          ) : (
            <Tag color="green">Aktif</Tag>
          );
        },
      },
    ];

    // Sadece iptal edilmemiş ürünleri göster
    const activeOrderItems = order.orderItems.filter((item) => !item.cancelled);

    const rowSelection = {
      selectedRowKeys: selectedItemsMap[order.id] || [],
      onChange: (selectedRowKeys) =>
        handleItemSelection(order.id, selectedRowKeys),
      // İptal edilmiş ürünleri seçilemez yap
      getCheckboxProps: (record) => ({
        disabled: record.cancelled,
      }),
    };

    return (
      <Table
        columns={itemColumns}
        dataSource={activeOrderItems.map((item) => ({
          ...item,
          key: `${order.id}-${item.product_id}`,
        }))}
        pagination={false}
        rowKey={(record) => `${order.id}-${record.product_id}`}
        locale={{ emptyText: "Sipariş ürünü bulunamadı" }}
        size="small"
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        footer={() =>
          selectedItemsMap[order.id]?.length > 0 && (
            <Button
              danger
              onClick={() => handleCancelSelectedItems(order.id)}
              style={{ fontWeight: "normal" }}
            >
              Seçili Ürünleri İptal Et
            </Button>
          )
        }
      />
    );
  };

  const handlePaginationChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  // Tek tabloda seçilen kategoriye göre veriyi getiriyoruz
  const currentData = categorizedOrders[selectedCategory] || [];

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="orders-layout"
        style={{ marginLeft: collapsed ? 0 : 200, padding: 20 }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="orders-container">
          <div style={{ marginBottom: 16, maxWidth: 300 }}>
            <Select
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                setPagination({ current: 1, pageSize: 5 });
              }}
              style={{ width: "100%" }}
              placeholder="Kategori Seçiniz"
            >
              <Option value="pending">🕒 Bekleyen Siparişler</Option>
              <Option value="preparing">🛠 Hazırlanıyor</Option>
              <Option value="shipping">🚚 Teslimatta</Option>
              <Option value="delivered">📦 Teslim Edildi</Option>
              <Option value="cancelled">❌ İptal/İade Edilen Siparişler</Option>
            </Select>
          </div>

          <Table
            columns={generateColumns(selectedCategory)}
            dataSource={currentData}
            loading={loading}
            rowKey={(record) => record.id}
            expandable={{ expandedRowRender }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: currentData.length,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
            onChange={handlePaginationChange}
            bordered
            locale={{ emptyText: "Bu kategoriye ait sipariş yok" }}
          />
        </div>
        <Footer>
          <div
            className="pagination-inside-footer"
            style={{ marginTop: 370, marginLeft: collapsed ? 80 : 180 }}
          >
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

// Wrap the component with App provider
const OrderListWithApp = () => (
  <App>
    <OrderList />
  </App>
);

export default OrderListWithApp;
