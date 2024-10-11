import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Layout, Avatar, Card, Descriptions, Tabs } from "antd";
import "../css/Profile.css";

const { TabPane } = Tabs;

const Profile = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="Profile-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Card>
          <Avatar src="" />
          <Descriptions title="User Profile" bordered>
            <Descriptions.Item label="Username"></Descriptions.Item>
            <Descriptions.Item label="Email"></Descriptions.Item>
            <Descriptions.Item label="Phone"></Descriptions.Item>
            <Descriptions.Item label="Adress"></Descriptions.Item>
          </Descriptions>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Activity" key="1">
              {/* son yapılan aktiviteler gösterilecek */}
            </TabPane>

            <TabPane tab="Settings" key="2">
              {/* kullanıcı ayarları gösterilecek */}
            </TabPane>
          </Tabs>
        </Card>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Profile;
