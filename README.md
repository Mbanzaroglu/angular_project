# Crew Management App - DigitAll Ocean Vaka Çalışması

Bu proje, DigitAll Ocean için bir vaka çalışması olarak geliştirilmiştir. Angular 19 kullanılarak oluşturulan bu Crew Management App, modüler bir yapıya sahip, Standalone mimarisiyle tasarlanmış ve çok dilli (multilingual) bir uygulamadır. Aşağıda projenin detayları, yapısı ve özellikleri açıklanmıştır.

## Proje Genel Bakış

Bu uygulama, bir mürettebat yönetim sistemi olarak tasarlanmıştır. Kullanıcılar, mürettebat üyelerini listeleyebilir, yeni mürettebat ekleyebilir, mevcut üyeleri düzenleyebilir veya silebilir, mürettebatın detaylı bilgilerine erişebilir ve sertifika yönetimi yapabilir. Uygulama, modern Angular özelliklerini kullanarak performans ve kullanıcı deneyimi odaklı bir şekilde geliştirilmiştir.

## Temel Özellikler

- **Modüler ve Standalone Mimari**: Uygulama, Angular’ın modüler yapısına uygun olarak tasarlanmış ve Standalone bileşenler kullanılarak geliştirilmiştir.
- **Çok Dilli Destek**: Translate pipe kullanılarak i18n standartlarında çok dilli bir yapı sağlanmıştır.
- **Lazy Loading**: Rotalar, performans optimizasyonu için lazy loading ile yüklenir.
- **MatDialogModule**: Pop-up modüller için Angular Material’in MatDialogModule’ü kullanılmıştır.
- **Statik Veri Yönetimi**: Veriler, gerçekçi bir yapı sağlamak için servislerdeki private array’ler aracılığıyla yönetilmiştir.
- **Angular Material Kullanımı**: Arayüz tasarımı için MatTableModule, MatButtonModule, MatIconModule gibi Angular Material bileşenleri tercih edilmiştir.

## Proje Yapısı

### Ana Dizin Yapısı

Projenin ana dizini (`src/`) aşağıdaki temel dosyalardan oluşur:

- **`main.ts`**: Angular uygulamasını `bootstrapApplication` ile başlatır. Uygulamanın giriş noktasıdır.
- **`app.component.ts`**: Uygulamanın kök bileşeni olan `AppComponent` burada tanımlanır.
- **`app.routes.ts`**: Uygulamanın en üst düzey rotaları burada tanımlanmıştır. Lazy loading kullanılarak modüller yüklenir.
- **`app.config.ts`**: `AppComponent` ve rotalarla birlikte `HttpClient`, `TranslateService` gibi bağımlılıklar burada tanımlanır ve uygulama bu yapılandırma ile başlatılır.

### Rotalar (`app.routes.ts`)

Uygulamanın ana rotaları aşağıdaki gibi tanımlanmıştır:

```typescript
[
    { path: '', redirectTo: '/crew', pathMatch: 'full' },
    { path: 'crew', loadChildren: () => import('./features/crew/crew.routes').then(m => m.crewRoutes) },
    { path: 'certificate', loadChildren: () => import('./features/certificate/certificate.routes').then(m => m.certificateRoutes) },
    { path: '**', redirectTo: '/crew/crew-list' }
]
```

- Varsayılan rota (`''`), `/crew` yoluna yönlendirir.
- `crew` ve `certificate` modülleri lazy loading ile yüklenir.
- Hatalı yollar için (`**`), kullanıcı `/crew/crew-list` sayfasına yönlendirilir.

### Modüller

- **Crew Modülü**: Mürettebat yönetimi ile ilgili tüm işlevler bu modül içinde yer alır. Başlangıç sayfası olan `crew-list` bileşeni, bu modülün bir parçasıdır.
- **Certificate Modülü**: Sertifika yönetimi ile ilgili işlevler bu modül içinde tanımlanmıştır.

## Özellikler ve İşlevsellik

