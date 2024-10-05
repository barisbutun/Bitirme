import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import "../css/SignUp.css"; // CSS dosyasını içe aktarma

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

const SignUp = () => {
  const [form] = Form.useForm();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const [useraddress, setUseraddress] = useState("");
  const [userphone, setUserphone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name: username,
      email: useremail,
      password: userpassword,
      address: useraddress,
      phone: userphone,
    };
    try {
      const response = await fetch("   ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser), // Verileri JSON formatında gönderiyoruz
      });

      if (response.ok) {
        const savedUser = await response.json();
        console.log(" Kayıt başarılı:", savedUser);
      } else {
        console.error("Kişi kaydedilemedi");
      }
    } catch (error) {
      console.error("Hata oluştu:", error);
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
      console.log("Formdan alınan değerler: ", values);
    } else {
      console.log("Captcha doğrulaması başarısız!");
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
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
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
          value={username}
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
          value={useremail}
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
          value={userpassword}
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
          value={useraddress}
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
          value={userphone}
          onChange={(e) => setUserphone(e.target.value)}
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
                { required: true, message: "Lütfen güvenlik kodunu giriniz!" },
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
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          Kayıt Ol
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUp;
