# Crew Management App - Geliştirme Yol Haritası (Roadmap)

Bu yol haritası, DigitAll Ocean için geliştirilen Crew Management App projesinin adım adım nasıl oluşturulduğunu açıklamaktadır. Proje, Angular 16+ kullanılarak geliştirilmiş, Standalone mimarisiyle modüler bir yapıya sahip, çok dilli (multilingual) bir uygulamadır. Aşağıda, projenin geliştirme süreci, her bir adımda yapılan işlemler detaylı bir şekilde açıklanmıştır.

## Proje Genel Bakış

Bu uygulama, bir mürettebat yönetim sistemi olarak tasarlanmıştır. Kullanıcılar, mürettebat üyelerini listeleyebilir, yeni mürettebat ekleyebilir, mevcut üyeleri düzenleyebilir veya silebilir, mürettebatın detaylı bilgilerine erişebilir ve sertifika yönetimi yapabilir. Uygulama, Angular Material bileşenleri kullanılarak modern bir arayüz sunar ve in-memory veri yönetimi için Angular servisleri kullanır.

## Gereksinimler

- Angular 16+ ve Angular Material kullanımı.
- Çok dilli destek: İngilizce, Fransızca ve Portekizce dilleri için dil seçici (Language Selector).
- **CrewList bileşeni**:
   - Mürettebat listesi için bir tablo (MatTable): First Name, Last Name, Nationality, Title, Days On Board, Daily Rate, Currency, Total Income, Certificates ve opsiyonel Discount sütunları.
   - Action menüsü: "Edit" (popup), "Delete", "Crew Card Page" (yönlendirme), "Certificates" (modal).
   - Tablo altında para birimine göre toplam gelir özeti.
- **CrewCard bileşeni**:
   - İki sekme: "Card" (mürettebat detayları) ve "Certificates" (sertifikalar).
- **Crew Ekleme Popup**: Yeni mürettebat eklemek için form ve sertifika ekleme alanı.
- **CertificateType Ekleme Sayfası**: Sertifika türü eklemek için form (Name, Description).
- **Angular Servisleri**: CrewService, CertificateService ve in-memory veri yönetimi.
- **Modüler Yapı**: CrewModule, CertificateModule, SharedModule.

## Geliştirme Adımları (Roadmap)

### 1. Proje Kurulumu ve Temel Yapı

- Angular CLI ile yeni bir proje oluşturuldu: `ng new crew-management-app --standalone`.
- Angular Material eklendi: `ng add @angular/material`.
- Proje dizinine `src/app/shared/` klasörü oluşturuldu ve `models/` ile `services/` alt klasörleri eklendi.
- `tsconfig.json` dosyasına kolay erişim için path tanımlamaları eklendi:
   ```json
   "paths": {
      "@shared/*": ["app/shared/*"],
      "@models/*": ["app/shared/models/*"],
      "@services/*": ["app/shared/services/*"]
   }
   ```
- Çok dilli destek için `ngx-translate` eklendi: `npm install @ngx-translate/core @ngx-translate/http-loader`.
- Dil dosyaları için `src/assets/i18n/` dizinine `en.json`, `fr.json` ve `pt.json` dosyaları oluşturuldu.
- `angular.json` dosyasına i18n yapılandırması eklendi:
   ```json
   "i18n": {
      "sourceLocale": "en",
      "locales": {
         "fr": "src/assets/i18n/fr.json",
         "pt": "src/assets/i18n/pt.json"
      }
   }
   ```

### 2. AppComponent ve Dil Seçici (Language Selector)

- AppComponent’e dil seçici (Language Selector) eklendi. Sağ üst köşede İngilizce, Fransızca ve Portekizce seçenekleri için bir dropdown oluşturuldu.
- `TranslateService` ile dil değişimi sağlandı ve varsayılan dil İngilizce olarak ayarlandı.
- `app.component.ts`’de dil değişim fonksiyonu yazıldı:
   ```typescript
   setLanguage(lang: string) {
      this.translate.use(lang);
   }
   ```
