import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Drawer,
  Button,
  Form,
  Input,
  message,
  Upload,
  Select,
  Statistic,
  Modal,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  UploadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  createProduct,
  uploadProductImage,
  Categories,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService/AdminProductService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const cardStyle = {
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "0.3s",
  textAlign: "center",
};

const iconStyle = {
  fontSize: "36px",
  marginBottom: 12,
};

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [drawerType, setDrawerType] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const page = 0;
      const size = 100;
      const res = await axios.get(
        `http://localhost:8082/api/product/v1/home?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllProducts(res.data.content);
    } catch (err) {
      console.error("Tüm ürünleri çekme hatası:", err);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const products = await axios.get(
        "http://localhost:8082/api/admin/v1/product/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductCount(products.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await Categories();
      setCategories(res || []);
    } catch (err) {
      message.error("Kategori bilgileri alınamadı");
    }
  };

  const openDrawer = (type) => {
    setDrawerType(type);
    setDrawerOpen(true);
    form.resetFields();
    setFileList([]);
    fetchCategories();
    fetchAllProducts();
  };

  const handleFileChange = ({ file, fileList: newFileList }) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Sadece görüntü dosyaları yüklenebilir!");
      return;
    }
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    try {
      if (drawerType === "add") {
        const productData = {
          name: values.productName,
          description: values.description,
          price: parseFloat(values.price),
          quantity: parseInt(values.quantity, 10),
          category_id: parseInt(values.category),
        };
        const created = await createProduct(productData);

        for (const file of fileList) {
          await uploadProductImage(created.id, file.originFileObj);
        }

        message.success("Ürün ve resimler başarıyla eklendi!");
      } else if (drawerType === "edit" && selectedProduct) {
        const updatedProductData = {
          name: values.productName,
          description: values.description,
          price: parseFloat(values.price),
          quantity: parseInt(values.quantity, 10),
          category_id: parseInt(values.category),
        };
        await updateProduct(selectedProduct.id, updatedProductData);

        for (const file of fileList) {
          await uploadProductImage(selectedProduct.id, file.originFileObj);
        }

        message.success("Ürün başarıyla güncellendi!");
      }

      form.resetFields();
      setFileList([]);
      setSelectedProduct(null);
      setDrawerOpen(false);
      fetchData();
      fetchAllProducts();
    } catch (error) {
      message.error(
        "Ekleme veya güncelleme sırasında hata oluştu: " + error.message
      );
    }
  };

  const handleProductSelect = (value) => {
    const product = allProducts.find((p) => p.id === value);
    if (product) {
      setSelectedProduct(product);
      form.setFieldsValue({
        productName: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category?.id,
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      message.success("Ürün başarıyla silindi!");
      setDeleteModalOpen(false);
      fetchData();
      fetchAllProducts();
    } catch (error) {
      message.error("Ürün silinirken hata oluştu!");
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <Spin size="large" style={{ margin: "100px auto", display: "block" }} />
    );
  }

  const actionCards = [
    {
      title: "Ürün Ekle",
      icon: <PlusOutlined style={{ ...iconStyle, color: "#52c41a" }} />,
      onClick: () => openDrawer("add"),
    },
    {
      title: "Ürün Güncelle",
      icon: <EditOutlined style={{ ...iconStyle, color: "#1890ff" }} />,
      onClick: () => openDrawer("edit"),
    },
    {
      title: "Ürün Sil",
      icon: <DeleteOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />,
      onClick: () => setDeleteModalOpen(true),
    },
    {
      title: "Stok Durumu",
      icon: <ShoppingOutlined style={{ ...iconStyle, color: "#faad14" }} />,
      onClick: () => setStockModalOpen(true),
    },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2}>Ürün İşlemleri</Title>

      <Button
        type="link"
        icon={<HomeOutlined />}
        style={{ position: "absolute", right: 30, top: 30 }}
        onClick={() => navigate("/admin")}
      >
        Anasayfaya Dön
      </Button>

      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <Statistic
            title="Toplam Ürün Sayısı"
            value={productCount}
            style={{ textAlign: "center" }}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {actionCards.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card hoverable style={cardStyle} onClick={card.onClick}>
              {card.icon}
              <Title level={4}>{card.title}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={drawerType === "add" ? "Ürün Ekle" : "Ürün Güncelle"}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {drawerType === "edit" && (
            <Form.Item label="Güncellenecek Ürün">
              <Select
                placeholder="Bir ürün seçin"
                onChange={handleProductSelect}
                value={selectedProduct?.id || undefined}
              >
                {allProducts.map((product) => (
                  <Select.Option key={product.id} value={product.id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="productName"
            label="Ürün Adı"
            rules={[{ required: true, message: "Ürün adı giriniz" }]}
          >
            <Input placeholder="Örn: Laptop" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: "Açıklama giriniz" }]}
          >
            <Input placeholder="Ürün açıklaması" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Fiyat"
            rules={[{ required: true, message: "Fiyat giriniz" }]}
          >
            <Input type="number" placeholder="Fiyat" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Stok"
            rules={[{ required: true, message: "Stok sayısı giriniz" }]}
          >
            <Input type="number" placeholder="Stok" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: "Kategori seçiniz" }]}
          >
            <Select placeholder="Kategori Seçin">
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Resim Yükle">
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={fileList}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Resim Seç</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {drawerType === "add" ? "Ürünü Kaydet" : "Ürünü Güncelle"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Ürün Sil"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
      >
        <Select
          placeholder="Silinecek ürünü seçin"
          style={{ width: "100%" }}
          onChange={(id) => handleDeleteProduct(id)}
        >
          {allProducts.map((product) => (
            <Select.Option key={product.id} value={product.id}>
              {product.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>

      <Modal
        title="Stok Durumu"
        open={stockModalOpen}
        onCancel={() => setStockModalOpen(false)}
        footer={null}
      >
        <ul>
          {allProducts.map((product) => (
            <li key={product.id}>
              {product.name} - Stok: {product.quantity}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
