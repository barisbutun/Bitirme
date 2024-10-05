import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // JSON dosyasından kullanıcı verilerini çekme
  // useEffect(() => {
  //   fetch("/users.json")
  //     .then((response) => response.json())
  //     .then((data) => setUsers(data))
  //     .catch((error) => console.error("error fetching user data:", error));
  // }, []);

  // Giriş işlemi
  // const handleLogin = () => {
  //   const user = users.find(
  //     (user) => user.username === username && user.password === password
  //   );
  //   if (user) {
  //     navigate("/Homepage"); // Kullanıcı bilgileri doğruysa yönlendirme
  //   } else {
  //     alert("Geçersiz kullanıcı adı ve şifre");
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/Homepage");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Oturum açma sayfasında bir hata oluştu");
    }
  };

  // Form submit başarılı olduğunda tetiklenen fonksiyon
  const onFinish = () => {
    handleLogin(); // Form submit işlemi tetiklendiğinde login işlemi yapılır
  };

  // Form submit başarısız olduğunda tetiklenen fonksiyon
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <Form
        name="login_form"
        initialValues={{ remember: true }} // Varsayılan değerler
        onFinish={onFinish} // Form submit başarılı olduğunda tetiklenir
        onFinishFailed={onFinishFailed} // Form submit başarısız olduğunda tetiklenir
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Lütfen kullanıcı adınızı girin!" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />} // Kullanıcı adı ikonu
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />} // Şifre ikonu
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleLogin} htmlType="submit" block>
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