- Dil dosyalarına temel çeviri anahtarları eklendi (örneğin: `FIRST_NAME`, `LAST_NAME`, `ADD_NEW_CREW` vb.).

### 3. Rotalar ve Modüler Yapı

- `app.routes.ts` dosyasında ana rotalar tanımlandı:
   ```typescript
   [
      { path: '', redirectTo: '/crew', pathMatch: 'full' },
      { path: 'crew', loadChildren: () => import('./features/crew/crew.routes').then(m => m.crewRoutes) },
      { path: 'certificate', loadChildren: () => import('./features/certificate/certificate.routes').then(m => m.certificateRoutes) },
      { path: '**', redirectTo: '/crew/crew-list' }
   ]
   ```
- `src/app/features/` dizinine `crew/` ve `certificate/` klasörleri oluşturuldu.
- CrewModule ve CertificateModule için lazy loading rotaları (`crew.routes.ts` ve `certificate.routes.ts`) oluşturuldu:
   ```typescript
   // crew.routes.ts
   export const crewRoutes: Routes = [
      { path: 'crew-list', component: CrewListComponent },
      { path: 'crew-card/:id', component: CrewCardComponent }
   ];
   ```
   ```typescript
   // certificate.routes.ts
   export const certificateRoutes: Routes = [
      { path: 'certificate-type-create', component: CertificateTypeCreateComponent }
   ];
   ```

### 4. Shared Modül ve Servisler

- `shared/models/` dizinine modeller eklendi:
   - `crew-member.model.ts`: CrewMember arayüzü.
   - `certificate.model.ts`: Certificate arayüzü.
   - `certificate-type.model.ts`: CertificateType arayüzü.
   - `income-summary.model.ts`: IncomeSummary arayüzü.
- `shared/services/` dizinine servisler eklendi:
   - **CrewService**: Mürettebat verileri (`crewList`, `nationalityList`, `titleList`) ve işlevler (ekleme, silme, güncelleme).
   - **CertificateService**: Sertifika verileri (`certificates`, `certificateTypes`) ve işlevler (ekleme, silme, listeleme).
- Servislerde in-memory veri yönetimi için private array’ler tanımlandı:
   ```typescript
   // CrewService
   private crewList: CrewMember[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', nationality: 'American', title: 'Captain', daysOnBoard: 120, dailyRate: 300, currency: 'USD', totalIncome: 36000, certificates: [] },
      // ... diğer kayıtlar
   ];
   ```
   ```typescript
   // CertificateService
   private certificates: Certificate[] = [
      { id: 1, name: 'Safety Training', description: 'Basic safety training', issueDate: '2024-01-10', expiryDate: '2026-01-10', crewMemberId: 1 },
      // ... diğer kayıtlar
   ];
   ```

### 5. CrewList Bileşeni - Tablo ve Action Menüsü

- **CrewListComponent** oluşturuldu: `ng g component features/crew/crew-list --standalone`.
- `MatTableModule` kullanılarak mürettebat listesi için bir tablo oluşturuldu.
- Tablo sütunları: First Name, Last Name, Nationality, Title, Days On Board, Daily Rate, Currency, Total Income, Certificates, Action.
- Action sütununa bir menü eklendi (`MatMenuModule`):
   - "Edit" (popup açılır).
   - "Delete" (mürettebat silinir).
   - "Crew Card Page" (yönlendirme).
   - "Certificates" (modal açılır).
- Tablo başlıkları `Translate` pipe ile çevrilebilir hale getirildi:
   ```html
   <th mat-header-cell *matHeaderCellDef> {{ 'FIRST_NAME' | translate }} </th>
   ```
- Tablo altında para birimine göre toplam gelir özeti eklendi:
   ```html
   <ng-container *ngFor="let summary of (incomeSummary$ | async)">
      <div>{{ summary.totalIncome | number:'1.2-2' }} {{ summary.currency }}</div>
   </ng-container>
   ```

