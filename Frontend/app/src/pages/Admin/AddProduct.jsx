import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Upload,
  Select,
  message,
  Steps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../../pages/Admin/AdminCss/AddProductContent.css";
import {
  addCategory,
  createProduct,
  Categories,
  uploadProductImage,
  updateProduct,
} from "../../services/ProductService/AdminProductService";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import AdminHeader from "../../AdminComponents/AdminHeader";
import Footer from "../../components/Footer";
import "../User/UserCss/Homepage.css";
import FilterComponent from "../../components/FilterComponent";

const AddProductContent = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [tempProductData, setTempProductData] = useState(null);
  const [productId, setProductId] = useState(null); // Ürün ID'sini saklamak için bir state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const handleApplyFilter = (category) => {
    if (category) {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

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

  useEffect(() => {
    // LocalStorage'den ürün verisini al
    const savedProductData = JSON.parse(localStorage.getItem("productData"));
    if (savedProductData) {
      setTempProductData(savedProductData);
      setProductId(savedProductData.id);
      setFileList(savedProductData.images || []);
      setCurrentStep(2); // Eğer ürün verisi varsa, resim yükleme adımına geç
    }
  }, []);

  useEffect(() => {
    // Sayfa yeniden yüklendiğinde veya işlemler tamamlandığında formu sıfırlamak
    return () => {
      setTempProductData(null); // Geçici veriyi temizle
      setProductId(null); // Ürün ID'sini sıfırla
      setFileList([]); // Yüklenen dosyaları sıfırla
      form.resetFields(); // Formu sıfırla
      setCurrentStep(1); // Başlangıç adımına dön
    };
  }, []);

  const handleProductSubmit = async (values) => {
    if (
      !values.description ||
      !values.productName ||
      !values.price ||
      !values.category ||
      !values.quantity
    ) {
      message.error("Lütfen tüm alanları doldurduğunuzdan emin olun.");
      return;
    }

    const productData = {
      description: values.description,
      name: values.productName,
      price: parseFloat(values.price),
      category_id: parseInt(values.category, 10),
      quantity: parseInt(values.quantity, 10),
    };

    try {
      // Ürün bilgilerini kaydet ve ürün ID'sini al
      const createdProduct = await createProduct(productData);
      const productId = createdProduct.id;

      message.success("Ürün bilgileri başarıyla kaydedildi!");
      setProductId(productId); // Ürün ID'sini sakla
      setTempProductData({ ...productData, id: productId }); // Geçici veri
      setCurrentStep(2); // Resim yükleme adımına geç
    } catch (error) {
      message.error("Ürün kaydedilirken bir hata oluştu: " + error.message);
    }
  };

  const handleImageUpload = async () => {
    if (!fileList.length) {
      message.error("Lütfen en az bir resim seçin.");
      return;
    }

    try {
      const uploadedImages = [];
      for (const file of fileList) {
        try {
          const result = await uploadProductImage(
            productId,
            file.originFileObj
          );
          uploadedImages.push(result.imagePath || "uploaded_image_path");
        } catch (error) {
          message.error(`Bir resim yüklenirken hata oluştu: ${error.message}`);
        }
      }

      // Resim bilgilerini mevcut ürün bilgilerine ekle
      const updatedProduct = {
        ...tempProductData,
        images: uploadedImages,
      };

      await updateProduct(productId, updatedProduct);
      setTempProductData(null); // Geçici veri temizle
      setFileList([]); // Yüklenen dosyaları sıfırla
      setProductId(null); // Ürün ID'sini sıfırla
      form.resetFields(); // Formu sıfırla
      message.success("Resimler ve ürün bilgileri başarıyla güncellendi!");
      setCurrentStep(1); // Başlangıç adımına dön
    } catch (error) {
      message.error("Resim yüklenirken bir hata oluştu: " + error.message);
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

  const steps = [{ title: "Ürün Bilgileri" }, { title: "Resim Yükleme" }];

  return (
    <Layout>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="homepage-layout">
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed}>
          <FilterComponent onApplyFilter={handleApplyFilter} />
        </AdminHeader>
        <div className="urun-ekle-container">
          <h1>Ürün Ekleme Paneli</h1>
          <Steps current={currentStep - 1} style={{ marginBottom: "24px" }}>
            {steps.map((step, index) => (
              <Steps.Step key={index} title={step.title} />
            ))}
          </Steps>

          {currentStep === 1 && (
            <Form
              onFinish={handleProductSubmit}
              form={form}
              className="form-product"
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
                label="Ürün miktarı"
                rules={[{ required: true, message: "Ürün miktarını giriniz!" }]}
              >
                <Input placeholder="Ürün Miktar" />
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
                  Ürünü Kaydet
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 2 && (
            <div>
              <Upload
                beforeUpload={() => false}
                onChange={handleFileChange}
                fileList={fileList}
                listType="picture-card"
              >
                <div>
                  <UploadOutlined />
                  <div className="ant-upload-text">Resim Yükle</div>
                </div>
              </Upload>
              <Button
                type="primary"
                onClick={handleImageUpload}
                style={{ marginTop: "16px" }}
              >
                Resimleri Yükle
              </Button>
            </div>
          )}
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default AddProductContent;
