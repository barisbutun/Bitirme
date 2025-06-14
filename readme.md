# 🛒 Yapay Zeka Destekli E-Ticaret Sitesi  
**AI-Supported E-Commerce Platform**

---

## 📘 Proje Özeti / Project Summary

🇹🇷 Bu proje, modern bir e-ticaret uygulaması altyapısına sahip olup, kullanıcı davranışlarına (arama geçmişi, favoriler, sepet, sipariş geçmişi) dayalı benzer ürün öneri sistemi entegre eder. Backend tarafında Spring Boot ile RESTful API’ler, güvenlik ve kimlik doğrulama; frontend tarafında ise duyarlı, kullanıcı dostu bir arayüz yer alır.

🇬🇧 This project is a modern e-commerce platform integrating a recommendation system based on user behaviors (search history, favorites, cart, order history). It features a Spring Boot backend with RESTful APIs, security, and authentication, and a responsive, user-friendly frontend.

Geliştirme süreci 9 ay, kapsamlı bir dokümantasyon ve test süreci içerir. Amacımız hem ölçeklenebilir hem de gerçek dünya iş gereksinimlerine uygun bir proje sunmaktır.  
Development spanned 9 months and included extensive documentation and testing. Our goal is a scalable solution aligned with real-world business needs.

---

## 🚀 Özellikler / Features

- 👤 **Kullanıcı Yönetimi / User Management**: Kayıt, Giriş, JWT tabanlı kimlik doğrulama  
  Registration, login, JWT-based authentication
- 👑 **Yönetici Paneli / Admin Panel**: Kullanıcı ve ürün yönetimi  
  Dashboard for managing users and products
- 📦 **Ürün Kataloğu / Product Catalog**: Filtreleme, sıralama, kategori bazlı listeleme  
  Filtering, sorting, category-based listing
- ❤️ **Alışveriş Sepeti & Favoriler / Cart & Favorites**: CRUD işlemleri  
  Create, read, update, delete operations
- 📑 **Sipariş Yönetimi / Order Management**: Sipariş oluşturma, listeleme ve geçmiş görüntüleme  
  Creating orders, listing, and viewing history
- 🔍 **Öneri Sistemi / Recommendation Engine**: Cosine Similarity ile Python + scikit-learn tabanlı  
  Python-based cosine similarity algorithm with scikit-learn
- 🤖 **Gerçek Zamanlı Chatbot / Real-Time Chatbot**: Rasa entegrasyonu ile e-ticaret destek botu  
  Chatbot integration using Rasa
- 🚦 **Rate Limiting**: Redis + Bucket4j tabanlı istek sınırlandırma  
  Redis and Bucket4j for API rate limiting
- 🔐 **Güvenlik / Security**: CORS, CSRF, rol tabanlı yetkilendirme  
  CORS, CSRF, and role-based authorization
- 🐳 **Docker Desteği / Docker Support**: Hem backend hem frontend için container desteği  
  Containerized backend and frontend with Docker

---

## 🏗️ Mimari ve Teknoloji Yığını / Architecture & Tech Stack

| Katman / Layer      | Teknolojiler / Technologies                                         |
|---------------------|--------------------------------------------------------------------|
| **Backend**         | Java, Spring Boot, Spring Security, JWT, Spring Data JPA          |
| **Öneri Motoru**    | Python, scikit-learn, numpy                                        |
| **Cache & Queue**   | Redis                                                              |
| **Rate Limiting**   | Bucket4j                                                           |
| **Chatbot**         | Rasa                                                               |
| **Veri Tabanı**     | PostgreSQL, Elasticsearch, Redis                                   |
| **Frontend**        | React (TypeScript), Recharts, Ant Design                           |
| **Container**       | Docker, Docker Compose                                             |

---
## 📦 Rasa repo
https://github.com/barisbutun/rasa-ecommerce-bot

## 📂 Proje Yapısı / Project Structure

### Backend
```
project-root/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/e_commerce/
│       │   │   ├── config      # Yapılandırma / Configuration
│       │   │   ├── controller  # API uç noktaları / Controllers
│       │   │   ├── dto         # Veri transfer objeleri / DTOs
│       │   │   ├── entity      # JPA entity sınıfları / Entities
│       │   │   ├── enums       # Sabitler / Enums
│       │   │   ├── exception   # Özel exception sınıfları
│       │   │   ├── mapper      # Model dönüşümleri / Mappers
│       │   │   ├── repository  # Veri erişim katmanı / Repositories
│       │   │   ├── service     # İş mantığı / Services
│       │   │   ├── util        # Yardımcı sınıflar / Utilities
│       │   │   └── validator   # Özel doğrulamalar / Validators
│       │   └── resources/
│       │       └── application.yml  # Yapılandırma dosyası
│       └── test/             # Birim ve entegrasyon testleri

```


