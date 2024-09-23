import React from "react";
import { Layout, theme } from "antd";
import "../css/Header.css";

const { Header } = Layout;

const HeaderComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      className="site-layout-header"
      style={{ background: colorBgContainer }}
    />
  );
};

export default HeaderComponent;
