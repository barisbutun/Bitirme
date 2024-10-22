import React, { useState } from "react";
import { Form, Input, Button, Upload, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "../css/ProfileSettings.css";
const ProfileSettings = () => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null); // Avatar durumunu saklamak için

  const handleFinish = async (values) => {
    console.log("Form values:", values);
    notification.success({
      message: "Başarıyla Güncellendi",
      description: "Bilgileriniz başarıyla güncellendi!",
    });
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    if (avatar) {
      formData.append("avatar", avatar); // Avatar dosyasını ekle
    }

    try {
      const response = await axios.put("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // FormData gönderirken bu header'ı eklemelisiniz
        },
      });

      if (response.status === 200) {
        notification.success({
          message: "Başarıyla Güncellendi",
          description: "Bilgileriniz başarıyla güncellendi!",
        });
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      notification.error({
        message: "Güncelleme Hatası",
        description: "Bilgilerinizi güncellerken bir hata oluştu.",
      });
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      setAvatar(info.file.response.url); // Avatar URL'sini güncelle
    }
  };

  return (
    <div className="profile-form-container">
      <Form
        form={form}
        name="profile-settings"
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: "",
          email: "",
          phone: "",
          address: "",
        }}
      >
        <Form.Item label="Avatar">
          <Upload
            name="avatar"
            showUploadList={false}
            action="/upload" // Avatar yükleme URL'si
            onChange={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />}>Avatar Yükle</Button>
          </Upload>
          {avatar && (
            <img
              className="useravatar"
              src={avatar}
              alt="Avatar"
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )}
        </Form.Item>

        <Form.Item
          className="userinfo"
          label="İsim"
          name="name"
          rules={[{ required: true, message: "Lütfen isminizi girin!" }]}
        >
          <Input placeholder="İsim" />
        </Form.Item>

        <Form.Item
          className="userinfo"
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Lütfen email adresinizi girin!" },
            { type: "email", message: "Geçerli bir email adresi girin!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          className="userinfo"
          label="Telefon Numarası"
          name="phone"
          rules={[
            { required: true, message: "Lütfen telefon numaranızı girin!" },
          ]}
        >
          <Input placeholder="Telefon Numarası" />
        </Form.Item>

        <Form.Item
          className="userinfo"
          label="Adres"
          name="address"
          rules={[{ required: true, message: "Lütfen adresinizi girin!" }]}
        >
          <Input.TextArea placeholder="Adres" rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Güncelle
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileSettings;
