# NSG Case Demo

![Banner](/public/appbanner.png)

Bu projeyi canlı olarak denemek için buraya bakabilirsiniz: [https://nsg-case.vercel.app/](https://nsg-case.vercel.app/)

> **Not:** Canlı demoda free sürümler kullanıldığı için gecikmeler yaşanabilir.

Projeyi kendi bilgisayarınızda çalıştırmak isterseniz, proje rootuna bir `.env` dosyası ekleyip aşağıdaki gibi MongoDB connection stringinizi tanımlayabilirsiniz:

```
MONGODB_URI=your_mongodb_connection_string
```


## Özellikler ve Kullanılan Teknikler

- **Kart Listesi ve Geliştirme:**
  - Kullanıcıya ait kartlar listelenir. Her kart için adı, açıklaması, görseli ve mevcut seviyesi gösterilir.
  - Geliştirme ilerlemesi bir progress bar ile izlenir.
  - Enerji harcanarak kart geliştirilebilir veya maksimuma kadar otomatik geliştirme yapılabilir.
  - Yeterli ilerleme sağlandığında kart seviyesi yükseltilebilir.

- **Enerji Sistemi:**
  - Her geliştirme işlemi enerji harcar. Enerji zamanla otomatik olarak yenilenir ve kalan süre arayüzde gösterilir.
  - Enerji ve yenilenme süresi backend API üzerinden yönetilir.

- **Seviye ve Filtreleme:**
  - Kartlar, seviyelerine göre filtrelenebilir (Tüm seviyeler, Sv1, Sv2, Max Sv).
  - Modern ve mobil uyumlu bir sekme (tab) arayüzü ile filtreleme yapılır.

- **Mobil ve Masaüstü Desteği:**
  - Tüm arayüz Tailwind CSS ile responsive olarak tasarlanmıştır.
  - Mobilde butonlar üst üste, masaüstünde yan yana olacak şekilde optimize edilmiştir.

- **Backend API ve Gelişmiş Teknikler:**
  - **Race Condition Önleme:**
    - Kart geliştirme ve seviye atlatma işlemlerinde MongoDB'nin `findOneAndUpdate` fonksiyonu ile atomik güncellemeler yapılır. Böylece aynı anda birden fazla istek geldiğinde veri tutarlılığı korunur.
    - Örneğin, enerji harcama ve ilerleme artırma işlemleri tek bir atomik sorguda yapılır.
  - **Transaction Kullanımı:**
    - "Max Geliştirme" işlemlerinde MongoDB transaction'ı (`withTransaction`) kullanılır. Böylece birden fazla koleksiyonda (kullanıcı ve item) yapılan güncellemeler tutarlı şekilde tamamlanır veya geri alınır.
  - **Validation ve Güvenlik:**
    - API endpointlerinde gelen veriler Zod ile doğrulanır (ör. progress-max endpointi).
    - Demo kullanıcı ile çalışır, gerçek auth yoktur.
  - **Verimli Veri Erişimi:**
    - Sadece gerekli alanlar projection ile çekilir.
    - Enerji yenileme algoritması, minimum sorgu ile enerji ve zaman günceller.

- **Testler:**
  - React bileşenleri ve yardımcı fonksiyonlar için Jest ve Testing Library ile testler yazılmıştır.
  - Utility fonksiyonlar ve kart tanımları için kapsamlı testler bulunur.

## Kullanılan Teknolojiler

- Next.js (App Router)
- React 19
- Tailwind CSS
- MongoDB (veri saklama için)
- Jest & Testing Library (testler için)
- Zod (API validation)

## Başlatma

Projeyi başlatmak için:
```bash
npm install
npm run dev
```

Testleri çalıştırmak için:
```bash
npm run test
```

Ardından [http://localhost:3000](http://localhost:3000) adresini ziyaret edebilirsiniz.

---

## Değerlendirme Kriterleri

### Kullanıcı Deneyimi
- **Daha hızlı ve akıcı deneyim için:**
  - Arayüzde tüm işlemler (geliştirme, seviye atlatma, enerji yenileme) anlık olarak güncellenir ve kullanıcıya görsel feedback sağlanır.
  - Mobil ve masaüstü için responsive tasarım uygulanmıştır.
  - Yavaş network veya sunucu gecikmelerinde loading state ve buton disable durumları eklenebilir.
  - Enerji ve kart verileri, işlem sonrası otomatik olarak güncellenir; kullanıcı manuel refresh yapmak zorunda kalmaz.
  - İleri seviye için: SWR/React Query ile cache ve optimistic update kullanılabilir.

### Performans
- **Sunucu ve network yükünü azaltmak için:**
  - API endpointlerinde sadece gerekli alanlar projection ile çekilir, gereksiz veri transferi yapılmaz.
  - Enerji yenileme algoritması, gereksiz update ve sorguları minimize edecek şekilde tasarlanmıştır.
  - Kart listesi ve progress bar gibi bileşenler, sadece ilgili state değiştiğinde yeniden render olur.
  - İleri seviye için: API response'ları cache'lenebilir, CDN ve resim optimizasyonu eklenebilir.

### Güvenlik
- **Kötüye kullanımı engellemek için:**
  - Backend'de tüm kritik işlemler (geliştirme, seviye atlatma) atomik olarak yapılır, böylece işlemler bölünemez ve aynı anda birden fazla istekle enerji/ilerleme manipülasyonu engellenir.
  - API endpointlerinde input validation (Zod) ile hatalı veya zararlı veri engellenir.
  - Demo modunda auth yok, gerçek ortamda JWT veya session tabanlı kimlik doğrulama eklenmeli.
  - Rate limit ve brute force koruması için middleware eklenebilir.

### Veri Bütünlüğü
- **Olası data kayıplarını önlemek için:**
  - Tüm kritik güncellemeler (enerji, progress, seviye) atomik sorgular veya transaction ile yapılır.
  - "Max Geliştirme" gibi birden fazla koleksiyonu etkileyen işlemlerde MongoDB transaction kullanılır.
  - Hatalı veya yarım kalan işlemlerde kullanıcıya hata mesajı döndürülür, verilerde tutarsızlık oluşmaz.
  - Gelişmiş senaryolar için: Yedekleme, loglama ve retry mekanizmaları eklenebilir.

### Teknik Tasarım
- **Frontend:**
  - Next.js App Router ile modern, modüler ve hızlı bir arayüz.
  - Tüm UI Tailwind CSS ile responsive ve sade.
  - Bileşenler (CardItem, CardList, Tabs, EnergyBar) fonksiyonel ve yeniden kullanılabilir şekilde tasarlandı.
  - Testler: Jest ve Testing Library ile hem UI hem utility fonksiyonlar test edildi.
- **Backend:**
  - Next.js API routes ile RESTful backend.
  - MongoDB ile veri saklama, atomik güncellemeler ve transaction desteği.
  - Zod ile input validation, projection ile verimli veri erişimi.
  - Demo kullanıcı ile çalışır, gerçek auth ve rate limit eklenebilir.

---

## Max Geliştirme Özelliği ile Kullanıcı Deneyimi ve Performans İyileştirmesi

Projede, kullanıcıların bir kartı geliştirmek için her tıklamada ayrı ayrı API isteği göndermesi gerekiyordu. Bu durum hem kullanıcı deneyimini yavaşlatıyor hem de sunucuya gereksiz yük bindiriyordu.

Bu sorunu çözmek için **'Max Geliştirme'** özelliği eklendi:
- Kullanıcı, tek bir butona tıklayarak kartı mevcut enerjisi yettiği kadar veya maksimum ilerlemeye ulaşana kadar otomatik olarak geliştirebilir.
- Bu işlem, arka planda tek bir API isteğiyle ve MongoDB transaction kullanılarak hem enerji hem de ilerleme (progress) güncellemelerini tutarlı şekilde gerçekleştirir.
- Böylece, onlarca ayrı istek yerine tek bir round-trip ile işlem tamamlanır, kullanıcı daha hızlı ve akıcı bir deneyim yaşar.
- Özellikle mobil cihazlarda ve yavaş bağlantılarda bu özellik büyük bir hız ve konfor sağlar.

**Teknik Detay:**
- `progress-max` API endpoint'i, kullanıcının mevcut enerjisi ve kartın ilerlemesine göre toplu güncelleme yapar.
- Tüm güncellemeler transaction içinde atomik olarak yapılır, veri bütünlüğü korunur.

---

## Edge Case'ler 

Bu projede dikkate alınan başlıca edge case'ler ve çözümleri:

- **Enerji Sıfır veya Yetersizken Geliştirme:**
  - Enerji yoksa backend ilerleme yapmaz, mevcut durumu döner. UI’da butonlar disable edilebilir.

- **Progress Zaten %100 İken Geliştirme:**
  - Progress >= 100 ise backend ilerleme yapmaz, enerji harcamaz.

- **Seviye Maksimumdayken Yükseltme:**
  - Kart max seviyedeyse backend işlem yapmaz, UI’da buton disable olur.

- **Aynı Anda Birden Fazla Geliştirme İsteği (Race Condition):**
  - Atomik işlemler ve transaction ile veri tutarlılığı sağlanır.

- **Enerji Yenileme Sırasında Zamanlama Çakışması:**
  - Enerji güncellemeleri ve harcamaları backend’de atomik olarak yapılır.

- **Geçersiz veya Eksik API İstekleri:**
  - API endpoint’lerinde Zod ile input validation yapılır, hatalı istekler reddedilir.

- **Demo Kullanıcı Silinmiş veya Bulunamıyor:**
  - Kullanıcı bulunamazsa API uygun hata mesajı döner.

- **Mobilde veya Yavaş Ağda Çoklu Tıklama:**
  - UI’da butonlar işlem sırasında disable edilebilir, backend atomik işlemle koruma sağlar.

- **Veritabanı Bağlantı Hatası:**
  - MongoDB bağlantısı yoksa API hata döner, UI’da kullanıcıya hata mesajı gösterilebilir.

Bu edge caseler, hem frontend hem backend tarafında kullanıcı deneyimini ve veri bütünlüğünü korumak için dikkate alınmıştır.

---

## Test Yaklaşımı

### Test Altyapısı
- **Jest & Testing Library:** React bileşenleri ve utility fonksiyonlar için
- **TypeScript Desteği:** ts-jest ile TypeScript dosyaları test edilir

### Test Kapsamı
- **Bileşen Testleri:** DevelopButton, Tabs, EnergyBar, TinyProgress
- **Utility Testleri:** ITEM_DEFS validation, clamp fonksiyonu, percentage hesaplama
- **Edge Case Coverage:** Negatif değerler, sınır değerler, accessibility

### Test Çalıştırma
```bash
npm run test
```

---
