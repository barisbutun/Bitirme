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
  updateProduct, // Ürün güncelleme fonksiyonu
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
  const [selectedProduct, setSelectedProduct] = useState(null); // Seçilen ürün
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const products = await axios.get(
        "http://localhost:8082/api/product/v1/home"
      );
      setProductCount(products.data.length);
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

  const openDrawer = (type, product = null) => {
    setDrawerType(type);
    setSelectedProduct(product); // Güncelleme için seçilen ürün
    setDrawerOpen(true);
    form.resetFields();
    setFileList([]);
    fetchCategories();
    if (type === "edit" && product) {
      // Ürün güncelleme için formu doldur
      form.setFieldsValue({
        productName: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category.id,
      });
    }
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
        // 1. Ürünü oluştur
        const productData = {
          name: values.productName,
          description: values.description,
          price: parseFloat(values.price),
          quantity: parseInt(values.quantity, 10),
          category_id: parseInt(values.category),
        };
        const created = await createProduct(productData);

        // 2. Resimleri yükle
        for (const file of fileList) {
          await uploadProductImage(created.id, file.originFileObj);
        }

        message.success("Ürün ve resimler başarıyla eklendi!");
        form.resetFields();
        setFileList([]);
        setDrawerOpen(false);
        fetchData(); // Ürün sayısını güncelle
      } else if (drawerType === "edit" && selectedProduct) {
        // 1. Ürünü güncelle
        const updatedProductData = {
          name: values.productName,
          description: values.description,
          price: parseFloat(values.price),
          quantity: parseInt(values.quantity, 10),
          category_id: parseInt(values.category),
        };

        await updateProduct(selectedProduct.id, updatedProductData);

        // 2. Resimleri yükle (Eğer yeni resimler varsa)
        for (const file of fileList) {
          await uploadProductImage(selectedProduct.id, file.originFileObj);
        }

        message.success("Ürün başarıyla güncellendi!");
        form.resetFields();
        setFileList([]);
        setDrawerOpen(false);
        fetchData(); // Ürün sayısını güncelle
      }
    } catch (error) {
      message.error(
        "Ekleme veya güncelleme sırasında hata oluştu: " + error.message
      );
    }
  };

  useEffect(() => {
    fetchData();
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
      onClick: () => openDrawer("delete"),
    },
    {
      title: "Stok Durumu",
      icon: <ShoppingOutlined style={{ ...iconStyle, color: "#faad14" }} />,
      onClick: () => {},
    },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2}>Ürün İşlemleri</Title>

      {/* Anasayfaya Dön Butonu */}
      <Button
        type="link"
        icon={<HomeOutlined />}
        style={{ position: "absolute", right: 30, top: 30 }}
        onClick={() => navigate("/admin")}
      >
        Anasayfaya Dön
      </Button>

      {/* Ürün Sayısı Grafik */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <Statistic
            title="Toplam Ürün Sayısı"
            value={productCount}
            style={{ textAlign: "center" }}
          />
        </Col>
      </Row>

      {/* Aksiyon Kartları */}
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

      {/* Ürün Ekleme Drawer */}
      <Drawer
        title="Ürün Ekle"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen && drawerType === "add"}
        width={400}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
              {(categories || []).map((cat) => (
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
              Ürünü Kaydet
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Ürün Güncelleme Drawer */}
      <Drawer
        title="Ürün Güncelle"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen && drawerType === "edit"}
        width={400}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
              {(categories || []).map((cat) => (
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
              Ürünü Güncelle
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminDashboard;
