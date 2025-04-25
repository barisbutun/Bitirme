package org.example.bitirmeprojesi.enums;

public enum DeliveryStatus {
    PENDING,              // Sipariş oluşturuldu ama teslimat süreci henüz başlamadı
    PROCESSING,           // Sipariş hazırlanıyor (paketleniyor, fatura kesiliyor vs.)
    SHIPPED,              // Kargo firmasına teslim edildi
    IN_TRANSIT,           // Yolda, taşıma sürecinde
    OUT_FOR_DELIVERY,     // Kurye dağıtıma çıkardı
    DELIVERED,            // Alıcıya başarıyla teslim edildi
    FAILED_DELIVERY,      // Teslimat başarısız oldu (alıcı yoktu, adres yanlış vs.)
    RETURNED,             // Teslim edilemedi, iade sürecinde
    CANCELLED             // Sipariş ya da teslimat iptal edildi
}
