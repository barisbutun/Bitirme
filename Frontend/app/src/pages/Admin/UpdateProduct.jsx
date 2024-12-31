import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  message,
  Steps,
  Modal,
} from "antd";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../Admin/AdminCss/UpdateProduct.css";
import {
  getProductById,
  updateProduct,
  Categories,
  getAllProducts,
} from "../../services/ProductService/AdminProductService";

const UpdateProductContent = ({ id }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) {
      return;
    }

    // Kategori ve ürün verilerini sırayla yükle
    const fetchCategoriesAndProduct = async () => {
      try {
        const fetchedCategories = await Categories();
        setCategories(fetchedCategories || []);

        const fetchedProduct = await getProductById(id);
        setProductData(fetchedProduct);

        // Kategori yüklendiyse, formu güncelle
        form.setFieldsValue({
          productName: fetchedProduct.name,
          description: fetchedProduct.description,
          price: fetchedProduct.price,
          stockState: fetchedProduct.stock_state,
          category: fetchedProduct.category_id || "",
          quantity: fetchedProduct.quantity,
        });
      } catch (error) {
        message.error("Veriler yüklenirken bir hata oluştu.");
      }
    };

    fetchCategoriesAndProduct();
  }, [id, form]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await Categories();
        setCategories(fetchedCategories || []);
      } catch (error) {
        message.error("Kategoriler yüklenirken bir hata oluştu.");
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Ürünleri pop-up modal içinde listeleme
  const fetchAllProducts = async () => {
    try {
      const productsList = await getAllProducts();
      setProducts(productsList);
    } catch (error) {
      message.error("Ürünler yüklenirken bir hata oluştu.");
    }
  };
  const handleSelectProduct = (product) => {
    console.log("seçilen ürün:", product);
    if (!product.id) {
      message.error("geçersiz ürün id'si");
      return;
    }

    localStorage.setItem("selectedProductId", product.id);

    form.setFieldsValue({
      productName: product.name,
      description: product.description,
      price: product.price,
      stockState: product.stock_state,
      category: product.category_id,
      quantity: product.quantity,
    });
    setProductData(product);
    setIsModalVisible(false);
  };

  const handleUpdateProduct = async (values) => {
    const productId = localStorage.getItem("selectedProductId");
    if (!productId) {
      message.error("Ürün ID'si geçersiz.");
      return;
    }

    const updatedProduct = {
      description: values.description,
      name: values.productName,
      price: parseFloat(values.price),
      stock_state: values.stockState,
      category_id: parseInt(values.category, 10),
      quantity: parseInt(values.quantity, 10),
    };

    try {
      await updateProduct(productId, updatedProduct);
      message.success("Ürün başarıyla güncellendi!");

      form.resetFields();
      localStorage.removeItem("selectedProductId");
    } catch (error) {
      message.error(error.message || "Ürün güncellenirken bir hata oluştu.");
    }
  };

  const handleOpenModal = () => {
    fetchAllProducts();
    setIsModalVisible(true);
  };

  const steps = [{ title: "Ürün Bilgileri" }];

  return (
    <Layout>
      <AdminSidebar />
      <Layout className="update-product-layout">
        <Header />
        <div className="update-product-container">
          <h1>Ürün Güncelleme Paneli</h1>
          <Steps current={currentStep - 1} style={{ marginBottom: "24px" }}>
            {steps.map((step, index) => (
              <Steps.Step key={index} title={step.title} />
            ))}
          </Steps>

          <Button type="default" onClick={handleOpenModal}>
            Ürün Seç
          </Button>

          {/* Pop-up modal */}
          <Modal
            title="Ürün Seçin"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={800}
          >
            <div className="product-list">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-item"
                  onClick={() => handleSelectProduct(product)}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                  }}
                >
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                </div>
              ))}
            </div>
          </Modal>

          <Form
            onFinish={handleUpdateProduct}
            form={form}
            className="form-update-product"
            layout="vertical"
          >
            <Form.Item
              name="productName"
              label="Ürün Adı"
              rules={[{ required: true, message: "Ürün adı giriniz!" }]}
            >
              <Input placeholder="Ürün Adı" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Ürün Açıklaması"
              rules={[
                { required: true, message: "Ürün açıklamasını giriniz!" },
              ]}
            >
              <Input placeholder="Ürün Açıklaması" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Fiyat"
              rules={[{ required: true, message: "Fiyat giriniz!" }]}
            >
              <Input type="number" placeholder="Fiyat" />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Ürün Miktarı"
              rules={[{ required: true, message: "Ürün miktarını giriniz!" }]}
            >
              <Input placeholder="Ürün Miktar" />
            </Form.Item>
            <Form.Item
              name="stockState"
              label="Stok Durumu"
              rules={[{ required: true, message: "Stok durumu seçiniz!" }]}
            >
              <Select placeholder="Stok Durumu">
                <Select.Option value="AVAILABLE">Stokta Var</Select.Option>
                <Select.Option value="UNAVAILABLE">Stokta Yok</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="category"
              label="Kategori"
              rules={[{ required: true, message: "Bir kategori seçiniz!" }]}
            >
              <Select placeholder="Mevcut Kategorilerden Birini Seçin">
                {(categories || []).map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Güncelle
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default UpdateProductContent;
