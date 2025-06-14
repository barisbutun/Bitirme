# 🛒 Yapay Zeka Destekli E-Ticaret Sitesi  
**AI-Supported E-Commerce Platform**

---

## 📘 Proje Özeti
Bu proje, modern bir e-ticaret uygulaması altyapısına sahip olup, kullanıcı davranışlarına (arama geçmişi, favoriler, sepet, sipariş geçmişi) dayalı benzer ürün öneri sistemi entegre eder. Backend tarafında Spring Boot ile RESTful API’ler, güvenlik ve kimlik doğrulama; frontend tarafında ise duyarlı, kullanıcı dostu bir arayüz yer alır.

Geliştirme süreci 9 ay, kapsamlı bir dokümantasyon ve test süreci içerir. Amacımız hem ölçeklenebilir hem de gerçek dünya iş gereksinimlerine uygun bir proje sunmaktır.

---

## 🚀 Özellikler
- 👤 **Kullanıcı Yönetimi**: Kayıt, Giriş, JWT tabanlı kimlik doğrulama
- 👑 ** Yönetici Paneli **: Kullanıcı ve ürün yönetimi
- 📦 **Ürün Kataloğu**: Filtreleme, sıralama, kategori bazlı listeleme
- ❤️ **Alışveriş Sepeti & Favoriler**: CRUD işlemleri
- 📑 **Sipariş Yönetimi**: Sipariş oluşturma, listeleme ve geçmiş görüntüleme
- 🔍 **Öneri Sistemi**: Cosine Similarity ile Python + scikit-learn tabanlı
- 🤖 **Gerçek Zamanlı Chatbot**: Rasa entegrasyonu ile e-ticaret destek botu
- 🚦 **Rate Limiting**: Redis + Bucket4j tabanlı istek sınırlandırma
- 🔐 **Güvenlik**: CORS, CSRF, rol tabanlı yetkilendirme
- 🐳 **Docker Desteği**: Hem backend hem frontend için container desteği
   
---

## 🏗️ Mimari ve Teknoloji Yığını

| Katman           | Teknolojiler                                                 |
|------------------|--------------------------------------------------------------|
| **Backend**       | Java, Spring Boot, Spring Security, JWT, Spring Data JPA ... |
| **Öneri Motoru**  | Python, scikit-learn, numpy                                  |
| **Cache & Queue** | Redis                                                        |
| **Rate Limiting** | Bucket4j                                                     |
| **Chatbot**       | Rasa                                                         |
| **Veri Tabanı**   | PostgreSQL,Elasticsearch,Redis                               |
| **Frontend**      | React (TypeScript), Rechart, Antdesign                       |
| **Container**     | Docker, Docker Compose                                       |

---
## 📂 Proje Yapısı - Backend
```
.
├── backend
│   ├── pom.xml
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   ├── com
│   │   │   │   │   ├── e_commerce
│   │   │   │   │   │   ├── config
│   │   │   │   │   │   ├── controller
│   │   │   │   │   │   ├── dto
│   │   │   │   │   │   ├── entity
│   │   │   │   │   │   ├── enums
│   │   │   │   │   │   ├── exception
│   │   │   │   │   │   ├── mapper
│   │   │   │   │   │   ├── repository
│   │   │   │   │   │   ├── service
│   │   │   │   │   │   ├── util
│   │   │   │   │   │   ├── validator
│   │   │   │   │   └── resources
│   │   │   │   └── test