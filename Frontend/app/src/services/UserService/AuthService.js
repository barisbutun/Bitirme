
const API_BASE_URL = "http://localhost:8082/api/auth/v1";

// Giriş işlemi
const login = async (email,password,setMessage,navigate) => {
    // e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Giriş başarılı!");
        navigate("/Homepage");
        // Eğer JWT token dönerse, localStorage'a kaydedebiliriz
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
      } else {
        setMessage(`Giriş başarısız: ${data.message}`);
      }
    } catch (error) {
      setMessage("Giriş sırasında bir hata oluştu.");
    }
  };

// google ile giriş
const googleLogin = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

//kayıt işlemi
 const Register = async (user_name,Name,useremail,userpassword,useraddress,userphone,setMessage,navigate) => {
    // e.preventDefault();
    const newUser = {
      username: user_name,
      name: Name,
      email: useremail,
      password: userpassword,
      address: useraddress,
      phone: userphone,
    };
    
    try {
        const response = await fetch( `${API_BASE_URL}/register`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser), // Verileri JSON formatında gönderiyoruz
          }
        );
        const savedUser = await response.json();
        if (response.ok) {
          setMessage(" Kayıt başarılı:", savedUser);
          navigate("/Login");
        } else {
          setMessage("Kayıt başarısız: {$data.message}");
        }
      } catch (error) {
        setMessage("Kayıt sırasında hata oluştu:");
      }
    };

export { login, googleLogin, Register };