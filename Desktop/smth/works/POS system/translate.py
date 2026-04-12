# -*- coding: utf-8 -*-
# MarketPOS: Türkçe → Azerbaycanca tam çeviri scripti
import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# ─────────────────────────────────────────────────────────────────
# DİKKAT: Uzun string'ler önce gelsin (kısmi eşleşme önlemek için)
# ─────────────────────────────────────────────────────────────────
replacements = [

    # ── HEAD ─────────────────────────────────────────────────────
    ('lang="tr"', 'lang="az"'),
    ('MarketPOS — Satış ve Stok Yönetim Sistemi', 'MarketPOS — Satış və Stok İdarəetmə Sistemi'),
    ('"Satış ve Stok Yönetim Sistemi"', '"Satış və Stok İdarəetmə Sistemi"'),
    ('QZ Tray yüklenmedi, normal yazdırma kullanılacak', 'QZ Tray yüklənmədi, adi çap istifadə olunacaq'),
    ('JsBarcode yuklenemedi', 'JsBarcode yüklənmədi'),
    ('Firebase Servis Katmanı', 'Firebase Xidmət Qatı'),

    # ── SEED DATA ────────────────────────────────────────────────
    ('Admin Kullanıcı', 'Admin İstifadəçi'),
    ('Kasiyer Ahmet', 'Kassir Əhməd'),
    # Categories
    ("{ id: 'c1', name: 'İçecekler'", "{ id: 'c1', name: 'İçkilər'"),
    ("{ id: 'c2', name: 'Atıştırmalıklar'", "{ id: 'c2', name: 'Qəlyanaltılar'"),
    ("{ id: 'c3', name: 'Temizlik'", "{ id: 'c3', name: 'Təmizlik'"),
    ("{ id: 'c4', name: 'Kişisel Bakım'", "{ id: 'c4', name: 'Şəxsi Qayğı'"),
    ("{ id: 'c5', name: 'Gıda'", "{ id: 'c5', name: 'Qida'"),
    ("{ id: 'c6', name: 'Elektronik'", "{ id: 'c6', name: 'Elektronika'"),
    # Product descriptions
    ("description: 'Soğuk içecek'", "description: 'Soyuq içki'"),
    ("description: 'Doğal kaynak suyu'", "description: 'Təbii bulaq suyu'"),
    ("description: 'Patates cipsi'", "description: 'Kartof çipsi'"),
    ("description: 'Karadeniz çayı'", "description: 'Qara dəniz çayı'"),
    ("description: 'Çamaşır deterjanı'", "description: 'Paltar yuyucu'"),
    ("description: 'Anti-kepek şampuan'", "description: 'Kəpək əleyhinə şampun'"),
    ("description: 'Günlük taze ekmek'", "description: 'Günlük təzə çörək'"),
    ("description: 'Alkalin pil'", "description: 'Qələvi batareya'"),
    ("description: 'Portakal aromalı'", "description: 'Portağal ətirli'"),
    ("description: 'Sütlü bisküvi'", "description: 'Südlü biskvit'"),
    # Seed settings
    ("address: 'Atatürk Caddesi No:12, İstanbul'", "address: 'Nizami küçəsi 12, Bakı'"),
    ("receiptFooter: 'Alışverişiniz için teşekkürler! Tekrar bekleriz.'", "receiptFooter: 'Alış-verişiniz üçün təşəkkür edirik! Yenidən gözləyirik.'"),
    # Seed sales cashier
    ("cashierName: i % 3 === 0 ? 'Kasiyer Ahmet' : 'Admin Kullanıcı'", "cashierName: i % 3 === 0 ? 'Kassir Əhməd' : 'Admin İstifadəçi'"),

    # ── FIREBASE AUTH ERRORS ─────────────────────────────────────
    ('Oturum açık değil.', 'Sessiya açıq deyil.'),
    ('Kullanıcı bulunamadı.', 'İstifadəçi tapılmadı.'),
    ('Şifre hatalı.', 'Şifrə yanlışdır.'),
    ('Geçersiz e-posta adresi.', 'Yanlış e-poçt ünvanı.'),
    ('E-posta veya şifre hatalı.', 'E-poçt və ya şifrə yanlışdır.'),
    ('Bu hesap devre dışı bırakılmış.', 'Bu hesab deaktivdir.'),
    ('Çok fazla başarısız deneme. Lütfen bekleyin.', 'Çox sayda uğursuz cəhd. Zəhmət olmasa gözləyin.'),
    ('Ağ bağlantısı hatası.', 'Şəbəkə bağlantısı xətası.'),
    ('Giriş başarısız.', 'Daxil olmaq uğursuz oldu.'),

    # ── LOGIN PAGE ───────────────────────────────────────────────
    ("'Satış & Stok Yönetimi'", "'Satış & Stok İdarəetməsi'"),
    ('Sisteme erişmek için bilgilerinizi girin', 'Sistemə daxil olmaq üçün məlumatlarınızı daxil edin'),
    ("'Giriş Yap'", "'Daxil ol'"),
    ('Giriş Yap', 'Daxil ol'),
    ('Giriş yapılıyor...', 'Daxil olunur...'),
    ('Hesap bilgilerinizi yöneticinizden alın.', 'Hesab məlumatlarınızı idarəçidən alın.'),
    ('Lütfen tüm alanları doldurun.', 'Zəhmət olmasa bütün xanaları doldurun.'),
    ("'E-posta'", "'E-poçt'"),
    ("'Şifre'", "'Şifrə'"),
    ("placeholder: 'ornek@magaza.com'", "placeholder: 'nümunə@mağaza.com'"),

    # ── SIDEBAR / NAV ────────────────────────────────────────────
    ("'Ana Menü'", "'Əsas Menyu'"),
    ("'Panel'", "'Lövhə'"),
    ("'Satış Geçmişi'", "'Satış Tarixçəsi'"),
    ("'İadeler'", "'Geri Qaytarmalar'"),
    ("'Yönetim'", "'İdarəetmə'"),
    ("'Ürünler'", "'Məhsullar'"),
    ("'Market Stok'", "'Mağaza Stoqu'"),
    ("'Depo'", "'Anbar'"),
    ("'Transfer'", "'Köçürmə'"),
    ("'Kategoriler'", "'Kateqoriyalar'"),
    ("'Raporlar'", "'Hesabatlar'"),
    ("'Sistem'", "'Sistem'"),
    ("'Kullanıcılar'", "'İstifadəçilər'"),
    ("'Ayarlar'", "'Parametrlər'"),
    ("'☀ Bugün'", "'☀ Bu gün'"),
    ("'Kazanç'", "'Gəlir'"),
    ("'🌙 Günü Bitir'", "'🌙 Günü Bitir'"),
    ("title: 'Çıkış Yap'", "title: 'Çıxış'"),
    ("currentUser?.role === 'admin' ? 'Admin' : 'Kasiyer'", "currentUser?.role === 'admin' ? 'Admin' : 'Kassir'"),
    (" + ' işlem'", " + ' əməliyyat'"),

    # ── DASHBOARD ────────────────────────────────────────────────
    ("'📊 Panel'", "'📊 Lövhə'"),
    ("'İş Özeti'", "'İş Xülasəsi'"),
    ("'Bugünkü Ciro'", "'Günlük Dövriyyə'"),
    ("'Bu Hafta'", "'Bu Həftə'"),
    ("'Bu Ay'", "'Bu Ay'"),
    ("'Düşük Stok'", "'Az Stok'"),
    (" + ' tükenmiş'", " + ' tükənmiş'"),
    ("'Son 7 Gün Ciro'", "'Son 7 Günün Dövriyyəsi'"),
    ("'En Çok Satan Ürünler'", "'Ən Çox Satılan Məhsullar'"),
    ("'Henüz veri yok'", "'Hələ məlumat yoxdur'"),
    ("'Son Satışlar'", "'Son Satışlar'"),
    ("'Tümü →'", "'Hamısı →'"),
    ("'Fiş No'", "'Qəbz №'"),
    ("'Tür'", "'Növ'"),
    ("'Tutar'", "'Məbləğ'"),
    ("'⚠ Stok Uyarıları'", "'⚠ Stok Xəbərdarlıqları'"),
    ("'Stoka Git →'", "'Stoka Get →'"),
    ("'✓ Tüm stoklar normal seviyede'", "'✓ Bütün stoklar normal səviyyədədir'"),
    ("'Tükendi'", "'Tükəndi'"),
    ("'Düşük'", "'Az'"),
    ("'Durum'", "'Vəziyyət'"),
    # Product/Stock columns
    ("React.createElement('th', null, 'Ürün'), React.createElement('th', null, 'Stok'), React.createElement('th', null, 'Durum')",
     "React.createElement('th', null, 'Məhsul'), React.createElement('th', null, 'Stok'), React.createElement('th', null, 'Vəziyyət')"),

    # ── POS PAGE ─────────────────────────────────────────────────
    ("'🛒 Satış Yap'", "'🛒 Satış et'"),
    ("'Kasiyer: ' + currentUser?.name", "'Kassir: ' + currentUser?.name"),
    ("placeholder: '🔫 Barkod okut veya ürün ara...'", "placeholder: '🔫 Barkod oxudun və ya məhsul axtarın...'"),
    ("'Tüm Kategoriler'", "'Bütün Kateqoriyalar'"),
    ("'🔍 Ürün bulunamadı'", "'🔍 Məhsul tapılmadı'"),
    ("'❌ Tükendi'", "'❌ Tükəndi'"),
    ("'Stok: '", "'Stok: '"),
    ("'🛒 Sepet'", "'🛒 Səbət'"),
    ("'✏ ÖZEL'", "'✏ XÜSUSI'"),
    ("+ '/adet'", "+ '/ədəd'"),
    ("'Fiyat:'", "'Qiymət:'"),
    ("title: 'Fiyatı düzenle'", "title: 'Qiyməti redaktə et'"),
    ("placeholder: 'Müşteri adı (isteğe bağlı)'", "placeholder: 'Müştəri adı (istəyə görə)'"),
    ("placeholder: 'Not (isteğe bağlı)'", "placeholder: 'Qeyd (istəyə görə)'"),
    ("'İndirim:'", "'Endirim:'"),
    ("'Ara Toplam'", "'Ara Cəm'"),
    ("'İndirim'", "'Endirim'"),
    ("'TOPLAM'", "'CƏMİ'"),
    ("✓ Satışı Tamamla", "✓ Satışı Tamamla"),
    ("'Bu ürün tükenmiş!'", "'Bu məhsul tükənmişdir!'"),
    ("'Maksimum stok miktarına ulaştınız!'", "'Maksimum stok həddine çatdınız!'"),
    ("'Yetersiz stok!'", "'Stok kifayət etmir!'"),
    ("'Geçersiz fiyat!'", "'Yanlış qiymət!'"),
    ("'Fiyat güncellendi.'", "'Qiymət yeniləndi.'"),
    ("'Sepet boş!'", "'Səbət boşdur!'"),
    ("'Barkod bulunamadı: '", "'Barkod tapılmadı: '"),
    ("product.name + ' sepete eklendi ✓'", "product.name + ' səbətə əlavə edildi ✓'"),
    ("'Satış tamamlandı! Fiş No: '", "'Satış tamamlandı! Qəbz №: '"),
    # Perakende/Toptan buttons
    ("}, 'Perakende')", "}, 'Pərakəndə')"),
    ("}, 'Toptan')", "}, 'Topdansatış')"),

    # ── RECEIPT / QZ ─────────────────────────────────────────────
    ("'🧾 Satış Fişi'", "'🧾 Satış Qəbzi'"),
    ("'✓ Satış başarıyla tamamlandı!'", "'✓ Satış uğurla tamamlandı!'"),
    ("'SATIŞ FİŞİ'", "'SATIŞ QƏBZİ'"),
    ("'Fiş No:'", "'Qəbz №:'"),
    ("'Tarih:'", "'Tarix:'"),
    ("'Saat:'", "'Saat:'"),
    ("'Satış Türü:'", "'Satış növü:'"),
    ("'Kasiyer:'", "'Kassir:'"),
    ("'Müşteri:'", "'Müştəri:'"),
    ("'Telefon:'", "'Telefon:'"),
    ("'İndirim:'", "'Endirim:'"),
    ("'TOPLAM:'", "'CƏMİ:'"),
    ("(Özel)", "(Xüsusi)"),
    # QZ/Print messages
    ("'QZ Tray bağlı — Termal yazıcı hazır'", "'QZ Tray qoşulub — Termal printer hazırdır'"),
    ("'✓ Yazdırıldı'", "'✓ Çap edildi'"),
    ("'⚠ QZ Tray bağlantı hatası. Tarayıcıdan yazdır butonu ile devam edebilirsiniz.'",
     "'⚠ QZ Tray bağlantı xətası. Brauzer çap düyməsi ilə davam edə bilərsiniz.'"),
    ("'💡 QZ Tray kurulu değil'", "'💡 QZ Tray qurulmayıb'"),
    ('"Xprinter\'a direkt yazdırmak için "', '"Xprinter-ə birbaşa çap etmək üçün "'),
    ('" adresinden QZ Tray\'i indirip kurun. Kurulduktan sonra bu sayfayı yenileyin."',
     '" ünvanından QZ Tray-i yükləyin. Qurduqdan sonra səhifəni yeniləyin."'),
    ("'⏳ Yazıcı kontrol ediliyor...'", "'⏳ Printer yoxlanılır...'"),
    ("'Kapat'", "'Bağla'"),
    ("'🖨️ Tarayıcıdan Yazdır'", "'🖨️ Brauzerdən Çap et'"),
    ("'⏳ Yazdırılıyor...'", "'⏳ Çap edilir...'"),
    ("'🖨 Xprinter Yazdir'", "'🖨 Xprinter Çap et'"),
    ("'⬇️ PDF İndir'", "'⬇️ PDF Yüklə'"),
    ("'Lütfen yazıcı seçin.'", "'Zəhmət olmasa printer seçin.'"),
    # ESC/POS receipt labels
    ("'SATIS FISI'", "'SATIS QEBZI'"),
    ("padLR('Fis No:'", "padLR('Qebz No:'"),
    ("padLR('Tarih:'", "padLR('Tarix:'"),
    ("padLR('Saat:'", "padLR('Saat:'"),
    ("sale.type === 'retail' ? 'Perakende' : 'Toptan'", "sale.type === 'retail' ? 'Pərakəndə' : 'Topdansatış'"),
    ("padLR('Kasiyer:'", "padLR('Kassir:'"),
    ("padLR('Musteri:'", "padLR('Müştəri:'"),
    ("padLR('Indirim:'", "padLR('Endirim:'"),
    ("padLR('TOPLAM:'", "padLR('CƏMİ:'"),
    # PDF labels
    ("'Fis No: '", "'Qebz No: '"),
    ("'Tür: '", "'Növ: '"),
    ("'Musteri: '", "'Müştəri: '"),
    ("'Indirim:'", "'Endirim:'"),
    ("'TOPLAM:'", "'CƏMİ:'"),
    ("'SATIS FISI'", "'SATIS QEBZI'"),
    ("doc.save('fis-'", "doc.save('qebz-'"),
    # buildPrintHTML
    ("adet &times;", "ədəd &times;"),
    ("'İndirim:'", "'Endirim:'"),
    ('"SATIŞ FİŞİ"', '"SATIŞ QƏBZİ"'),
    ('Fiş — ', 'Qəbz — '),
    ('"Fiş No:"', '"Qəbz №:"'),
    ('"Tarih:"', '"Tarix:"'),
    ('"Satış Türü:"', '"Satış növü:"'),
    ('"Kasiyer:"', '"Kassir:"'),
    ('"Müşteri:"', '"Müştəri:"'),
    ('"İndirim:"', '"Endirim:"'),

    # ── PRODUCTS PAGE ────────────────────────────────────────────
    ("'📦 Ürünler'", "'📦 Məhsullar'"),
    ("+ ' ürün gösteriliyor'", "+ ' məhsul göstərilir'"),
    ("viewMode === 'grid' ? '☰ Liste' : '⊞ Kart'", "viewMode === 'grid' ? '☰ Siyahı' : '⊞ Kart'"),
    ("'+ Yeni Ürün'", "'+ Yeni Məhsul'"),
    ("placeholder: 'Ürün adı, SKU, barkod...'", "placeholder: 'Məhsul adı, SKU, barkod...'"),
    ("'Tüm Stoklar'", "'Bütün Stoklar'"),
    ("'✓ Normal'", "'✓ Normal'"),
    ("'⚠ Düşük'", "'⚠ Az'"),
    ("'✕ Tükendi'", "'✕ Tükəndi'"),
    ("React.createElement('p', null, 'Ürün bulunamadı')", "React.createElement('p', null, 'Məhsul tapılmadı')"),
    ("'Perakende'", "'Pərakəndə'"),
    ("'Toptan'", "'Topdansatış'"),
    ("'Stok: ' + p.stock", "'Stok: ' + p.stock"),
    ("p.active ? 'Aktif' : 'Pasif'", "p.active ? 'Aktiv' : 'Passiv'"),
    ("title: 'Duzenle'", "title: 'Redaktə et'"),
    ("title: 'Etiket Yazdir'", "title: 'Etiket Çap et'"),
    ("title: 'Sil'", "title: 'Sil'"),
    ("'✏️ Düzenle'", "'✏️ Redaktə et'"),
    ("'🏷️ Etiket'", "'🏷️ Etiket'"),
    # Table headers - products list
    ("React.createElement('th', null, 'Ürün'), React.createElement('th', null, 'SKU'), React.createElement('th', null, 'Kategori'),\n                React.createElement('th', null, 'Alış'), React.createElement('th', null, 'Perakende'), React.createElement('th', null, 'Toptan'),\n                React.createElement('th', null, 'Stok'), React.createElement('th', null, 'Durum'), React.createElement('th', null, '')",
     "React.createElement('th', null, 'Məhsul'), React.createElement('th', null, 'SKU'), React.createElement('th', null, 'Kateqoriya'),\n                React.createElement('th', null, 'Alış'), React.createElement('th', null, 'Pərakəndə'), React.createElement('th', null, 'Topdansatış'),\n                React.createElement('th', null, 'Stok'), React.createElement('th', null, 'Vəziyyət'), React.createElement('th', null, '')"),
    ("saveProduct(p); setShowModal(false); addToast(editProduct ? 'Ürün güncellendi.' : 'Ürün eklendi.', 'success')",
     "saveProduct(p); setShowModal(false); addToast(editProduct ? 'Məhsul yeniləndi.' : 'Məhsul əlavə edildi.', 'success')"),
    ("'Bu ürünü silmek istediğinize emin misiniz?'", "'Bu məhsulu silmək istədiyinizdən əminsiniz?'"),
    ("addToast('Ürün silindi.', 'info')", "addToast('Məhsul silindi.', 'info')"),

    # ── LABEL PRINT MODAL ────────────────────────────────────────
    ("'🏷️ Barkod Etiketi Yazdir — 30x22mm'", "'🏷️ Barkod Etiketi Çap et — 30x22mm'"),
    ("'⚠ Bu urun icin barkod tanimli degil. Once urunu duzenleyip barkod ekleyin veya otomatik olusturun.'",
     "'⚠ Bu məhsul üçün barkod təyin edilməyib. Əvvəlcə məhsulu redaktə edin.'"),
    ("'✓ Barkod: '", "'✓ Barkod: '"),
    ("'Onizleme (gercek boyut)'", "'Önizləmə (real ölçü)'"),
    ("'Barkod yok'", "'Barkod yoxdur'"),
    ("'Kac Adet Etiket?'", "'Neçə ədəd etiket?'"),
    ("'Fiyat Turu'", "'Qiymət növü'"),
    ("pt === 'retail' ? 'Perakende' : 'Toptan'", "pt === 'retail' ? 'Pərakəndə' : 'Topdansatış'"),
    ("'Popup engellendi. Tarayici ayarlarindan popup izni verin.'", "'Popup bloklandı. Brauzer parametrlərindən icazə verin.'"),
    ("'Barkod Yok'", "'Barkod Yoxdur'"),
    ("'Etiket'", "'Etiket'"),

    # ── PRODUCT MODAL ────────────────────────────────────────────
    ("product ? '✏️ Ürünü Düzenle' : '+ Yeni Ürün'", "product ? '✏️ Məhsulu Redaktə et' : '+ Yeni Məhsul'"),
    ("'Ürün Görseli'", "'Məhsul Şəkli'"),
    ("'📷 Kamera'", "'📷 Kamera'"),
    ("'🖼️ Galeriden Seç'", "'🖼️ Qalereyadan Seç'"),
    ("'ya da emoji seç:'", "'və ya emoji seç:'"),
    ("'Ürün Adı *'", "'Məhsulun adı *'"),
    ("placeholder: 'Ürün adı'", "placeholder: 'Məhsul adı'"),
    ("'Marka'", "'Marka'"),
    ("placeholder: 'Marka adı'", "placeholder: 'Marka adı'"),
    ("'Barkod'", "'Barkod'"),
    ("'Kategori'", "'Kateqoriya'"),
    ("React.createElement('option', { value: '' }, 'Seçiniz')", "React.createElement('option', { value: '' }, 'Seçin')"),
    ("'Alış Fiyatı'", "'Alış Qiyməti'"),
    ("'Perakende Fiyatı *'", "'Pərakəndə Qiyməti *'"),
    ("'Toptan Fiyatı *'", "'Topdan Qiyməti *'"),
    ("'📦 Stok Bilgileri'", "'📦 Stok Məlumatları'"),
    ("'🏪 Market Stoğu'", "'🏪 Mağaza Stoqu'"),
    ("'Mevcut *'", "'Mövcud *'"),
    ("'Min. Eşik'", "'Min. Hədd'"),
    ("'🏭 Depo Stoğu'", "'🏭 Anbar Stoqu'"),
    ("'Mevcut'", "'Mövcud'"),
    ("'Birim'", "'Vahid'"),
    ("['adet', 'kutu', 'kg', 'litre', 'paket', 'koli', 'metre']",
     "['ədəd', 'qutu', 'kq', 'litr', 'paket', 'koli', 'metr']"),
    ("value: form.unit || 'adet'", "value: form.unit || 'ədəd'"),
    ("'Açıklama'", "'Təsvir'"),
    ("placeholder: 'Ürün hakkında notlar...'", "placeholder: 'Məhsul haqqında qeydlər...'"),
    ("form.active ? 'Aktif ürün' : 'Pasif ürün'", "form.active ? 'Aktiv məhsul' : 'Passiv məhsul'"),
    ("'İptal'", "'Ləğv et'"),
    ("product ? '💾 Güncelle' : '+ Ekle'", "product ? '💾 Yenilə' : '+ Əlavə et'"),
    ("'Ürün kodu'", "'Məhsul kodu'"),
    ("'Otomatik EAN-13 barkod uret'", "'Avtomatik EAN-13 barkod yarat'"),
    ("'⚡ Otomatik'", "'⚡ Avtomatik'"),

    # ── INVENTORY PAGE ───────────────────────────────────────────
    ("'🏪 Stok Yönetimi'", "'🏪 Stok İdarəetməsi'"),
    ("+ ' aktif ürün takip ediliyor'", "+ ' aktiv məhsul izlənilir'"),
    ("'Geçersiz stok miktarı'", "'Yanlış stok miqdarı'"),
    ("+ ' stoku güncellendi: '", "+ ' stoku yeniləndi: '"),
    ("'Stok Durumu'", "'Stok Vəziyyəti'"),
    ("'Tüm Stoklar'", "'Bütün Stoklar'"),
    ("'✓ Normal Stok'", "'✓ Normal Stok'"),
    ("'⚠ Düşük Stok'", "'⚠ Az Stok'"),
    ("'✕ Tükendi'", "'✕ Tükəndi'"),
    ("'Geçersiz stok miktarı'", "'Yanlış stok miqdarı'"),

    # ── WAREHOUSE PAGE ───────────────────────────────────────────
    ("'🏭 Depo'", "'🏭 Anbar'"),
    ("'Depo Stoğu'", "'Anbar Stoqu'"),
    ("'Stok güncellendi.'", "'Stok yeniləndi.'"),

    # ── TRANSFER PAGE ────────────────────────────────────────────
    ("'🔄 Transfer'", "'🔄 Köçürmə'"),
    ("'Depodan Markete Transfer'", "'Anbardan Mağazaya Köçürmə'"),
    ("'Transfer Et'", "'Köçür'"),
    ("'Transfer tamamlandı.'", "'Köçürmə tamamlandı.'"),
    ("'Depo Stoğu'", "'Anbar Stoqu'"),

    # ── SALES PAGE ───────────────────────────────────────────────
    ("'📋 Satış Geçmişi'", "'📋 Satış Tarixçəsi'"),
    ("' satış kaydı'", "' satış qeydi'"),
    ("'Tarih'", "'Tarix'"),
    ("'Müşteri'", "'Müştəri'"),
    ("'Perakende'", "'Pərakəndə'"),
    ("'Toptan'", "'Topdansatış'"),
    ("'Kasiyer'", "'Kassir'"),
    ("'Toplam'", "'Cəm'"),
    ("'İşlemler'", "'Əməliyyatlar'"),
    ("'Fişi Gör'", "'Qəbzə Bax'"),
    ("'Satışı Sil'", "'Satışı Sil'"),
    ("'Satış silinsin mi?'", "'Satış silinsin?'"),
    ("addToast('Satış silindi.', 'info')", "addToast('Satış silindi.', 'info')"),
    ("'Satış bulunamadı'", "'Satış tapılmadı'"),

    # ── RETURNS PAGE ─────────────────────────────────────────────
    ("'↩️ İadeler'", "'↩️ Geri Qaytarmalar'"),
    ("'Toplam İade'", "'Cəmi Geri Qaytarma'"),
    ("'Bugün İade'", "'Bu gün Geri Qaytarma'"),
    ("'İade Edilen Ürün'", "'Geri Qaytarılan Məhsul'"),
    ("'Stoğa geri eklendi'", "'Stoka geri əlavə edildi'"),
    ("'Yeni İade'", "'Yeni Geri Qaytarma'"),
    ("'İade No'", "'Geri qaytarma №'"),
    ("'İade İşlemi'", "'Geri Qaytarma'"),
    ("'İade Sebebi'", "'Geri qaytarma səbəbi'"),
    ("'İade tamamlandı.'", "'Geri qaytarma tamamlandı.'"),
    ("'İade Detayı'", "'Geri qaytarma Detalı'"),
    ("'Satış Fişi'", "'Satış Qəbzi'"),

    # ── CATEGORIES PAGE ──────────────────────────────────────────
    ("'🗂️ Kategoriler'", "'🗂️ Kateqoriyalar'"),
    ("' kategori'", "' kateqoriya'"),
    ("'+ Yeni Kategori'", "'+ Yeni Kateqoriya'"),
    ("'Kategori Adı'", "'Kateqoriya adı'"),
    ("'Kategori silindi.'", "'Kateqoriya silindi.'"),
    ("'Kategori kaydedildi.'", "'Kateqoriya saxlanıldı.'"),
    ("'Kategori adı gerekli.'", "'Kateqoriya adı tələb olunur.'"),
    ("'Bu kategoriyi silmek istediğinize emin misiniz?'", "'Bu kateqoriyanı silmək istədiyinizdən əminsiniz?'"),
    ("'Kategori'", "'Kateqoriya'"),

    # ── USERS PAGE ───────────────────────────────────────────────
    ("'👥 Kullanıcılar'", "'👥 İstifadəçilər'"),
    ("'+ Yeni Kullanıcı'", "'+ Yeni İstifadəçi'"),
    ("'Kullanıcı'", "'İstifadəçi'"),
    ("'Rol'", "'Rol'"),
    ("'Admin'", "'Admin'"),
    ("'Aktif'", "'Aktiv'"),
    ("'Pasif'", "'Passiv'"),
    ("'admin' ? 'Admin' : 'Kasiyer'", "'admin' ? 'Admin' : 'Kassir'"),

    # ── SETTINGS PAGE ────────────────────────────────────────────
    ("'⚙️ Ayarlar'", "'⚙️ Parametrlər'"),
    ("'Mağaza Bilgileri'", "'Mağaza Məlumatları'"),
    ("'Mağaza Adı'", "'Mağaza adı'"),
    ("'Adres'", "'Ünvan'"),
    ("'Para Birimi'", "'Valyuta'"),
    ("'Fiş Alt Yazısı'", "'Qəbz alt yazısı'"),
    ("'Vergi Oranı (%)'", "'Vergi dərəcəsi (%)'"),
    ("'Düşük Stok Eşiği'", "'Az Stok Həddi'"),
    ("'Kaydet'", "'Saxla'"),
    ("'Ayarlar kaydedildi.'", "'Parametrlər saxlanıldı.'"),
    ("'Yedek Al'", "'Yedəkləmə'"),
    ("'JSON Yedek İndir'", "'JSON Yedəyi Yüklə'"),
    ("'Yedeği Geri Yükle'", "'Yedəyi Bərpa et'"),
    ("'Dosya Seç'", "'Fayl Seç'"),
    ("'Yedek Dosyası Seç'", "'Yedək Faylı Seç'"),
    ("'Bu Yedeği Buluta Yükle (Mevcut Verilerin Üzerine Yazar)'", "'Bu Yedəyi Bərpa et (Mövcud məlumatların üzərinə yazır)'"),
    ("'Mevcut veriler siliniyor…'", "'Mövcud məlumatlar silinir…'"),
    ("'Yeni veriler yükleniyor…'", "'Yeni məlumatlar yüklənir…'"),
    ("'Veriler başarıyla güncellendi!'", "'Məlumatlar uğurla yeniləndi!'"),
    ("'Yükleme hatası: '", "'Yükləmə xətası: '"),
    ("'Oturum açık değil.'", "'Sessiya açıq deyil.'"),
    ("'⏳ Buluta yükleniyor…'", "'⏳ Bərpa edilir…'"),
    ("'⬆️ Bu Yedeği Buluta Yükle (Mevcut Verilerin Üzerine Yazar)'", "'⬆️ Bu Yedəyi Bərpa et (mövcud məlumatların üzərinə yazır)'"),

    # ── REPORTS PAGE ─────────────────────────────────────────────
    ("'📈 Raporlar'", "'📈 Hesabatlar'"),
    ("'Bugünkü Ciro'", "'Günlük Dövriyyə'"),
    ("'Bu Ay Ciro'", "'Bu Ay Dövriyyəsi'"),
    ("'Geçen Ay'", "'Keçən Ay'"),
    ("'Perakende Satışlar'", "'Pərakəndə Satışlar'"),
    ("'Toptan Satışlar'", "'Topdan Satışlar'"),
    ("'Aylık Ciro Trendi'", "'Aylıq Dövriyyə Trendi'"),
    ("'En Çok Satan (Adet)'", "'Ən Çox Satılan (Ədəd)'"),
    ("'En Çok Satan (Ciro)'", "'Ən Çox Satılan (Dövriyyə)'"),
    ("'Ciro'", "'Dövriyyə'"),
    ("'Maliyet'", "'Maya dəyəri'"),
    ("'Kar'", "'Mənfəət'"),
    ("'Toplam Satış'", "'Cəmi Satış'"),
    ("'Satış Sayısı'", "'Satış sayı'"),
    ("'Ortalama Satış'", "'Orta Satış'"),

    # ── END OF DAY MODAL ─────────────────────────────────────────
    ("'Günlük Özet'", "'Günlük Xülasə'"),
    ("'Günlük Rapor'", "'Günlük Hesabat'"),
    ("'Toplam Ciro'", "'Cəmi Dövriyyə'"),
    ("'Toplam İşlem'", "'Cəmi Əməliyyat'"),
    ("'Ortalama Sepet'", "'Orta Səbət'"),
    ("'Toplam Ürün'", "'Cəmi Məhsul'"),
    ("'Kazanç (Brüt)'", "'Qazanc (Brüt)'"),
    ("'Kazanç (Net)'", "'Qazanc (Xalis)'"),
    ("'En Çok Satan'", "'Ən Çox Satılan'"),
    ("'Kasiyer Özeti'", "'Kassir Xülasəsi'"),
    ("'Raporu Yazdır'", "'Hesabatı Çap et'"),
    ("'Kapat'", "'Bağla'"),
    ("'Günü Kapat'", "'Günü Bağla'"),

    # ── COMMON TOASTS & MESSAGES ─────────────────────────────────
    ("addToast('Kaydedildi.', 'success')", "addToast('Saxlanıldı.', 'success')"),
    ("'Değişiklikler kaydedildi.'", "'Dəyişikliklər saxlanıldı.'"),
    ("'Geçersiz değer'", "'Yanlış dəyər'"),
    ("'Hata oluştu.'", "'Xəta baş verdi.'"),
    ("'Lütfen '", "'Zəhmət olmasa '"),

    # ── CONFIRM DIALOG ───────────────────────────────────────────
    ("'Emin misiniz?'", "'Əminsiniz?'"),
    ("'Bu işlemi geri alamazsınız.'", "'Bu əməliyyatı geri ala bilməzsiniz.'"),
    ("'Evet, Sil'", "'Bəli, Sil'"),
    ("'Hayır'", "'Xeyr'"),
    ("'Onaylıyorum'", "'Təsdiqləyirəm'"),

    # ── TOPBAR ───────────────────────────────────────────────────
    ("' işlem bugün'", "' əməliyyat bu gün'"),
    ("title: 'Günü Bitir'", "title: 'Günü Bitir'"),

    # ── MISC LABELS ──────────────────────────────────────────────
    ("'Ürün eklenmedi'", "'Məhsul əlavə edilməyib'"),
    ("'Adet'", "'Ədəd'"),
    (" adet'", " ədəd'"),
    ("'Toplam Kazanç'", "'Cəmi Qazanc'"),

    # ── LOCALE ───────────────────────────────────────────────────
    # Note: toLocaleDateString locale kept as 'az-AZ' where needed
    # 'tr-TR' locale → 'az-AZ' for number formatting
    # We keep 'tr-TR' for number formatting since az-AZ may not be supported in all browsers
    # Only change the weekday label locale
    ("toLocaleDateString('tr-TR', { weekday: 'short' })", "toLocaleDateString('az-AZ', { weekday: 'short' })"),
    ("toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' })", "toLocaleDateString('az-AZ', { month: 'short', year: '2-digit' })"),
    ("toLocaleDateString('tr-TR')", "toLocaleDateString('az-AZ')"),
    ("toLocaleString('tr-TR')", "toLocaleString('az-AZ')"),
    ("toLocaleTimeString('tr-TR')", "toLocaleTimeString('az-AZ')"),
    # Number formatting: keep as tr-TR since az-AZ decimal separator is same (comma)
    # but change display locale
    ("'tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }", "'az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }"),
    ("'tr-TR', {minimumFractionDigits:2,maximumFractionDigits:2}", "'az-AZ', {minimumFractionDigits:2,maximumFractionDigits:2}"),
    ("n.toLocaleString('tr-TR'", "n.toLocaleString('az-AZ'"),

    # ── HTML RECEIPT LOCALE ──────────────────────────────────────
    ('<html lang="tr">\n<head>\n<meta charset="UTF-8">\n<title>Fiş',
     '<html lang="az">\n<head>\n<meta charset="UTF-8">\n<title>Qəbz'),

    # ── SIDEBAR "Satış" stat name ────────────────────────────────
    ("'Satış Yap'", "'Satış et'"),

    # ── EXTRA STRINGS FROM READING ───────────────────────────────
    ("'⚡ Yeni Barkod'", "'⚡ Yeni Barkod'"),
    ("'Stok Yönetimi'", "'Stok İdarəetməsi'"),
    ("'Stok güncellendi'", "'Stok yeniləndi'"),
    ("'Market Stoğu'", "'Mağaza Stoqu'"),
    ("'Depo Stoğu'", "'Anbar Stoqu'"),
    ("'Depoya Ekle'", "'Anbara Əlavə et'"),
    ("'Markete Transfer'", "'Mağazaya Köçür'"),
    ("'Transfer Geçmişi'", "'Köçürmə Tarixçəsi'"),
    ("'Transfer tarihi'", "'Köçürmə tarixi'"),
    ("'Miktar'", "'Miqdar'"),
    ("'adet transfer edildi'", "'ədəd köçürüldü'"),

    # Sidebar stat 'Satış' — only the label, not the nav item
    # Already handled above

    # ── DEBUG CONSOLE LOGS (remove them) ─────────────────────────
    ("    console.log('[DEBUG] fbStreamSales fired, count:', s.length, 'first createdAt:', s[0]?.createdAt);\n      ", "    "),
    ("    console.log('[DEBUG] completeSale optimistic, total:', total, 'createdAt:', sale.createdAt);\n    ", "    "),
]

for old, new in replacements:
    if old in c:
        c = c.replace(old, new)
    else:
        print(f'[NOT FOUND] {repr(old[:60])}')

# ── Remaining 'Satış' only in the sidebar stat label (context: daily-stat-name)
# Already handled by the ' işlem' and 'Kazanç' replacements

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Çeviri tamamlandı!')
