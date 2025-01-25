KOCAELİ ÜNİVERSİTESİ
BİLGİSAYAR MÜHENDİSLİĞİ BÖLÜMÜ
YAZILIM LAB. I- II.Proje
PROJE TESLİM TARİHİ: 28.11.2024
Akıllı Etkinlik Planlama Platformu


Bu proje, kullanıcıların etkinlikler oluşturabileceği, katılabileceği ve etkinlikler etrafında
sosyal etkileşim kurabilecekleri bir web tabanlı Akıllı Etkinlik Planlama Platformu
geliştirmeyi hedeflemektedir. Kullanıcılar kişiselleştirilmiş etkinlik önerileri alacak, sohbet
edebilecek ve etkinlikleri harita üzerinden takip edebileceklerdir.


Amaç:
● Web programlama konusunda bilgi ve beceri kazanılması,
● Web sayfası oluşturma, veritabanı tasarımı ve yönetimi becerilerinin geliştirilmesi,
● Dinamik ve kullanıcı dostu bir web platformu oluşturulması,
● Gerçek zamanlı veri işleme ve kullanıcı etkileşimini sağlayacak sistemlerin
geliştirilmesi,
● Kural tabanlı kişiselleştirilmiş öneriler sunan akıllı bir program geliştirilmesi,
● API entegrasyonları ve harita, rota planlama gibi işlevlerle kullanıcı deneyiminin
zenginleştirilmesi,
● Projede yer alan teknik zorluklar üzerinden ekip çalışması ve problem çözme
yeteneklerinin güçlendirilmesi.
Programlama Dili: ASP.Net, Java Spring, React.js, Django. vb



Proje Mimarisi

1. Frontend (Kullanıcı Arayüzü)
Kullanıcıların etkinlikleri görüntüleyebileceği, katılabileceği ve kendi etkinliklerini
oluşturabileceği bir arayüz tasarlanacaktır. Ayrıca kullanıcılar sohbet penceresine ve etkinlik
haritasına erişim sağlayacaktır.
● Ana Bileşenler:
○ Ana Sayfa: Kullanıcıların önerilen etkinlikleri görebileceği ve kendi
etkinliklerini ekleyebileceği yerdir.
○ Etkinlik Sayfası: Seçilen etkinliğin detaylarını görüntüleyebilecekleri ve
katılabilecekleri yerdir.
○ Sohbet: Kullanıcılar arasında mesajlaşma imkanı sağlamaktadır.
○ Kullanıcı Profili: Kullanıcıların katıldıkları etkinlikler görüntüleyebilecekleri
profil sayfasıdır.
○ Admin Profili: Admin profili, platformun yönetimi için kullanılan bir alandır.
Yöneticiler, kullanıcı hesaplarını yönetebilir, etkinlikleri inceleyebilir ve
gerektiğinde silme veya düzenleme işlemleri yapabilir.
○ Giriş Ekranı: Giriş ekranı, kullanıcıların platforma giriş yapabilecekleri veya
yeni hesap oluşturabilecekleri bir alandır. Kullanıcı adı ve şifre ile giriş
yapılabilir; ayrıca yeni kullanıcılar için kayıt olma ve şifre sıfırlama seçenekleri
sunulur.


