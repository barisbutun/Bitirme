import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/User/Login";
import Homepage from "./pages/User/Homepage";
import { decodeToken } from "./utils/auth";
import { Spin, ConfigProvider } from "antd";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const setLoadingState = (state) => {
    setLoading(state);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserRole(decoded.roles);
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#fd702d", // Ana tema rengi
          colorLink: "#fd702d", // Link rengi
        },
      }}
    >
      <Router
        future={{
          v7_startTransition: false,
          v7_relativeSplatPath: false,
        }}
      >
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              position: "fixed",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Arka planı hafif saydam yap
              zIndex: 9999, // Diğer bileşenlerin üstünde görünmesi için
            }}
          >
            <Spin tip="Yükleniyor..." />
          </div>
        )}
        <Routes>
          {/* İlk sayfa (Homepage) */}
          <Route path="/" element={<Homepage setLoading={setLoadingState} />} />

          {/* Giriş yapılmışsa yönlendirme */}
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                userRole?.includes("ADMIN") ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/user" replace />
                )
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Giriş yapmamış kullanıcılar için Login */}
          <Route
            path="/login"
            element={<Login setLoading={setLoadingState} />}
          />

          {/* Admin ve User alt rotaları */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route
            path="/user/*"
            element={<UserRoutes setLoading={setLoadingState} />}
          />

          {/* Bilinmeyen rotalar için */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
