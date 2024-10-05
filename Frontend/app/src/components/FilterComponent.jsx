import React, { useState } from "react";
import { Select, Button, Row, Col } from "antd";
import "../css/FilterComponent.css";

const { Option } = Select;

const FilterComponent = ({ onApplyFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Kategori değiştirme
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedCategory);
  };

  return (
    <div className="filter-container">
      <Row gutter={16}>
        <Col span={24}>
          <h3 className="filter-title">Kategori</h3>
          <Select
            placeholder="Kategori Seçin"
            className="filter-select"
            onChange={handleCategoryChange}
            allowClear
          >
            <Option value="Akıllı Telefon">Akıllı Telefon</Option>
            <Option value="Dizüstü Bilgisayar">Dizüstü Bilgisayar</Option>
            <Option value="Kablosuz Kulaklık">Kablosuz Kulaklık</Option>
            <Option value="Akıllı Saat">Akıllı Saat</Option>
            <Option value="4K Televizyon">4K Televizyon</Option>
          </Select>
          <Button onClick={handleApplyFilter} style={{ marginTop: "10px" }}>
            Uygula
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FilterComponent;
