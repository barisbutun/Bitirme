const API_BASE_URL = "http://localhost:8082/api/auth/v1";

// Giriş işlemi
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Giriş başarısız");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Login sırasında hata:", error);
    throw error;
  }
};
 
// Google ile giriş işlemi
export const googleLogin = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Google ile giriş başarısız");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Google login sırasında hata:", error);
    throw error;
  }
};

// Kayıt işlemi
export const Register = async (userDetails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Kayıt başarısız");
    }

    const savedUser = await response.json();
    return savedUser;
  } catch (error) {
    console.error("Register sırasında hata:", error);
    throw error;
  }
};

// Çıkış işlemi
export const logout = () => {
  localStorage.removeItem("token");
};

// Token'ı al
export const getCurrentToken = () => {
  return localStorage.getItem("token");
};