### 6. CrewList - Ekleme ve Düzenleme Popup’ı

- **CrewModalComponent** oluşturuldu: `ng g component features/crew/crew-modal --standalone`.
- `MatDialogModule` kullanılarak bir modal yapılandırıldı.
- Modalda `ReactiveFormsModule` ile bir form oluşturuldu:
   - Alanlar: First Name, Last Name, Nationality, Title, Days On Board, Daily Rate, Currency.
   - Tüm alanlar `Validators.required` ile zorunlu hale getirildi.
   - Nationality, Title ve Currency için dropdown’lar kullanıldı (`MatSelectModule`).
- "Add Crew" butonu ile modal açıldı ve yeni mürettebat eklendi.
- "Edit" seçeneği ile aynı modal düzenleme modunda açıldı.

### 7. CrewList - Sertifika Modal ve Currency Değiştirme

- **CertificateModalComponent** oluşturuldu: `ng g component features/certificate/certificate-modal --standalone`.
- "Certificates" sütununa tıklandığında bir modal açıldı ve ilgili mürettebatın sertifikaları listelendi.
- Currency sütununa bir buton eklendi (`MatIconModule` ile euro ve attach_money ikonları kullanıldı).
- Para birimi değiştirme işlevi eklendi:
   ```typescript
   toggleRowCurrency(row: CrewMember) {
      const previousCurrency = row.currency;
      row.currency = row.currency === 'USD' ? 'EUR' : 'USD';
      row.dailyRate = this.convertCurrency(row.dailyRate, previousCurrency, row.currency);
      row.totalIncome = this.convertCurrency(row.totalIncome, previousCurrency, row.currency);
   }
   ```

### 8. CrewCard Bileşeni

- **CrewCardComponent** oluşturuldu: `ng g component features/crew/crew-card --standalone`.
- `MatTabsModule` kullanılarak iki sekme eklendi:
   - "Card" sekmesi: Mürettebat detayları (First Name, Last Name, vb.).
   - "Certificates" sekmesi: Mürettebatın sertifikaları.
- URL’den ID alındı: `/crew/crew-card/:id`.
- "Certificates" sekmesinde sertifikalar listelendi.

### 9. CrewCard - Sertifika Ekleme ve Silme

- **AddCertificateModalComponent** oluşturuldu: `ng g component features/crew/add-certificate-modal --standalone`.
- "Add Certificate" butonu ile bir modal açıldı.
- Modalda `certificate-type`, `issueDate` ve `expiryDate` alanları için bir form oluşturuldu.
- Sertifika ekleme ve silme işlevleri `CertificateService` üzerinden yönetildi.
- "Certificates" sekmesinde yalnızca bu sekme seçiliyken "Add Certificate" butonu görünecek şekilde bir koşul eklendi.

### 10. CertificateType Ekleme Sayfası

- **CertificateTypeCreateComponent** oluşturuldu: `ng g component features/certificate/certificate-type-create --standalone`.
- **CertificateTypeModalComponent** oluşturuldu ve bir modal ile sertifika türü ekleme formu eklendi (Name, Description).
- "Add Certificate Type" butonu CrewListComponent’e eklendi ve modal açıldı.

### 11. Opsiyonel - Discount Sütunu

- **CrewListComponent** tablosuna Discount sütunu eklendi.
- Her satıra bir input alanı eklendi ve girilen indirim değeri Total Income’dan düşürüldü.
- Toplam gelir özeti de güncellendi.

### 12. Stil ve Arayüz İyileştirmeleri

- **CrewListComponent** ve **CrewCardComponent** için Angular Material temaları kullanıldı.
- Butonlar ve modallar için stil düzenlemeleri yapıldı.
- Dil seçici için sağ üst köşede bir dropdown tasarlandı.
