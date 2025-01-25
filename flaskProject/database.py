# database.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import func

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

# Kullanıcılar tablosu
class Kullanici(db.Model):
    __tablename__ = 'kullanicilar'
    id = db.Column(db.Integer, primary_key=True)
    kullanici_adi = db.Column(db.String(80), unique=True, nullable=False)
    sifre = db.Column(db.String(120), nullable=False)
    eposta = db.Column(db.String(120), unique=True, nullable=False)
    konum = db.Column(db.String(100))
    ilgi_alanlari = db.Column(db.String(200))
    ad = db.Column(db.String(50))
    soyad = db.Column(db.String(50))
    dogum_tarihi = db.Column(db.Date)
    cinsiyet = db.Column(db.String(10))
    telefon_no = db.Column(db.String(20))
    profil_fotografi = db.Column(db.String(200))

# Etkinlikler tablosu
class Etkinlik(db.Model):
    __tablename__ = 'etkinlikler'
    id = db.Column(db.Integer, primary_key=True)
    etkinlik_adi = db.Column(db.String(100), nullable=False)
    aciklama = db.Column(db.Text)
    tarih = db.Column(db.Date, nullable=False)
    saat = db.Column(db.Time, nullable=False)
    etkinlik_suresi = db.Column(db.Integer)
    konum = db.Column(db.String(100))
    kategori = db.Column(db.String(50))
    olusturan_id = db.Column(db.Integer, db.ForeignKey('kullanicilar.id'))
    onay_durumu = db.Column(db.Boolean, default=False, nullable=False)

# Katılımcılar tablosu
class Katilimci(db.Model):
    __tablename__ = 'katilimcilar'
    kullanici_id = db.Column(db.Integer, db.ForeignKey('kullanicilar.id'), primary_key=True)
    etkinlik_id = db.Column(db.Integer, db.ForeignKey('etkinlikler.id'), primary_key=True)

# Mesajlar tablosu
class Mesaj(db.Model):
    __tablename__ = 'mesajlar'
    id = db.Column(db.Integer, primary_key=True)
    gonderici_id = db.Column(db.Integer, db.ForeignKey('kullanicilar.id'), nullable=False)
    alici_id = db.Column(db.Integer, db.ForeignKey('kullanicilar.id'), nullable=False)
    mesaj_metni = db.Column(db.Text, nullable=False)
    gonderim_zamani = db.Column(db.DateTime, default=datetime.utcnow)
    etkinlik_id = db.Column(db.Integer, db.ForeignKey('etkinlikler.id'), nullable=False)
    gonderici = db.relationship('Kullanici', foreign_keys=[gonderici_id], backref='gonderilen_mesajlar')
    alici = db.relationship('Kullanici', foreign_keys=[alici_id], backref='alici_mesajlar')

# Puanlar tablosu
class Puan(db.Model):
    __tablename__ = 'puanlar'
    id = db.Column(db.Integer, primary_key=True)
    kullanici_id = db.Column(db.Integer, db.ForeignKey('kullanicilar.id'), nullable=False)
    puan = db.Column(db.Integer, nullable=False)
    kazanilan_tarih = db.Column(db.Date, default=func.current_date(), nullable=False)