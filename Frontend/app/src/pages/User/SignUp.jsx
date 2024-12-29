import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
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

const SignUp = () => {
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [user_name, setUsername] = useState("");
  const [email, setUseremail] = useState("");
  const [password, setUserpassword] = useState("");
  const [address, setUseraddress] = useState("");
  const [phone, setUserphone] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // const registerUser = async (e) => {
  //   e.preventDefault();
  //   const newUser = {
  //     username: user_name,
  //     name: Name,
  //     email: useremail,
  //     password: userpassword,
  //     address: useraddress,
  //     phone: userphone,
  //   };
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8082/api/user/v1/register ",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newUser), // Verileri JSON formatında gönderiyoruz
  //       }
  //     );
  //     const savedUser = await response.json();
  //     if (response.ok) {
  //       setMessage(" Kayıt başarılı:", savedUser);
  //       navigate("/Login");
  //     } else {
  //       setMessage("Kayıt başarısız: {$data.message}");
  //     }
  //   } catch (error) {
  //     setMessage("Kayıt sırasında hata oluştu:");
  //   }
  // };
  const registerUser = async () => {
    try {
      const response = await Register(
        user_name,
        name,
        email,
        password,
        address,
        phone,
        navigate
      );
      if (response) {
        setMessage(" Kayıt başarılı:");
        navigate("/Login");
      } else {
        setMessage("Kayıt başarısız: {$data.message}");
      }
    } catch (error) {
      setMessage("Kayıt sırasında hata oluştu:");
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
          value={user_name}
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
  );
};

export default SignUp;
