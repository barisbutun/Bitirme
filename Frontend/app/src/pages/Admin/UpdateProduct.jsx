import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, Select, message, Steps } from "antd";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../Admin/AdminCss/UpdateProduct.css";
import {
  getProductById,
  updateProduct,
  Categories,
} from "../../services/ProductService/AdminProductService";

const UpdateProductContent = ({ id }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!id) {
      //   message.error("Ürün ID bilgisi eksik. Güncelleme yapılamaz.");
      return;
    }
    const fetchCategoriesAndProduct = async () => {
      try {
        const fetchedCategories = await Categories();
        setCategories(fetchedCategories || []);

        const fetchedProduct = await getProductById(id);
        setProductData(fetchedProduct);
        form.setFieldsValue({
          productName: fetchedProduct.name,
          description: fetchedProduct.description,
          price: fetchedProduct.price,
          stockState: fetchedProduct.stock_state,
          category: fetchedProduct.category_id,
          quantity: fetchedProduct.quantity,
        });
      } catch (error) {
        message.error("Veriler yüklenirken bir hata oluştu.");
      }
    };
    fetchCategoriesAndProduct();
  }, [id, form]);

  const handleUpdateProduct = async (values) => {
    if (!id) {
      //   message.error("Ürün bilgisi bulunamadı.");
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
      await updateProduct(id, updatedProduct);
      message.success("Ürün başarıyla güncellendi!");
    } catch (error) {
      //   message.error("Ürün güncellenirken bir hata oluştu: " + error.message);
    }
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
                <Select.Option value="IN_STOCK">Stokta Var</Select.Option>
                <Select.Option value="OUT_OF_STOCK">Stokta Yok</Select.Option>
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
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleUpdateProduct}
              >
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