### 1. Crew List Sayfası (Başlangıç Sayfası)

Uygulama, varsayılan olarak `/crew/crew-list` sayfasını açar. Bu sayfa, mürettebat bilgilerinin tablo formatında gösterildiği ana sayfadır.

#### Özellikler:

- **Tablo Yapısı**: Mürettebat bilgileri `MatTableModule` kullanılarak bir tabloda gösterilir.
- **Currency Değiştirme**: Her mürettebatın para birimi (USD/EUR) değiştirilebilir. Toplam gelir, seçilen para birimine göre otomatik olarak hesaplanır.
- **Ekleme ve Düzenleme**:
    - **Add Crew**: Yeni mürettebat eklemek için bir modal açılır. Tüm alanlar zorunludur (required).
    - **Edit**: Mevcut mürettebat bilgileri düzenlenebilir. `Add Crew` ile aynı modal kullanılır, ancak düzenleme modunda açılır.
- **Silme**: Mürettebat üyeleri tablodan silinebilir.
- **Crew Card Sayfasına Yönlendirme**: Her mürettebat için detaylı bilgilere erişmek üzere `Crew Card` sayfasına yönlendirme yapılır.
- **Toplam Gelir**: Tüm mürettebatın toplam geliri hem USD hem EUR cinsinden arayüzde gösterilir.

#### Veri Yönetimi:

- Mürettebat bilgileri, `CrewService` içinde tanımlı bir private array (`crewList`) üzerinden sağlanır.
- Ülke ve meslek seçenekleri, `CrewService` içindeki `nationalityList` ve `titleList` array’lerinden select box’lar aracılığıyla sunulur.

#### Arayüz:

- Tasarımda CSS kullanımı minimumda tutulmuş, bunun yerine `MatTableModule`, `MatButtonModule`, `MatIconModule` gibi Angular Material bileşenleri tercih edilmiştir.
- Modal yapılar için `MatDialogModule` kullanılmış, böylece parametre transferi ve akış yönetimi kolaylaştırılmıştır.

### 2. Sertifika Yönetimi

Sertifika işlemleri, `CertificateService` üzerinden yönetilir.

#### Özellikler:

- **Add Certificate Type**: Yeni sertifika türleri eklenebilir. Sertifika türleri, `CertificateService` içindeki `certificateTypes` array’ine eklenir.
- **Sertifika Bilgileri**: Sertifikalara ait bilgiler, `CertificateService` üzerinden çekilir ve arayüzde gösterilir.

### 3. Crew Card Sayfası

`Crew Card` sayfası, bir mürettebat üyesinin detaylı bilgilerini ve sertifikalarını gösterir.

#### Özellikler:

- **Detaylı Bilgiler**: Mürettebatın adı, unvanı, milliyeti, gemide geçirdiği gün sayısı, günlük ücreti ve toplam geliri gösterilir.
- **Sertifika Yönetimi**:
    - Mevcut sertifikalar listelenir.
    - Yeni sertifika eklenebilir.
    - Mevcut sertifikalar kaldırılabilir.
- **URL Yapısı**: Mürettebatın ID’si URL’de `/crew/crew-card/:id` formatında gösterilir.

### 4. Çok Dilli Destek (i18n)

Uygulama, çok dilli bir yapıya sahiptir ve dil yönetimi `TranslateService` ile sağlanır.

#### Dil Yönetimi:

- Dil dosyaları, `src/assets/i18n/` dizininde `.json` formatında saklanır.
- Dil seçenekleri, sağ üst köşedeki bir dil seçme kutusu ile değiştirilebilir.
- Tüm metinler, `Translate` pipe kullanılarak çevrilir.
- Dil durumu, `app.component.ts` içinde yönetilir.

#### Dil Dosyaları:

`angular.json` dosyasına aşağıdaki yapı eklenerek dil dosyalarının dizinleri tanımlanmıştır:

