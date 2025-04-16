import React, { useState, useEffect } from "react";
import { Layout, Select, Button, message, Modal } from "antd";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import AdminHeader from "../../AdminComponents/AdminHeader";
import Footer from "../../components/Footer";
import "../Admin/AdminCss/DeleteProduct.css";
import {
  getAllProducts,
  deleteProduct,
} from "../../services/ProductService/AdminProductService";

const DeleteProductContent = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts || []);
      } catch (error) {
        message.error("Ürünler yüklenirken bir hata oluştu.");
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (productId) => {
    setSelectedProductId(productId);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProductId);
      message.success("Ürün başarıyla silindi!");
      setProducts(
        products.filter((product) => product.id !== selectedProductId)
      );
      setSelectedProductId(null);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Ürün silinirken bir hata oluştu.");
    }
  };

  const showModal = () => {
    if (!selectedProductId) {
      message.warning("Lütfen silmek için bir ürün seçin.");
      return;
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <AdminSidebar />
      <Layout className="delete-product-layout">
        <AdminHeader />
        <div className="delete-product-container">
          <h1>Ürün Silme Paneli</h1>
          <div className="product-selector">
            <Select
              style={{ width: "100%" }}
              placeholder="Silmek istediğiniz ürünü seçin"
              onChange={handleProductChange}
              options={products.map((product) => ({
                label: product.name,
                value: product.id,
              }))}
            />
          </div>
          <Button
            type="danger"
            onClick={showModal}
            disabled={!selectedProductId}
            style={{ marginTop: "20px" }}
          >
            Ürünü Sil
          </Button>
          <Modal
            title="Ürünü Sil"
            visible={isModalVisible}
            onOk={handleDeleteProduct}
            onCancel={handleCancel}
            okText="Evet, Sil"
            cancelText="İptal"
          >
            <p>Bu ürünü silmek istediğinizden emin misiniz?</p>
          </Modal>
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default DeleteProductContent;
