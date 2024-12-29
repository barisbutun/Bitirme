import { getToken } from "../../utils/auth";
// API URL
const API_URL = 'http://localhost:8082/api/admin/v1/users';

// Kullanıcıları alma (filtreleme)
export const getAllUsers = async () => {
    const token = getToken();
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Kullanıcılar alınırken bir hata oluştu!');
    }
  
    const data = await response.json();
  
    // Gelen veriyi filtrele
    const filteredUsers = data.filter(user => user.role === "USER");
    return filteredUsers;
  };
  
  

// Yeni kullanıcı ekleme
export const createUser = async (user) => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  
    },
    body: JSON.stringify(user), 
  });

  if (!response.ok) {
    throw new Error('Kullanıcı eklenirken bir hata oluştu!');
  }

  return await response.json(); 
};

// Kullanıcıyı güncelleme
export const updateUser = async (id, user) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  
    },
    body: JSON.stringify(user), 
  });

  if (!response.ok) {
    throw new Error('Kullanıcı güncellenirken bir hata oluştu!');
  }

  return await response.json(); 
};

// Kullanıcıyı silme
export const deleteUser = async (id) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error('Kullanıcı silinirken bir hata oluştu!');
  }

  return await response.json(); 
};