2. Backend (Sunucu Tarafı)
Sunucu tarafında kullanıcı ve etkinlik verilerinin yönetimi yapılacak. Kullanıcı işlemleri,
etkinlik yönetimi ve mesajlaşma gibi işlemler burada gerçekleştirilecektir.
a. Kullanıcı Yönetimi:
○ Giriş, kayıt, şifre sıfırlama ve kullanıcı doğrulama işlevlerini içerir.
○ Kullanıcı profili oluşturma ve güncelleme, ilgi alanları ekleme ve güncelleme
gibi özellikler sağlar.
○ Kullanıcı rolleri (kullanıcı, admin) tanımlanarak yetkilendirme yapılır.
○ Kullanıcılar; kullanıcı adı, şifre, ad, soyad, doğum tarihi, cinsiyet, e-posta
adresi, telefon numarası, ilgi alanları ve profil fotoğrafı gibi temel kişisel
bilgileri girerek kayıt olabilmelidir.
○ Kullanıcılar, kullanıcı adı ve şifre ile giriş yapabilmelidir. Şifreler güvenli bir
şekilde saklanmalı ve kimlik doğrulama işlemi yapılmalıdır.
○ Kullanıcıların unutulan şifrelerini sıfırlamaları için bir "şifremi unuttum"
seçeneği bulunmalıdır.
○ Kullanıcılar; kişisel profil sayfalarını düzenleyebilmeli, profil resmi
ekleyebilmeli ve temel bilgilerini güncelleyebilmelidir.
b. Etkinlik Yönetimi:
○ Kullanıcıların etkinlik oluşturma, güncelleme ve silme işlemlerini
gerçekleştirebilecektir.
○ Etkinlik detayları (isim, tarih, saat, açıklama, konum, kategori) kullanıcılar
tarafından alınacak ve etkinlik olarak eklenecektir.
○ Admin, tüm etkinlikleri yöneterek onaylama, silme veya düzenleme işlemlerini
yapacaktır.
○


c. Etkinlik Öneri Sistemi:
○ Kullanıcıların ilgi alanlarına ve katılım geçmişlerine göre öneriler sunan kural
tabanlı bir sistem kullanılacaktır.
○ Kullanıcının ilgi alanına göre kural tabanlı kişiselleştirilmiş etkinlik önerileri
oluşturur.
○ Öneri sistemi sürekli olarak güncellenerek kullanıcı deneyimini iyileştirir.
ç. Çakışma Algoritması:
○ Kullanıcıların katılmak istedikleri etkinliklerin tarih ve zaman açısından çakışıp
çakışmadığını kontrol eden bir sistemdir.
○ Kullanıcı etkinlik oluştururken, mevcut etkinliklerin çakışıp çakışmadığını
otomatik olarak belirler.
○ Kullanıcıya, çakışan etkinlikler hakkında bilgilendirme yaparak alternatif
seçenekler sunar.



d. Admin Paneli:
○ Admin kullanıcıları, tüm sistemin yönetimini gerçekleştirebilir.
○ Kullanıcı yönetimi, etkinlik onaylama, raporlama ve sistem ayarlarını yapma
gibi işlevleri içerir.
○ Admin, sistemdeki tüm kullanıcıların ve etkinliklerin detaylarını
görüntüleyebilir ve gerektiğinde müdahalelerde bulunabilir.
○ Kullanıcı geri bildirimlerini toplama ve yönetme işlevleri ile sistemin sürekli
iyileştirilmesini sağlar
f. Mesajlaşma Paneli:
○ Mesajlaşma paneli, her etkinlik için ayrı olarak oluşturulacaktır ve etkinliğe
katılan tüm kullanıcılar, aynı sohbet alanında mesajlaşabilecektir.
○ Bu sohbet alanı herkese açık olacak ve tüm katılımcılar gönderilen mesajları
görebilecektir.
○ Grup şeklinde değil, etkinliğe katılan herkesin erişebileceği genel bir sohbet
ortamı olacaktır. Sohbet gerçek zamanlı olmayacak, bu nedenle kullanıcılar
sayfayı yenileyerek veya sohbet geçmişine göz atarak mesajlara
erişilebilecektir.
○ Her etkinlik için ayrı bir sohbet geçmişi tutulacak ve kullanıcılar, önceki
mesajlaşmaları inceleyebilecektir.



