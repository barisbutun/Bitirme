import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ProfileSettings from "../components/ProfileSettings";
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
            <Descriptions.Item label="Name"></Descriptions.Item>
            <Descriptions.Item label="Email"></Descriptions.Item>
            <Descriptions.Item label="Phone"></Descriptions.Item>
            <Descriptions.Item label="Adress"></Descriptions.Item>
          </Descriptions>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Activity" key="1">
              {/* son yapılan aktiviteler gösterilecek */}
            </TabPane>

            <TabPane tab="Settings" key="2">
              <ProfileSettings />
            </TabPane>

            <TabPane tab="Favorites" key="3">
              <Link to="/Favorites"></Link>
            </TabPane>
          </Tabs>
        </Card>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Profile;