```json
"i18n": {
    "sourceLocale": "en",
    "locales": {
        "fr": "src/assets/i18n/fr.json",
        "pt": "src/assets/i18n/pt.json"
    }
}
```

- Varsayılan dil İngilizce (`en`)'dir.
- Fransızca (`fr`) ve Portekizce (`pt`) dilleri desteklenir.

#### Dil Kullanımı:

- Mürettebat ve sertifika bilgileri İngilizce olarak sabit bırakılmıştır.
- Diğer tüm metinler (butonlar, başlıklar, vb.), seçilen dile göre dinamik olarak çevrilir.

## Veri ve Servis Yönetimi

### Shared Klasörü

Projenin ortak kullanılan modelleri ve servisleri, `app/shared/` dizininde yer alır:

- **`models/`**: `CrewMember`, `Certificate`, `CertificateType` gibi modeller burada tanımlanır.
- **`services/`**: `CrewService`, `CertificateService` gibi servisler burada bulunur.

### Kolay Erişim için Path Tanımlaması

`shared/` dizinine kolay erişim sağlamak için `tsconfig.json` dosyasına aşağıdaki path tanımlamaları eklenmiştir:

```json
"paths": {
    "@shared/*": ["app/shared/*"],
    "@models/*": ["app/shared/models/*"],
    "@services/*": ["app/shared/services/*"]
}
```

Bu sayede, import işlemleri şu şekilde yapılabilir:

```typescript
import { CertificateType } from '@models/certificate-type.model';
import { CrewService } from '@services/crew.service';
```

### Servisler

- **CrewService**:
    - Mürettebat bilgileri (`crewList`), ülkeler (`nationalityList`) ve meslekler (`titleList`) gibi statik veriler burada saklanır.
    - Mürettebat ekleme, silme, güncelleme ve gelir hesaplama gibi işlevler bu servis üzerinden yönetilir.
- **CertificateService**:
    - Sertifika bilgileri (`certificates`) ve sertifika türleri (`certificateTypes`) burada saklanır.
    - Sertifika ekleme, silme ve listeleme işlemleri bu servis üzerinden gerçekleştirilir.

## Kurulum ve Çalıştırma

### Gereksinimler

- **Node.js**: v18.x veya üstü
- **Angular CLI**: v19.x

### Kurulum Adımları

1. Depoyu klonlayın:

     ```bash
     git clone <repository-url>
     ```

2. Proje dizinine gidin:

     ```bash
     cd crew-management-app
     ```

3. Bağımlılıkları yükleyin:

     ```bash
     npm install
     ```

4. Uygulamayı başlatın:

     ```bash
     ng serve
     ```

5. Tarayıcınızda uygulamayı açın: [http://localhost:4200](http://localhost:4200)

## Kullanım

### Crew List Sayfası:

- Mürettebat listesini görüntüleyin.
- "Add Crew" butonu ile yeni mürettebat ekleyin.
- "Edit" seçeneği ile mevcut mürettebatı düzenleyin.
- "Delete" seçeneği ile mürettebatı silin.
- "Crew Card Page" seçeneği ile detaylı bilgilere erişin.
- Para birimini (USD/EUR) değiştirerek toplam geliri farklı birimlerde görün.

### Crew Card Sayfası:

- Mürettebatın detaylı bilgilerini ve sertifikalarını görüntüleyin.
- Yeni sertifika ekleyin veya mevcut sertifikaları kaldırın.

### Dil Değiştirme:

- Sağ üst köşedeki dil seçme kutusundan İngilizce, Fransızca veya Portekizce dillerinden birini seçerek arayüz dilini değiştirin.

## Teknolojiler

- **Angular 19**: Framework
- **Angular Material**: Arayüz bileşenleri (`MatTableModule`, `MatButtonModule`, `MatIconModule`, `MatDialogModule`)
- **TypeScript**: Programlama dili
- **RxJS**: Reaktif programlama için
- **i18n**: Çok dilli destek için `TranslateService` ve `Translate` pipe
- **Lazy Loading**: Performans optimizasyonu için