import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProfileSettings from "../../components/ProfileSettings";
import { Layout, Avatar, Card, Descriptions, Tabs, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "../User/UserCss/Profile.css";

const Profile = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token'ı al
        if (!token) {
          setError("Giriş yapılmamış. Lütfen giriş yapın.");
          return;
        }

        const API_URL = "http://localhost:8082/api/user/v1/profile"; // Backend API URL
        console.log("API'ye istek atılıyor:", API_URL);

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `API Hatası: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Profil verisi alınırken hata oluştu:", error);
        setError("Profil bilgileri alınırken hata oluştu.");
      }
    };

    fetchUserProfile();
  }, []);
  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="Profile-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Card>
          <Avatar size={100} icon={<UserOutlined />} />
          <Descriptions title="Kullanıcı Profili" bordered>
            <Descriptions.Item label="Adı">
              {userProfile?.name || "Belirtilmemiş"}
            </Descriptions.Item>
            <Descriptions.Item label="E-posta">
              {userProfile?.email || "Belirtilmemiş"}
            </Descriptions.Item>
            <Descriptions.Item label="Telefon">
              {userProfile?.phone || "Belirtilmemiş"}
            </Descriptions.Item>
            <Descriptions.Item label="Adres">
              {userProfile?.address || "Belirtilmemiş"}
            </Descriptions.Item>
          </Descriptions>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Geçmiş Hareketler",
                children: (
                  <div>
                    <h3>Son Aktiviteler</h3>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Ayarlar",
                children: <ProfileSettings />,
              },
            ]}
          />
        </Card>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Profile;
