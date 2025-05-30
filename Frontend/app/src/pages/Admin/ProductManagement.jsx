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
  Table,
  Tag,
  InputNumber,
  AutoComplete,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  UploadOutlined,
  HomeOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  getAllProducts,
  createProduct,
  uploadProductImage,
  Categories,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService/AdminProductService";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import ProductListModal from "../../AdminComponents/ProductListModal";
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
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [productDataOverTimes, setProductDataOverTime] = useState([
    {
      name: "İnce Uzun Desenli Bluz",
      favori: 245,
      satış: 180,
      değerlendirme: 95,
      toplam: 520,
    },
    {
      name: "Kısa Kollu Tişört",
      favori: 210,
      satış: 165,
      değerlendirme: 85,
      toplam: 460,
    },
    {
      name: "Yüksek Bel Jean",
      favori: 195,
      satış: 150,
      değerlendirme: 75,
      toplam: 420,
    },
    {
      name: "Oversize Sweatshirt",
      favori: 180,
      satış: 140,
      değerlendirme: 70,
      toplam: 390,
    },
    {
      name: "Mini Etek",
      favori: 170,
      satış: 130,
      değerlendirme: 65,
      toplam: 365,
    },
    {
      name: "Crop Blazer",
      favori: 160,
      satış: 120,
      değerlendirme: 60,
      toplam: 340,
    },
    {
      name: "Yüksek Bel Pantolon",
      favori: 150,
      satış: 110,
      değerlendirme: 55,
      toplam: 315,
    },
    {
      name: "Oversize Gömlek",
      favori: 140,
      satış: 100,
      değerlendirme: 50,
      toplam: 290,
    },
    {
      name: "Mini Elbise",
      favori: 130,
      satış: 90,
      değerlendirme: 45,
      toplam: 265,
    },
    {
      name: "Crop Tişört",
      favori: 120,
      satış: 80,
      değerlendirme: 40,
      toplam: 240,
    },
  ]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  //ürün listeleme modalını açmak için
  const openProductModal = () => {
    setIsModalOpen(true);
  };
  //ürün aramak için
  const handleSearch = async (value) => {
    const response = await fetch(
      "http://localhost:8082/api/productElastic/v1/autocomplete",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      }
    );
    const data = await response.json();

    // gelen veri dizi mi kontrol et
    if (Array.isArray(data)) {
      setProductOptions(data);
    } else {
      setProductOptions([]); // boş array ata, map hatasını engelle
      console.error("API'den beklenmeyen veri geldi:", data);
    }
  };

  const handleSelect = (selectedProduct) => {
    setSelectedProduct(selectedProduct); // Güncellenen ürünü seç
    form.setFieldsValue({
      productName: selectedProduct.name,
      description: selectedProduct.description,
      price: selectedProduct.price,
      quantity: selectedProduct.quantity,
      category: selectedProduct.category?.id,
      // Diğer alanlar varsa ekle
    });
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8082/api/product/v1/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const products = response.data;
      const categories = await Categories();

      const productsWithCategory = products.map((product) => ({
        ...product,
        category: categories.find((cat) => cat.id === product.category_id) || {
          name: "Kategori Yok",
        },
      }));

      const categoryCount = {};
      productsWithCategory.forEach((product) => {
        const categoryName = product.category.name || "Kategori Yok";
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      });
      const categoryData = Object.keys(categoryCount).map((key) => ({
        name: key,
        value: categoryCount[key],
      }));
      setCategoryDistribution(categoryData);

      setAllProducts(productsWithCategory);
    } catch (err) {
      console.error("Tüm ürünleri çekme hatası:", err);
    }
  };
  //ürün sayısın çekmek için kullanılan fetch
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
          quantity: values.quantity,
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
          quantity: values.quantity,
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
      icon: (
        <PlusOutlined style={{ ...iconStyle, color: "#52c41a", width: 280 }} />
      ),
      onClick: () => openDrawer("add"),
    },
    {
      title: "Ürün Güncelle",
      icon: (
        <EditOutlined style={{ ...iconStyle, color: "#1890ff", width: 280 }} />
      ),
      onClick: () => openDrawer("edit"),
    },
    {
      title: "Ürün Sil",
      icon: (
        <DeleteOutlined
          style={{ ...iconStyle, color: "#ff4d4f", width: 280 }}
        />
      ),
      onClick: () => setDeleteModalOpen(true),
    },
    {
      title: "Stok Durumu",
      icon: (
        <ShoppingOutlined
          style={{ ...iconStyle, color: "#faad14", width: 280 }}
        />
      ),
      onClick: () => setStockModalOpen(true),
    },
    {
      title: "Ürünler",
      icon: (
        <UnorderedListOutlined
          style={{ ...iconStyle, color: "#13c2c2", width: 280 }}
        />
      ),
      onClick: openProductModal,
    },
  ];

  // Stok durumu için tablo
  const columns = [
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Stok",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => {
        if (!quantity) return "Bilinmiyor";

        return Object.entries(quantity).map(([size, count]) => (
          <Tag
            color={count < 20 ? "red" : count < 100 ? "orange" : "green"}
            key={size}
          >
            {size}: {count}
          </Tag>
        ));
      },
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (category) => category?.name || "Kategori Yok",
    },
  ];

  return (
    <div
      style={{
        padding: "50px",
        marginLeft: "48px",
      }}
    >
      <Title level={3}>🏷️ Ürün Yönetimi</Title>

      <Button
        type="link"
        icon={<HomeOutlined />}
        style={{ position: "absolute", right: 30, top: 30 }}
        onClick={() => navigate("/admin")}
      >
        Anasayfaya Dön
      </Button>

      <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Statistic
            title="Toplam Ürün Sayısı"
            value={productCount}
            style={{ textAlign: "center" }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: "48px" }}>
        <Col xs={24} md={12}>
          <Card
            title="En Popüler 10 Ürün Performansı"
            style={{ borderRadius: "16px", height: 400 }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productDataOverTimes} margin={{ bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-60}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="favori"
                  name="Favori Sayısı"
                  fill="#8884d8"
                  stackId="a"
                />
                <Bar
                  dataKey="satış"
                  name="Satış Sayısı"
                  fill="#82ca9d"
                  stackId="a"
                />
                <Bar
                  dataKey="değerlendirme"
                  name="Değerlendirme Sayısı"
                  fill="#ffc658"
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card
            title="Kategori Dağılımı (Pie Chart)"
            style={{ borderRadius: "16px", marginLeft: 55 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ paddingTop: "20px" }}>
        {actionCards.map((card, index) => (
          <Col key={index} span={6.9}>
            <Card hoverable style={cardStyle} onClick={card.onClick}>
              {card.icon}
              <Title level={4}>{card.title}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={drawerType === "add" ? "Ürün Ekle" : "Ürün Güncelle"}
        placement="bottom"
        open={drawerOpen}
        onCancel={() => setDrawerOpen(false)}
        footer={null}
        width="40%"
        height="100%"
        style={{
          overflow: "auto",
          paddingBottom: "10px",
          top: "10px",
        }}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {drawerType === "edit" && (
            <Form.Item label="Güncellenecek Ürün">
              <AutoComplete
                style={{ width: "100%" }}
                placeholder="Ürün adı yazın..."
                onSearch={handleSearch}
                onSelect={(value, option) => handleSelect(option.product)}
                options={
                  Array.isArray(productOptions)
                    ? productOptions.map((product) => ({
                        value: product.name,
                        label: product.name,
                        product,
                      }))
                    : []
                }
              />
            </Form.Item>
          )}

          <Form.Item
            name="productName"
            label="Ürün Adı"
            rules={[{ required: true, message: "Ürün adı giriniz" }]}
          >
            <Input placeholder="Örn: bluz" />
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

          <Form.Item label="Stok">
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="XS"
                    name={["quantity", "XS"]}
                    rules={[{ required: true, message: "XS bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="S"
                    name={["quantity", "S"]}
                    rules={[{ required: true, message: "S bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="M"
                    name={["quantity", "M"]}
                    rules={[{ required: true, message: "M bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="L"
                    name={["quantity", "L"]}
                    rules={[{ required: true, message: "L bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="XL"
                    name={["quantity", "XL"]}
                    rules={[{ required: true, message: "XL bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="XXL"
                    name={["quantity", "XXL"]}
                    rules={[{ required: true, message: "XXL bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form.Item>

          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: "Kategori seçiniz" }]}
          >
            <Select placeholder="Kategori Seçin" style={{ width: "100%" }}>
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
      </Modal>

      <Modal
        title="Ürün Silme"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        width="50%"
        style={{ top: 200 }}
      >
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "#ff4d4f" }}>
            <DeleteOutlined style={{ fontSize: 24, marginRight: 8 }} />
            Silmek Üzeresiniz
          </h3>
          <p>
            Bu işlemi geri alamazsınız. {selectedProduct?.name} ürününü silmek
            istediğinizden emin misiniz?
          </p>
          <Select
            placeholder="Silinecek ürünü seçin"
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(id) =>
              setSelectedProduct(allProducts.find((p) => p.id === id))
            }
          >
            {allProducts.map((product) => (
              <Select.Option key={product.id} value={product.id}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button
              type="default"
              style={{
                width: "48%",
                backgroundColor: "#f5f5f5",
                borderColor: "#d9d9d9",
              }}
              onClick={() => setDeleteModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="default"
              icon={<DeleteOutlined />}
              style={{
                width: "48%",
                backgroundColor: "#f5f5f5",
                borderColor: "#d9d9d9",
                color: "#ff4d4f",
              }}
              onClick={() => handleDeleteProduct(selectedProduct?.id)}
            >
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Stok Durumu"
        open={stockModalOpen}
        onCancel={() => setStockModalOpen(false)}
        footer={null}
        width="80%"
      >
        <Table
          columns={columns}
          dataSource={allProducts}
          rowKey="id"
          pagination={false}
          bordered
          size="middle"
        />
      </Modal>
      <ProductListModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={allProducts}
      />
    </div>
  );
};

export default AdminDashboard;
