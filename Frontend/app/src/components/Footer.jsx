import React from "react";
import { Layout } from "antd";
import "../css/Footer.css";

const { Footer } = Layout;

const FooterComponent = () => (
  <Footer className="site-layout-footer">
    Ant Design ©{new Date().getFullYear()} Created by Ant UED
  </Footer>
);

export default FooterComponent;