Veritabanı Tasarımı
Projede ilişkisel bir veritabanı kullanılacaktır. Etkinlikler, kullanıcılar, katılımcılar ve mesajlar
gibi veriler farklı tablolar halinde yönetilecektir. Veritabanında tabloları ve proje isterlerini
kapsayacak işlevsel tablolar bulunmalıdır. Tablolar birbiri ile key aracılığı ile
ilişkilendirilmelidir ve normalize edilmiş olmalıdır.
● Veritabanı Tabloları:
○ Kullanıcılar: ID, kullanıcı adı, şifre, e-posta, konum, ilgi alanları, ad, soyad,
doğum tarihi, cinsiyet, e-posta adresi, telefon numarası ve profil fotoğrafı
○ Etkinlikler: ID, etkinlik adı, açıklama, tarih, saat, etkinlik süresi, konum,
kategori.
○ Katılımcılar: Kullanıcı ID, Etkinlik ID (bir kullanıcının hangi etkinliklere
katıldığını izlemek için).
○ Mesajlar: Mesaj ID, Gönderici ID, Alıcı ID, Mesaj Metni, Gönderim Zamanı.
○ Puanlar: Kullanıcı ID, Puanlar, Kazanılan Tarih.
Ana Fonksiyonlar ve Özellikler
Kişiselleştirilmiş Etkinlik Öneri Sistemi (Kural Tabanlı)
Kullanıcıların ilgi alanlarına, etkinlik geçmişlerine ve bulundukları konuma göre
kişiselleştirilmiş etkinlik önerileri yapılacaktır. Öneriler, belirli kurallar çerçevesinde sunularak
kullanıcı deneyimi artırılacaktır.
Öneri Kuralları:
● İlgi Alanı Uyum Kuralı: Kullanıcının belirttiği ilgi alanlarına uygun olan etkinlikler
öncelikli olarak önerilecektir. Örneğin, bir kullanıcı sporla ilgileniyorsa, spor
etkinlikleri öneri listesinde ilk sırada yer alır.
● Katılım Geçmişi Kuralı: Kullanıcının geçmişte katıldığı etkinliklerin türü ve
sıklığına göre benzer türdeki etkinlikler önerilecektir. Örneğin, müzik etkinliklerine
sık katılan bir kullanıcıya müzikle ilgili yeni etkinlikler önerilir.
● Coğrafi Konum Kuralı: Kullanıcının bulunduğu coğrafi bölgeye yakın olan
etkinlikler, uzak bölgelere göre daha yüksek öncelikte önerilecektir. Bu, kullanıcıların
kolayca ulaşabileceği etkinlikleri bulmalarını sağlar.
Bu kural tabanlı öneri sistemi, kullanıcıların katılmak isteyebileceği etkinlikleri belirlemede
önemli bir rol oynamaktadır. Sistemin basitliği ve hızlı çalışması sayesinde öneriler kullanıcıya
hemen sunulabilir, zamanla kurallar geliştirilebilir ve optimize edilebilir.
Harita ve Rota Planlama
Kullanıcılar, etkinliklerin konumlarını harita üzerinden görebilecek ve etkinliklere en uygun
rota önerilerini alabilecekler. Bu işlevsellik, kullanıcı deneyimini artırarak etkinliklere katılımı
teşvik edecektir.


1. Konum Bazlı Etkinlikler:
○ Etkinliklerin konumları harita üzerinde işaretlenecek ve kullanıcıların
etkinlikleri kolayca bulabilmeleri sağlanacaktır.
○ Etkinliklerin detay sayfalarında, harita üzerinde etkinliğin konumu görsel
olarak sunulacak.
○ Kullanıcılar, harita üzerinde bir etkinliğe tıkladıklarında etkinliğin detaylarını
(tarih, saat, açıklama) görebilecekler.


2. Rota Planlama:
○ Kullanıcıların belirledikleri başlangıç noktasından etkinliğe ulaşmaları için en
uygun rota önerileri yapılacaktır.
○ Rota önerileri API kullanılarak gerçek zamanlı olarak hesaplanacaktır.
○ Kullanıcılar, farklı ulaşım yöntemleri (yürüyerek, araçla, bisikletle ..vb) için
alternatif rota seçenekleri alabileceklerdir.
Oyunlaştırma Sistemi
Kullanıcılar, etkinliklere katıldıkça puanlar kazanacaktır ve kullanıcıların katılımlarını teşvik
edecektir.
Ana Bileşenler:


