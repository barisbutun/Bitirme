import React, { useState, useEffect } from "react";
import { Button, Input, Select, Form } from "antd";
import { ProductCategories } from "../services/ProductService/ProductService";

const { Option } = Select;

const FilterComponent = ({ onApplyFilter }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    ProductCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Kategoriler alınırken hata oluştu:", error);
      });
  }, []);

  const onFinish = (values) => {
    onApplyFilter({
      category: values.category || [],
      minPrice: values.minPrice || null,
      maxPrice: values.maxPrice || null,
      page: values.page || 0,
      size: values.size || 12,
      sortBy: values.sortBy || "asc",
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ page: 0, size: 12, sortBy: "asc" }}
    >
      <Form.Item name="category" label="Kategori">
        <Select mode="multiple" placeholder="Kategori seçin" allowClear>
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.name}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="minPrice" label="Min Fiyat">
        <Input type="number" placeholder="Minimum fiyat" />
      </Form.Item>

      <Form.Item name="maxPrice" label="Max Fiyat">
        <Input type="number" placeholder="Maksimum fiyat" />
      </Form.Item>

      <Form.Item name="page" label="Sayfa Numarası">
        <Input type="number" min={0} placeholder="Sayfa numarası" />
      </Form.Item>

      <Form.Item name="size" label="Sayfa Boyutu">
        <Input type="number" min={1} placeholder="Sayfa başına ürün sayısı" />
      </Form.Item>

      <Form.Item name="sortBy" label="Sıralama">
        <Select>
          <Option value="asc">Artan</Option>
          <Option value="desc">Azalan</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Filtrele
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FilterComponent;
