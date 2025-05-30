import React, { useState } from "react";
import { Button, Form, Input, Select, Spin, message } from "antd";
import "../User/UserCss/SignUp.css";
import { useNavigate } from "react-router-dom";
import { VerifyRegister } from "../../services/UserService/AuthService";
import AgreementCheckbox from "../../components/AgreementCheckbox";
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
  const [password, setUserpassword] = useState("");
  const [address, setUseraddress] = useState("");
  const [phone, setUserphone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !address || !phone || !password) {
      message.error("Tüm alanları doldurduğunuzdan emin olun.");
      return;
    }

    try {
      const code = localStorage.getItem("verificationCode");
      const verifiedEmail = localStorage.getItem("verifiedEmail");

      if (!code || !verifiedEmail) {
        message.error("Doğrulama kodu veya email bulunamadı.");
        return;
      }

      const userDetails = {
        name,
        email: verifiedEmail,
        password,
        address,
        phone,
      };

      const registeredUser = await VerifyRegister(userDetails, code);
      message.success("Kayıt başarılı!");
      localStorage.removeItem("verificationCode");
      localStorage.removeItem("verifiedEmail");
      navigate("/Login");
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "";

      if (
        errorMsg.toLowerCase().includes("expired") ||
        errorMsg.toLowerCase().includes("geçersiz") ||
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("expired code")
      ) {
        message.error(
          "Doğrulama kodunuzun süresi dolmuş. Lütfen tekrar e-posta doğrulaması yapınız."
        );
      } else {
        message.error("Kayıt gerçekleştirilemedi. Lütfen tekrar deneyin.");
      }
      setTimeout(() => {
        navigate("/user/EmailVerification");
      }, 1000);
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
          onFinish={handleRegister}
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
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { required: true, message: "Sözleşmeyi kabul etmelisiniz!" },
              ]}
            >
              <AgreementCheckbox />
            </Form.Item>
          </Form.Item>

          <Form.Item {...tailFormItemLayout} className="submit-button">
            <Button className="KayitButon" type="primary" htmlType="submit">
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default SignUp;