1. Puanlama Sistemi:
○ Kullanıcılar, çeşitli aktivitelerine göre puan kazanacaklardır. Bu aktiviteler
şunları içerebilir:
■ Etkinliğe Katılım: Kullanıcılar, her katıldıkları etkinlik için belirli bir
puan kazanacaklardır. Örneğin, bir etkinliğe katıldıklarında 10 puan
alacaktır.
■ Etkinlik Oluşturma: Kullanıcılar, yeni bir etkinlik oluşturduklarında
belirli bir puan kazanacaklardır. Etkinlik oluşturma başına 15 puan
alacaktır.
■ İlk Katılım: Kullanıcılar, platforma ilk katılımlarında bonus puan
kazanacaklardır. İlk etkinlik katılımı için 20 puan kazanacaktır.


2. Puanlama Matematiği:
○ Kullanıcıların puanları, aktivitelerine göre toplu bir şekilde hesaplanacaktır.
Örneğin:
■ Katıldıkları etkinlik sayısı: 5 etkinlik × 10 puan = 50 puan
■ Oluşturdukları etkinlik sayısı: 2 etkinlik × 15 puan = 30 puan
■ İlk katılım bonusu: 20 puan
○ Toplam Puan = (Katılım Puanı) + (Oluşturma Puanı) + (Bonus Puan)
Tarih ve Zaman Çakışma Algoritması
Kullanıcılar, etkinliklere katılırken zaman çakışmalarını önlemek amacıyla bir sistem
geliştirilmiştir. Kullanıcı bir etkinliğe katılmak istediğinde, aynı zamanda başka bir etkinlik
olup olmadığı kontrol edilir. Bu sistem, kullanıcıların etkinliklere daha düzenli bir şekilde
katılmalarını sağlamakta ve katılım oranlarını artırmaktadır.

Ana Bileşenler:

1. Zaman Çakışması Algoritması:
○ Kullanıcı, etkinliklere katılmak istediğinde sistem, kullanıcının daha önce
katıldığı etkinliklerin başlangıç ve bitiş zamanlarını kontrol eder.
○ Kullanıcının katılmak istediği etkinliğin zaman dilimi ile mevcut etkinlikler
karşılaştırılır.
Algoritmanın İşleyişi:
● Mevcut Etkinliklerin Kontrolü: Kullanıcının geçmişte katıldığı etkinliklerin listesi
alınır.
● Yeni Etkinliğin Zamanının Alınması: Kullanıcının katılmak istediği etkinliğin
başlangıç ve bitiş zamanları belirlenir.
● Zaman Çakışması Kontrolü: Kullanıcının mevcut etkinlikleri ile yeni etkinlik
arasındaki zaman dilimleri karşılaştırılır.
○ Eğer mevcut etkinliklerden herhangi biri, yeni etkinlik ile çakışıyorsa,
kullanıcıya bir bildirim gönderilir.
● Kullanıcıya Bilgilendirme: Eğer bir çakışma tespit edilirse, kullanıcıya mevcut
etkinlikler hakkında bilgi verilir ve katılmak istediği etkinliği seçemeyeceği bildirilir.
Kullanıcı Arayüzü:
● Kullanıcı, katılmak istediği etkinliği seçtiğinde zaman çakışması olup olmadığına dair
bir bildirim alır.
● Çakışma varsa, kullanıcının mevcut etkinlikleri ile birlikte alternatif etkinlik önerileri
sunulur.


Mesajlaşma Sistemi
Etkinliklerle ilgili bilgi alışverişini ve etkileşimi artırmak amacıyla bir mesajlaşma sistemi
geliştirilmiştir. Bu sistem, kullanıcıların etkinliklerle ilgili sorular sormalarını, deneyimlerini
paylaşmalarını ve diğer katılımcılarla etkileşimde bulunmalarını sağlar.
Ana Bileşenler:

