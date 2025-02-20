// import AdminPage from "./pages/Admin/AdminPage";
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Homepage from "./pages/User/Homepage";
// import Login from "./pages/User/Login";
// import Profile from "./pages/User/Profile";
// import Products from "./pages/User/Products";
// import Delivery from "./pages/Delivery";
// import ShoppingCard from "./pages/User/ShoppingCard";
// import SignUp from "./pages/User/SignUp";
// import Orders from "./pages/User/Orders";
// import ProductDetails from "./pages/User/ProductDetails";

// import Favorites from "./pages/User/Favorites";
// import Payment from "./pages/User/Payment";
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/Profile" element={<Profile />} />
//         <Route path="/Homepage" element={<Homepage />} />
//         <Route path="/Login" element={<Login />} />
//         <Route path="/SignUp" element={<SignUp />} />
//         <Route path="/Products" element={<Products />} />
//         <Route path="/Delivery" element={<Delivery />} />
//         <Route path="/ShoppingCard" element={<ShoppingCard />} />
//         <Route path="/Orders" element={<Orders />} />
//         <Route path="/ProductDetails/:id" element={<ProductDetails />} />
//         <Route path="/Favorites" element={<Favorites />} />
//         <Route path="/Payment" element={<Payment />} />
//         {/* <Route path="/AdminPage" element={<AdminPage />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

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
    <Router
      future={{
        v7_startTransition: false,
        v7_relativeSplatPath: false,
      }}
    >
      <Routes>
        {/* İlk sayfa (Homepage) */}
        <Route path="/" element={<Homepage />} />

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
        <Route path="/login" element={<Login />} />

        {/* Admin ve User alt rotaları */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />

        {/* Bilinmeyen rotalar için */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
