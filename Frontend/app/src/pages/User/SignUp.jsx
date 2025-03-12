import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Select, Spin } from "antd";
import "../User/UserCss/SignUp.css";
import { useNavigate } from "react-router-dom";
import { Register } from "../../services/UserService/AuthService";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const SignUp = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [userName, setUsername] = useState("");
  const [email, setUseremail] = useState("");
  const [password, setUserpassword] = useState("");
  const [address, setUseraddress] = useState("");
  const [phone, setUserphone] = useState("");
  const [message, setMessage] = useState("");
  // const [kode, setKode] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    setLoading(true);
    try {
      const response = await Register(
        userName,
        name,
        email,
        password,
        address,
        phone,
        navigate
      );
      if (response) {
        setMessage(" Kayıt başarılı:");
        navigate("/user/Login");
      } else {
        setMessage("Kayıt başarısız: {$data.message}");
      }
    } catch (error) {
      setMessage("Kayıt sırasında hata oluştu:");
    } finally {
      setLoading(false);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="90">+90</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <Spin spinning={false} tip="Yükleniyor...">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          initialValues={{ prefix: "90" }}
          className="form-container"
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="İsim"
            rules={[
              {
                required: true,
                message: "Lütfen isminizi giriniz.",
                whitespace: true,
              },
            ]}
            className="form-label"
          >
            <Input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="username"
            label="Kullanıcı İsmi"
            rules={[
              {
                required: true,
                message: "Lütfen isminizi giriniz.",
                whitespace: true,
              },
            ]}
            className="form-label"
          >
            <Input
              className="form-input"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-posta"
            rules={[
              { type: "email", message: "Geçerli bir e-posta değil!" },
              { required: true, message: "Lütfen e-posta adresinizi giriniz!" },
            ]}
          >
            <Input
              className="form-input"
              value={email}
              onChange={(e) => setUseremail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
            hasFeedback
          >
            <Input.Password
              className="form-input"
              value={password}
              onChange={(e) => setUserpassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Şifreyi Onayla"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Lütfen şifrenizi onaylayınız!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Şifreler eşleşmiyor!"));
                },
              }),
            ]}
          >
            <Input.Password className="form-input" />
          </Form.Item>

          <Form.Item
            name="Adress"
            label="Adres"
            rules={[{ required: true, message: "Lütfen adresinizi giriniz." }]}
          >
            <Input
              className="form-input"
              value={address}
              onChange={(e) => setUseraddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon Numarası"
            rules={[
              { required: true, message: "Lütfen telefon numaranızı giriniz!" },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              className="form-input"
              value={phone}
              onChange={(e) => setUserphone(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Sözleşmeyi kabul etmelisiniz")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              Sözleşmeyi okudum <a href="">kabul ediyorum</a>
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout} className="submit-button">
            <Button
              className="KayitButon"
              type="primary"
              htmlType="submit"
              onClick={registerUser}
            >
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default SignUp;
