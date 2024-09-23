import React from "react";
import { Form, Input, Button, Checkbox } from "antd"; // Ant Design'dan Form bileşenlerini import edin
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // Ant Design ikonu
import "antd/dist/reset.css"; // Ant Design stillerini import edin

const LoginForm = () => {
  const onFinish = (values) => {
    console.log("Success:", values); // Form submit başarılı olduğunda yapılacak işlem
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo); // Form submit başarısız olduğunda yapılacak işlem
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
          ]} // Validation için kurallar
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />} // Kullanıcı adı ikonu
            placeholder="Kullanıcı Adı"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]} // Validation için kurallar
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />} // Şifre ikonu
            placeholder="Şifre"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
