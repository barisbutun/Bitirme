import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import { getAllUsers } from "../services/UserService/AdminUserService";
import "../pages/Admin/AdminCss/UserComponent.css";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Kullanıcıları veritabanından çekme
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error("Kullanıcılar yüklenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Component ilk yüklendiğinde kullanıcıları al
  }, []);

  // Tablo kolonları
  const columns = [
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kullanıcı Adı",
      dataIndex: "user_name",
      key: "userName",
    },
    {
      title: "E-posta",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Adres",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <div className="user-add-container">
      <Table
        className="user-table"
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey={(record) => record.id || record.email || record.index}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AddUser;
