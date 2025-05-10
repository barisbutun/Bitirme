import React, { useEffect, useState } from "react";
import {
  Layout,
  InputNumber,
  Button,
  message,
  Spin,
  Typography,
  List,
  Card,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import CountUp from "react-countup";
import { motion } from "framer-motion"; // framer-motion import edildi
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  loadBalance,
  updateBalance,
  getUserBalance,
} from "../../services/UserService/WalletService";
import "../User/UserCss/WalletPage.css";

const { Title, Text } = Typography;

const WalletPage = () => {
  const [balance, setBalance] = useState(null);
  const [prevBalance, setPrevBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const result = await getUserBalance();
      setPrevBalance(balance || 0);
      setBalance(result?.balance || 0);
      setUser(result);
    } catch {
      message.error("Bakiye alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async () => {
    if (amount <= 0) {
      message.warning("Lütfen geçerli bir tutar giriniz.");
      return;
    }
    try {
      setLoading(true);
      await loadBalance({ balance: amount });
      message.success("Bakiye yüklendi.");
      fetchBalance();
    } catch {
      message.error("Yükleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (amount <= 0) {
      message.warning("Lütfen geçerli bir tutar giriniz.");
      return;
    }
    try {
      setLoading(true);
      await updateBalance({ balance: amount });
      message.success("Bakiye güncellendi.");
      fetchBalance();
    } catch {
      message.error("Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const walletHistory = [
    { type: "Yükleme", amount: 100, date: "2024-05-01 12:30" },
    { type: "Güncelleme", amount: 50, date: "2024-05-03 15:45" },
    { type: "Yükleme", amount: 200, date: "2024-05-05 10:20" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="wallet-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="wallet-content">
          <div className="wallet-main-layout">
            {/* Sol panel */}
            <div className="wallet-left-panel">
              <div className="credit-card">
                <div className="card-chip" />
                <div className="card-info">
                  <div className="card-type">
                    <CreditCardOutlined
                      style={{ fontSize: 24, color: "#fff" }}
                    />
                    <span style={{ marginLeft: 10 }}>Sanal Cüzdan</span>
                  </div>
                  <div className="card-balance">
                    <Text style={{ color: "#aaa" }}>Bakiye</Text>
                    <Title level={2} style={{ color: "#fff", margin: 0 }}>
                      {balance !== null ? (
                        <CountUp
                          start={prevBalance}
                          end={balance}
                          duration={1.5}
                          separator="."
                          decimals={2}
                          decimal=","
                          suffix=" ₺"
                        />
                      ) : (
                        "Yükleniyor..."
                      )}
                    </Title>
                  </div>
                  <div className="card-holder">
                    <Text style={{ color: "#fff" }}>
                      Kullanıcı: {user?.name || "Bilinmiyor"}
                    </Text>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <InputNumber
                  min={1}
                  value={amount}
                  onChange={setAmount}
                  style={{ width: "100%", marginBottom: 16 }}
                  placeholder="Tutar giriniz"
                />
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    className="bakiyebuton"
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleLoad}
                    block
                  >
                    Bakiye Yükle
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleUpdate}
                    style={{
                      backgroundColor: "#ff9800",
                      borderColor: "#ff9800",
                      color: "#fff",
                    }}
                    block
                  >
                    Bakiye Güncelle
                  </Button>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Spin />
                </div>
              )}
            </div>

            {/* Sağ panel - geçmiş */}
            <div className="wallet-right-panel">
              <Title level={4}>Cüzdan Geçmişi</Title>
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={walletHistory}
                renderItem={(item) => (
                  <List.Item>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} // Başlangıç durumları
                      animate={{ opacity: 1, y: 0 }} // Animasyon bitişi
                      transition={{ duration: 1.0 }} // Animasyon süresi
                    >
                      <Card
                        title={item.type}
                        bordered
                        style={{ backgroundColor: "#f9f9f9" }}
                      >
                        <Text>
                          Tutar: <b>{item.amount} ₺</b>
                        </Text>
                        <br />
                        <Text>Tarih: {item.date}</Text>
                      </Card>
                    </motion.div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default WalletPage;
