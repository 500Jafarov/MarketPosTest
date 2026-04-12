// MarketPOS: Türkçe → Azerbaycanca çeviri scripti (Node.js)
const fs = require('fs');

let c = fs.readFileSync('index.html', 'utf8');

const replacements = [
  // ── HEAD
  ['lang="tr"', 'lang="az"'],
  ['MarketPOS — Satış ve Stok Yönetim Sistemi', 'MarketPOS — Satış və Stok İdarəetmə Sistemi'],
  ['"Satış ve Stok Yönetim Sistemi"', '"Satış və Stok İdarəetmə Sistemi"'],
  ['QZ Tray yüklenmedi, normal yazdırma kullanılacak', 'QZ Tray yüklənmədi, adi çap istifadə olunacaq'],
  ['JsBarcode yuklenemedi', 'JsBarcode yüklənmədi'],

  // ── SEED DATA
  ['Admin Kullanıcı', 'Admin İstifadəçi'],
  ['Kasiyer Ahmet', 'Kassir Əhməd'],
  ["{ id: 'c1', name: 'İçecekler'", "{ id: 'c1', name: 'İçkilər'"],
  ["{ id: 'c2', name: 'Atıştırmalıklar'", "{ id: 'c2', name: 'Qəlyanaltılar'"],
  ["{ id: 'c3', name: 'Temizlik'", "{ id: 'c3', name: 'Təmizlik'"],
  ["{ id: 'c4', name: 'Kişisel Bakım'", "{ id: 'c4', name: 'Şəxsi Qayğı'"],
  ["{ id: 'c5', name: 'Gıda'", "{ id: 'c5', name: 'Qida'"],
  ["{ id: 'c6', name: 'Elektronik'", "{ id: 'c6', name: 'Elektronika'"],
  ["description: 'Soğuk içecek'", "description: 'Soyuq içki'"],
  ["description: 'Doğal kaynak suyu'", "description: 'Təbii bulaq suyu'"],
  ["description: 'Patates cipsi'", "description: 'Kartof çipsi'"],
  ["description: 'Karadeniz çayı'", "description: 'Qara dəniz çayı'"],
  ["description: 'Çamaşır deterjanı'", "description: 'Paltar yuyucu'"],
  ["description: 'Anti-kepek şampuan'", "description: 'Kəpək əleyhinə şampun'"],
  ["description: 'Günlük taze ekmek'", "description: 'Günlük təzə çörək'"],
  ["description: 'Alkalin pil'", "description: 'Qələvi batareya'"],
  ["description: 'Portakal aromalı'", "description: 'Portağal ətirli'"],
  ["description: 'Sütlü bisküvi'", "description: 'Südlü biskvit'"],
  ["address: 'Atatürk Caddesi No:12, İstanbul'", "address: 'Nizami küçəsi 12, Bakı'"],
  ["receiptFooter: 'Alışverişiniz için teşekkürler! Tekrar bekleriz.'", "receiptFooter: 'Alış-verişiniz üçün təşəkkür edirik! Yenidən gözləyirik.'"],
  ["cashierName: i % 3 === 0 ? 'Kasiyer Ahmet' : 'Admin Kullanıcı'", "cashierName: i % 3 === 0 ? 'Kassir Əhməd' : 'Admin İstifadəçi'"],

  // ── FIREBASE AUTH ERRORS
  ['Kullanıcı bulunamadı.', 'İstifadəçi tapılmadı.'],
  ['Şifre hatalı.', 'Şifrə yanlışdır.'],
  ['Geçersiz e-posta adresi.', 'Yanlış e-poçt ünvanı.'],
  ['E-posta veya şifre hatalı.', 'E-poçt və ya şifrə yanlışdır.'],
  ['Bu hesap devre dışı bırakılmış.', 'Bu hesab deaktivdir.'],
  ['Çok fazla başarısız deneme. Lütfen bekleyin.', 'Çox sayda uğursuz cəhd. Zəhmət olmasa gözləyin.'],
  ['Ağ bağlantısı hatası.', 'Şəbəkə bağlantısı xətası.'],
  ['Giriş başarısız.', 'Daxil olmaq uğursuz oldu.'],
  ['Oturum açık değil.', 'Sessiya açıq deyil.'],

  // ── LOGIN PAGE
  ["'Satış & Stok Yönetimi'", "'Satış & Stok İdarəetməsi'"],
  ['Sisteme erişmek için bilgilerinizi girin', 'Sistemə daxil olmaq üçün məlumatlarınızı daxil edin'],
  ['Giriş yapılıyor...', 'Daxil olunur...'],
  ['Giriş Yap', 'Daxil ol'],
  ['Hesap bilgilerinizi yöneticinizden alın.', 'Hesab məlumatlarınızı idarəçidən alın.'],
  ['Lütfen tüm alanları doldurun.', 'Zəhmət olmasa bütün xanaları doldurun.'],
  ["placeholder: 'ornek@magaza.com'", "placeholder: 'nümunə@mağaza.com'"],

  // ── SIDEBAR
  ["'Ana Menü'", "'Əsas Menyu'"],
  ["'Satış Geçmişi', null, true", "'Satış Tarixçəsi', null, true"],
  ["'İadeler', null, true", "'Geri Qaytarmalar', null, true"],
  ["'Yönetim'", "'İdarəetmə'"],
  ["'Market Stok'", "'Mağaza Stoqu'"],
  ["'Kategoriler', null, true", "'Kateqoriyalar', null, true"],
  ["'Raporlar', null, true", "'Hesabatlar', null, true"],
  ["'Kullanıcılar', null, true", "'İstifadəçilər', null, true"],
  ["'Ayarlar', null, true", "'Parametrlər', null, true"],
  ["'☀ Bugün'", "'☀ Bu gün'"],
  ["'Kazanç'", "'Gəlir'"],
  ["'🌙 Günü Bitir'", "'🌙 Günü Bitir'"],
  ["title: 'Çıkış Yap'", "title: 'Çıxış'"],
  ["currentUser?.role === 'admin' ? 'Admin' : 'Kasiyer'", "currentUser?.role === 'admin' ? 'Admin' : 'Kassir'"],
  [" + ' işlem'", " + ' əməliyyat'"],

  // ── DASHBOARD
  ["'📊 Panel'", "'📊 Lövhə'"],
  ["'Panel'", "'Lövhə'"],
  ["— İş Özeti'", "— İş Xülasəsi'"],
  ["'🛒 Satış Yap'", "'🛒 Satış et'"],
  ["'Bugünkü Ciro'", "'Günlük Dövriyyə'"],
  ["'Bu Hafta'", "'Bu Həftə'"],
  ["'Bu Ay'", "'Bu Ay'"],
  ["'Düşük Stok'", "'Az Stok'"],
  [" + ' tükenmiş'", " + ' tükənmiş'"],
  ["+ ' ürün'", "+ ' məhsul'"],
  ["'Son 7 Gün Ciro'", "'Son 7 Günün Dövriyyəsi'"],
  ["'En Çok Satan Ürünler'", "'Ən Çox Satılan Məhsullar'"],
  ["'Henüz veri yok'", "'Hələ məlumat yoxdur'"],
  [" + ' adet'", " + ' ədəd'"],
  ["'Son Satışlar'", "'Son Satışlar'"],
  ["'Tümü →'", "'Hamısı →'"],
  ["'Fiş No'", "'Qəbz №'"],
  ["'Tür'", "'Növ'"],
  ["'Tutar'", "'Məbləğ'"],
  ["'⚠ Stok Uyarıları'", "'⚠ Stok Xəbərdarlıqları'"],
  ["'Stoka Git →'", "'Stoka Get →'"],
  ["'✓ Tüm stoklar normal seviyede'", "'✓ Bütün stoklar normal səviyyədədir'"],
  ["s.type === 'retail' ? 'Perakende' : 'Toptan'", "s.type === 'retail' ? 'Pərakəndə' : 'Topdansatış'"],
  ["p.stock === 0 ? 'Tükendi' : 'Düşük'", "p.stock === 0 ? 'Tükəndi' : 'Az'"],

  // ── POS PAGE
  ["'🛒 Satış Yap'", "'🛒 Satış et'"],
  ["'Kasiyer: ' + currentUser?.name", "'Kassir: ' + currentUser?.name"],
  ["placeholder: '🔫 Barkod okut veya ürün ara...'", "placeholder: '🔫 Barkod oxudun və ya məhsul axtarın...'"],
  ["'Tüm Kategoriler'", "'Bütün Kateqoriyalar'"],
  ["'🔍 Ürün bulunamadı'", "'🔍 Məhsul tapılmadı'"],
  ["'❌ Tükendi'", "'❌ Tükəndi'"],
  ["'🛒 Sepet'", "'🛒 Səbət'"],
  ["'✏ ÖZEL'", "'✏ XÜSUSİ'"],
  ["+ '/adet'", "+ '/ədəd'"],
  ["'Fiyat:'", "'Qiymət:'"],
  ["title: 'Fiyatı düzenle'", "title: 'Qiyməti dəyiş'"],
  ["placeholder: 'Müşteri adı (isteğe bağlı)'", "placeholder: 'Müştəri adı (istəyə görə)'"],
  ["placeholder: 'Not (isteğe bağlı)'", "placeholder: 'Qeyd (istəyə görə)'"],
  ["'İndirim:'", "'Endirim:'"],
  ["'İndirim'", "'Endirim'"],
  ["'Ara Toplam'", "'Ara Cəm'"],
  ["'TOPLAM'", "'CƏMİ'"],
  ["'Bu ürün tükenmiş!'", "'Bu məhsul tükənmişdir!'"],
  ["'Maksimum stok miktarına ulaştınız!'", "'Maksimum stok hədinə çatdınız!'"],
  ["'Yetersiz stok!'", "'Stok kifayət etmir!'"],
  ["'Geçersiz fiyat!'", "'Yanlış qiymət!'"],
  ["'Fiyat güncellendi.'", "'Qiymət yeniləndi.'"],
  ["'Sepet boş!'", "'Səbət boşdur!'"],
  ["'Barkod bulunamadı: '", "'Barkod tapılmadı: '"],
  ["+ ' sepete eklendi ✓'", "+ ' səbətə əlavə edildi ✓'"],
  ["'Satış tamamlandı! Fiş No: '", "'Satış tamamlandı! Qəbz №: '"],
  ["}, 'Perakende')", "}, 'Pərakəndə')"],
  ["}, 'Toptan')", "}, 'Topdansatış')"],
  ["'Ürün eklenmedi'", "'Məhsul əlavə edilməyib'"],

  // ── RECEIPT MODAL
  ["'🧾 Satış Fişi'", "'🧾 Satış Qəbzi'"],
  ["'✓ Satış başarıyla tamamlandı!'", "'✓ Satış uğurla tamamlandı!'"],
  ["'SATIŞ FİŞİ'", "'SATIŞ QƏBZİ'"],
  ["'Fiş No:'", "'Qəbz №:'"],
  ["'Tarih:'", "'Tarix:'"],
  ["'Satış Türü:'", "'Satış növü:'"],
  ["'Kasiyer:'", "'Kassir:'"],
  ["'Müşteri:'", "'Müştəri:'"],
  ["'Telefon:'", "'Telefon:'"],
  ["'TOPLAM:'", "'CƏMİ:'"],
  ["(Özel)", "(Xüsusi)"],
  ["'QZ Tray bağlı — Termal yazıcı hazır'", "'QZ Tray qoşulub — Termal printer hazırdır'"],
  ["'✓ Yazdırıldı'", "'✓ Çap edildi'"],
  ["'⚠ QZ Tray bağlantı hatası. Tarayıcıdan yazdır butonu ile devam edebilirsiniz.'", "'⚠ QZ Tray bağlantı xətası. Brauzer çap düyməsi ilə davam edə bilərsiniz.'"],
  ["'💡 QZ Tray kurulu değil'", "'💡 QZ Tray qurulmayıb'"],
  ["'Xprinter\\'a direkt yazdırmak için '", "'Xprinter-ə birbaşa çap etmək üçün '"],
  ["' adresinden QZ Tray\\'i indirip kurun. Kurulduktan sonra bu sayfayı yenileyin.'", "' ünvanından QZ Tray-i yükləyin. Qurduqdan sonra səhifəni yeniləyin.'"],
  ["'⏳ Yazıcı kontrol ediliyor...'", "'⏳ Printer yoxlanılır...'"],
  ["'Kapat'", "'Bağla'"],
  ["'🖨️ Tarayıcıdan Yazdır'", "'🖨️ Brauzerdən Çap et'"],
  ["'⏳ Yazdırılıyor...'", "'⏳ Çap edilir...'"],
  ["'🖨 Xprinter Yazdir'", "'🖨 Xprinter Çap et'"],
  ["'⬇️ PDF İndir'", "'⬇️ PDF Yüklə'"],
  ["'Lütfen yazıcı seçin.'", "'Zəhmət olmasa printer seçin.'"],
  // ESC/POS
  ["'SATIS FISI'", "'SATIS QEBZI'"],
  ["padLR('Fis No:'", "padLR('Qebz No:'"],
  ["padLR('Tarih:'", "padLR('Tarix:'"],
  ["padLR('Tur:'", "padLR('Nov:'"],
  ["padLR('Kasiyer:'", "padLR('Kassir:'"],
  ["padLR('Musteri:'", "padLR('Mustəri:'"],
  ["padLR('Indirim:'", "padLR('Endirim:'"],
  ["padLR('TOPLAM:'", "padLR('CƏMİ:'"],
  // PDF
  ["doc.save('fis-'", "doc.save('qebz-'"],
  ["center('SATIS FISI'", "center('SATIS QEBZI'"],
  ["doc.text('Fis No: '", "doc.text('Qebz No: '"],
  ["'Tür: ' + (sale.type === 'retail' ? 'Perakende' : 'Toptan')", "'Nov: ' + (sale.type === 'retail' ? 'Pərakəndə' : 'Topdansatış')"],
  ["doc.text('Kasiyer: '", "doc.text('Kassir: '"],
  ["doc.text('Musteri: '", "doc.text('Müştəri: '"],
  ["'Indirim:'", "'Endirim:'"],
  ["'TOPLAM:'", "'CƏMİ:'"],
  // buildPrintHTML
  ["adet &times;", "ədəd &times;"],
  ["\"SATIŞ FİŞİ\"", "\"SATIŞ QƏBZİ\""],
  ['Fiş — ', 'Qəbz — '],
  ['"Fiş No:"', '"Qəbz №:"'],
  ['"Tarih:"', '"Tarix:"'],
  ['"Satış Türü:"', '"Satış növü:"'],
  ['"Kasiyer:"', '"Kassir:"'],
  ['"Müşteri:"', '"Müştəri:"'],
  ['"İndirim:"', '"Endirim:"'],
  ['settings.storeName || \'Mağaza\'', "settings.storeName || 'Mağaza'"],

  // ── PRODUCTS PAGE
  ["'📦 Ürünler'", "'📦 Məhsullar'"],
  ["+ ' ürün gösteriliyor'", "+ ' məhsul göstərilir'"],
  ["viewMode === 'grid' ? '☰ Liste' : '⊞ Kart'", "viewMode === 'grid' ? '☰ Siyahı' : '⊞ Kart'"],
  ["'+ Yeni Ürün'", "'+ Yeni Məhsul'"],
  ["placeholder: 'Ürün adı, SKU, barkod...'", "placeholder: 'Məhsul adı, SKU, barkod...'"],
  ["'Tüm Stoklar'", "'Bütün Stoklar'"],
  ["'✓ Normal'", "'✓ Normal'"],
  ["'⚠ Düşük'", "'⚠ Az'"],
  ["'✕ Tükendi'", "'✕ Tükəndi'"],
  ["React.createElement('p', null, 'Ürün bulunamadı')", "React.createElement('p', null, 'Məhsul tapılmadı')"],
  ["'Perakende'", "'Pərakəndə'"],
  ["'Toptan'", "'Topdansatış'"],
  ["p.active ? 'Aktif' : 'Pasif'", "p.active ? 'Aktiv' : 'Passiv'"],
  ["title: 'Duzenle'", "title: 'Redaktə et'"],
  ["title: 'Etiket Yazdir'", "title: 'Etiket Çap et'"],
  ["'✏️ Düzenle'", "'✏️ Redaktə et'"],
  ["addToast(editProduct ? 'Ürün güncellendi.' : 'Ürün eklendi.', 'success')", "addToast(editProduct ? 'Məhsul yeniləndi.' : 'Məhsul əlavə edildi.', 'success')"],
  ["'Bu ürünü silmek istediğinize emin misiniz?'", "'Bu məhsulu silmək istədiyinizdən əminsiniz?'"],
  ["addToast('Ürün silindi.', 'info')", "addToast('Məhsul silindi.', 'info')"],

  // ── LABEL PRINT MODAL
  ["'🏷️ Barkod Etiketi Yazdir — 30x22mm'", "'🏷️ Barkod Etiketi Çap et — 30x22mm'"],
  ["'⚠ Bu urun icin barkod tanimli degil. Once urunu duzenleyip barkod ekleyin veya otomatik olusturun.'", "'⚠ Bu məhsul üçün barkod təyin edilməyib. Əvvəlcə məhsulu redaktə edin.'"],
  ["'Onizleme (gercek boyut)'", "'Önizləmə (real ölçü)'"],
  ["'Barkod yok'", "'Barkod yoxdur'"],
  ["'Kac Adet Etiket?'", "'Neçə ədəd etiket?'"],
  ["'Fiyat Turu'", "'Qiymət növü'"],
  ["pt === 'retail' ? 'Perakende' : 'Toptan'", "pt === 'retail' ? 'Pərakəndə' : 'Topdansatış'"],
  ["'Popup engellendi. Tarayici ayarlarindan popup izni verin.'", "'Popup bloklandı. Brauzer parametrlərindən icazə verin.'"],
  ["'Barkod Yok'", "'Barkod Yoxdur'"],

  // ── PRODUCT MODAL
  ["product ? '✏️ Ürünü Düzenle' : '+ Yeni Ürün'", "product ? '✏️ Məhsulu Redaktə et' : '+ Yeni Məhsul'"],
  ["'Ürün Görseli'", "'Məhsul Şəkli'"],
  ["'🖼️ Galeriden Seç'", "'🖼️ Qalereyadan Seç'"],
  ["'ya da emoji seç:'", "'və ya emoji seç:'"],
  ["'Ürün Adı *'", "'Məhsulun adı *'"],
  ["placeholder: 'Ürün adı'", "placeholder: 'Məhsul adı'"],
  ["'Marka'", "'Marka'"],
  ["placeholder: 'Marka adı'", "placeholder: 'Marka adı'"],
  ["React.createElement('option', { value: '' }, 'Seçiniz')", "React.createElement('option', { value: '' }, 'Seçin')"],
  ["'Alış Fiyatı'", "'Alış Qiyməti'"],
  ["'Perakende Fiyatı *'", "'Pərakəndə Qiyməti *'"],
  ["'Toptan Fiyatı *'", "'Topdan Qiyməti *'"],
  ["'📦 Stok Bilgileri'", "'📦 Stok Məlumatları'"],
  ["'🏪 Market Stoğu'", "'🏪 Mağaza Stoqu'"],
  ["'Mevcut *'", "'Mövcud *'"],
  ["'Min. Eşik'", "'Min. Hədd'"],
  ["'🏭 Depo Stoğu'", "'🏭 Anbar Stoqu'"],
  ["'Mevcut'", "'Mövcud'"],
  ["'Birim'", "'Vahid'"],
  ["['adet', 'kutu', 'kg', 'litre', 'paket', 'koli', 'metre']", "['ədəd', 'qutu', 'kq', 'litr', 'paket', 'koli', 'metr']"],
  ["value: form.unit || 'adet'", "value: form.unit || 'ədəd'"],
  ["'Açıklama'", "'Təsvir'"],
  ["placeholder: 'Ürün hakkında notlar...'", "placeholder: 'Məhsul haqqında qeydlər...'"],
  ["form.active ? 'Aktif ürün' : 'Pasif ürün'", "form.active ? 'Aktiv məhsul' : 'Passiv məhsul'"],
  ["'İptal'", "'Ləğv et'"],
  ["product ? '💾 Güncelle' : '+ Ekle'", "product ? '💾 Yenilə' : '+ Əlavə et'"],
  ["'Ürün kodu'", "'Məhsul kodu'"],
  ["'Otomatik EAN-13 barkod uret'", "'Avtomatik EAN-13 barkod yarat'"],
  ["'⚡ Otomatik'", "'⚡ Avtomatik'"],

  // ── INVENTORY PAGE
  ["'🏪 Stok Yönetimi'", "'🏪 Stok İdarəetməsi'"],
  ["+ ' aktif ürün takip ediliyor'", "+ ' aktiv məhsul izlənilir'"],
  ["'Geçersiz stok miktarı'", "'Yanlış stok miqdarı'"],
  ["+ ' stoku güncellendi: '", "+ ' stoku yeniləndi: '"],

  // ── SETTINGS PAGE
  ["'⚙️ Ayarlar'", "'⚙️ Parametrlər'"],
  ["'Mağaza Bilgileri'", "'Mağaza Məlumatları'"],
  ["'Mağaza Adı'", "'Mağaza adı'"],
  ["'Adres'", "'Ünvan'"],
  ["'Para Birimi'", "'Valyuta'"],
  ["'Fiş Alt Yazısı'", "'Qəbz alt yazısı'"],
  ["'Vergi Oranı (%)'", "'Vergi dərəcəsi (%)'"],
  ["'Düşük Stok Eşiği'", "'Az Stok Həddi'"],
  ["'Ayarlar kaydedildi.'", "'Parametrlər saxlanıldı.'"],
  ["'JSON Yedek İndir'", "'JSON Yedəyi Yüklə'"],
  ["'Yedeği Geri Yükle'", "'Yedəyi Bərpa et'"],
  ["'Dosya Seç'", "'Fayl Seç'"],
  ["'Yedek Dosyası Seç'", "'Yedək Faylı Seç'"],
  ["'⬆️ Bu Yedeği Buluta Yükle (Mevcut Verilerin Üzerine Yazar)'", "'⬆️ Bu Yedəyi Bərpa et (mövcud məlumatların üzərinə yazır)'"],
  ["'Mevcut veriler siliniyor…'", "'Mövcud məlumatlar silinir…'"],
  ["'Yeni veriler yükleniyor…'", "'Yeni məlumatlar yüklənir…'"],
  ["'Veriler başarıyla güncellendi!'", "'Məlumatlar uğurla yeniləndi!'"],
  ["'Yükleme hatası: '", "'Yükləmə xətası: '"],
  ["'⏳ Buluta yükleniyor…'", "'⏳ Bərpa edilir…'"],

  // ── REPORTS PAGE
  ["'📈 Raporlar'", "'📈 Hesabatlar'"],
  ["'Ciro'", "'Dövriyyə'"],
  ["'Maliyet'", "'Maya dəyəri'"],
  ["'Kar'", "'Mənfəət'"],

  // ── END OF DAY MODAL
  ["'Günlük Rapor'", "'Günlük Hesabat'"],
  ["'Toplam Ciro'", "'Cəmi Dövriyyə'"],
  ["'Toplam İşlem'", "'Cəmi Əməliyyat'"],
  ["'Ortalama Sepet'", "'Orta Səbət'"],
  ["'Toplam Ürün'", "'Cəmi Məhsul'"],
  ["'Kasiyer Özeti'", "'Kassir Xülasəsi'"],
  ["'Raporu Yazdır'", "'Hesabatı Çap et'"],

  // ── CONFIRM DIALOG
  ["'Emin misiniz?'", "'Əminsiniz?'"],
  ["'Bu işlemi geri alamazsınız.'", "'Bu əməliyyatı geri ala bilməzsiniz.'"],
  ["'Evet, Sil'", "'Bəli, Sil'"],
  ["'Hayır'", "'Xeyr'"],
  ["'Onaylıyorum'", "'Təsdiqləyirəm'"],

  // ── TOPBAR
  ["' işlem bugün'", "' əməliyyat bu gün'"],

  // ── LOCALE
  ["toLocaleDateString('tr-TR', { weekday: 'short' })", "toLocaleDateString('az-AZ', { weekday: 'short' })"],
  ["toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' })", "toLocaleDateString('az-AZ', { month: 'short', year: '2-digit' })"],
  ["toLocaleDateString('tr-TR')", "toLocaleDateString('az-AZ')"],
  ["toLocaleString('tr-TR')", "toLocaleString('az-AZ')"],
  ["toLocaleTimeString('tr-TR')", "toLocaleTimeString('az-AZ')"],
  ["'tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }", "'az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }"],
  ["'tr-TR', {minimumFractionDigits:2,maximumFractionDigits:2}", "'az-AZ', {minimumFractionDigits:2,maximumFractionDigits:2}"],
  ["n.toLocaleString('tr-TR'", "n.toLocaleString('az-AZ'"],

  // ── HTML RECEIPT inside buildPrintHTML
  ['<html lang="tr">\n<head>\n<meta charset="UTF-8">\n<title>Fiş', '<html lang="az">\n<head>\n<meta charset="UTF-8">\n<title>Qəbz'],

  // ── REMOVE DEBUG LOGS
  ["    console.log('[DEBUG] fbStreamSales fired, count:', s.length, 'first createdAt:', s[0]?.createdAt);\n      ", "    "],
  ["    console.log('[DEBUG] completeSale optimistic, total:', total, 'createdAt:', sale.createdAt);\n    ", "    "],

  // ── EXTRA STRINGS
  ["'Ürünler'", "'Məhsullar'"],
  ["'Depo'", "'Anbar'"],
  ["'Transfer'", "'Köçürmə'"],
  ["'Satış Yap'", "'Satış et'"],
];

let notFound = [];
for (const [old, nw] of replacements) {
  if (c.includes(old)) {
    c = c.split(old).join(nw);
  } else {
    notFound.push(old.slice(0, 60));
  }
}

fs.writeFileSync('index.html', c, 'utf8');
console.log('✓ Çeviri tamamlandı!');
if (notFound.length > 0) {
  console.log('\nTapılmayan stringlər:');
  notFound.forEach(s => console.log('  - ' + s));
}
