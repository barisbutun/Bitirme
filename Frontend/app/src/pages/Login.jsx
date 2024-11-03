import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Col, Row, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/UserService/AuthService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { decodeToken } from "../utils/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const token = localStorage.getItem("token");

  //     const response = await fetch("http://localhost:8082/api/auth/v1/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setMessage("Giriş başarılı!");
  //       navigate("/Homepage");
  //       // Eğer JWT token dönerse, localStorage'a kaydedebiliriz
  //       if (data.token) {
  //         localStorage.setItem("token", data.token);
  //       }
  //     } else {
  //       setMessage(`Giriş başarısız: ${data.message}`);
  //     }
  //   } catch (error) {
  //     setMessage("Giriş sırasında bir hata oluştu.");
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await login(email, password, setMessage, navigate);
      if (response && response.token) {
        // response varsa ve token içeriyorsa
        const userData = decodeToken(response.token);
        if (userData) {
          console.log("Kullanıcı Bilgileri:", userData);
          navigate("/Homepage");
        } else {
          setMessage("Token çözümleme sırasında bir hata oluştu.");
        }
      } else {
        console.error(
          "Login failed:",
          response ? response.message : "Yanıt boş."
        );
        setMessage("Giriş sırasında beklenmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Giriş sırasında bir hata oluştu.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      if (response.token) {
        console.log("Google login successful");
        // Redirect to the dashboard or homepage
      } else {
        console.error("Google login failed:", response.message);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  //captcha oluşturma fonksiyonu
  function generateCaptcha() {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captchaLength = 6;
    let captchaCode = "";
    for (let i = 0; i < captchaLength; i++) {
      let randomIndex = Math.floor(Math.random() * chars.length);
      captchaCode += chars[randomIndex];
    }
    return captchaCode;
  }

  //captcha yenileme fonksiyonu
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const onFinish = (values) => {
    if (userCaptcha === captcha) {
      console.log("Başarılı doğrulama!");

      handleLogin();
    } else {
      console.log("Captcha doğrulaması başarısız!");
    }
  };

  // Form submit başarısız olduğunda tetiklenen fonksiyon
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login ">
      <Form
        name="login-form"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <Form.Item
          label="Güvenlik Kodu"
          extra="Bir insan olduğunuzdan emin olmalıyız."
        >
          <Row gutter={8} className="captcha-container">
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Lütfen güvenlik kodunu giriniz!",
                  },
                ]}
              >
                <Input
                  className="captcha-input"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={30}>
              <Typography.Text strong>{captcha}</Typography.Text>
            </Col>
            <Button className="captcha-button" onClick={refreshCaptcha}>
              Captcha Al
            </Button>
          </Row>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleLogin} htmlType="submit" block>
            Giriş Yap
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to={"/SignUp"}> Hesabınız yok mu?</Link>
        </Form.Item>
        <Form.Item>
          <GoogleOAuthProvider clientId="686213888927-jahnrgm8590h9hkobg59efdvqiljkrtv.apps.googleusercontent.com ">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google login failed");
              }}
            />
          </GoogleOAuthProvider>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