● Kullanıcı İletişimi:
Kullanıcılar, etkinlik sayfasında sorular sormak, önerilerde bulunmak veya diğer
katılımcılarla tanışmak için mesajlaşma özelliğini kullanabilir. Mesajlar, etkinlik
sayfasında görünür olacak ve bu sayede katılımcılar arasında etkileşim artacaktır.
● Bildirimler:
Kullanıcılar, yeni bir mesaj aldıklarında anlık bildirimler alacaklardır. Bu bildirimler,
kullanıcının mesajlara hızlı bir şekilde yanıt vermesini sağlar ve etkileşimi artırır.
Bildirimler, web platformunda kullanıcı dostu bir şekilde gösterilecektir.
● Mesaj Geçmişi:
Kullanıcılar, önceki mesajlaşmalarına erişerek etkinliklerle ilgili geçmiş etkileşimleri
görebileceklerdir. Mesaj geçmişi, kullanıcılara önceki tartışmalara ve bilgilere
kolayca ulaşma imkânı tanır.
8. Sonuç
Bu proje, web programlama, veritabanı yönetimi, kural tabanlı öneri sistemi ve iletişim gibi
modern teknolojilerin bir arada kullanıldığı kapsamlı bir uygulama geliştirme süreci
sunmaktadır. Hem teknik hem de kullanıcı deneyimi açısından güçlü bir altyapı sağlayarak
sosyal etkinlikleri planlamak ve yönetmek için yenilikçi bir çözüm oluşturacaktır.
Proje İsterleri
1. Kullanıcı kayıt, giriş, şifre sıfırlama işlemleri ve profil güncelleme.
2. Etkinlik oluşturma, güncelleme, silme ve katılım sağlama işlevleri.
3. Kural tabanlı kişiselleştirilmiş öneri sistemi.
4. Etkinlikler arasında zaman çakışmalarını tespit etme sistemi.
5. Mesajlaşma işlevselliği kullanımı
6. Etkinliklerin harita üzerinde gösterilmesi ve en uygun rotaların önerilmesi.
7. Kullanıcıların etkinliklere katılımı üzerinden puan ve başarı kazanma, profil sayfasında
gösterimi.
8. Kullanıcı ve etkinlik yönetimi için admin yetkileri; etkinlikleri onaylama ve düzenleme.
9. Arayüz ve tasarım yapısının oluşturulması (Frontend)
10. Kullanıcı doğrulama, yetkilendirme, veri güvenliği ve şifreleme yöntemleri.



Bu projede, kullanıcıların etkinlik planlamalarını kolaylaştıran kapsamlı bir web sitesi geliştirdik. Proje, React ve Python kullanılarak oluşturulmuş olup, veritabanı olarak SQLite3 tercih edilmiştir.

Proje kapsamında belirtilen gereksinimlerin büyük bir kısmını başarıyla gerçekleştirdik. Ek olarak, projemiz şu özellikleri sunmaktadır:

Gerçek Zamanlı Sohbet: Aynı etkinliğe katılan kullanıcıların sosyalleşebilmesi ve bilgi alışverişi yapabilmesi için tam zamanlı bir sohbet sistemi geliştirdik.
Harita ve Rota Planlama: Kullanıcıların etkinliğe ulaşımını kolaylaştırmak için uygun rotaları harita üzerinden sunuyoruz.
Kişiselleştirilmiş Öneriler: Kullanıcının ilgi alanlarına göre etkinlik önerileri yaparak kişiselleştirilmiş bir deneyim sağlıyoruz.
Bunların yanı sıra, kullanıcı dostu arayüzü ve çeşitli işlevleriyle projemiz, etkinlik planlama sürecini hem kolaylaştırmakta hem de daha eğlenceli bir hale getirmektedir.
