from flask_cors import CORS
from flask import Flask, request, jsonify, make_response, send_from_directory
from datetime import datetime
from werkzeug.serving import make_ssl_devcert
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.utils import secure_filename
import os
from database import db, init_db, Kullanici, Etkinlik, Katilimci, Mesaj, Puan

app = Flask(__name__)
make_ssl_devcert('./ssl', host='localhost')
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yazlab1_2.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static/uploads')

init_db(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    kullanici_adi = data.get('username')
    sifre = data.get('password')

    user = Kullanici.query.filter_by(kullanici_adi=kullanici_adi, sifre=sifre).first()

    if user.kullanici_adi == "admin" and user.sifre == "admin":
        response = make_response(jsonify({"success": True, "message": "Giriş başarılı", "is_admin": True}))
        response.set_cookie('user_data', str(user.id), httponly=False)

        print("Kullanıcı adı doğru: " + kullanici_adi + " Şifre: " + sifre)

        return response

    if user:
        response = make_response(jsonify({"success": True, "message": "Giriş başarılı", "is_admin": False}))
        response.set_cookie('user_data', str(user.id), httponly=False)

        print("Kullanıcı adı doğru: " + kullanici_adi + " Şifre: " + sifre)

        return response
    else:
        print("Kullanıcı adı yanlış: " + kullanici_adi + " Şifre: " + sifre)
        return jsonify({"success": False, "message": "Kullanıcı adı veya şifre hatalı"})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    try:
        dogum_tarihi = datetime.strptime(data['birthdate'], '%Y-%m-%d').date()

        interests = data.get('interests', [])
        interests_json = ",".join(interests)

        new_user = Kullanici(
            kullanici_adi=data['username'],
            ad=data['name'],
            soyad=data['surname'],
            dogum_tarihi=dogum_tarihi,
            cinsiyet=data['gender'],
            telefon_no=data['phonenumber'],
            konum=data['address'],
            eposta=data['email'],
            sifre=data['password'],
            ilgi_alanlari=interests_json
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Başarıyla kayıt olundu.",
            "userId": new_user.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Kayıt sırasında bir hata oluştu: {str(e)}"
        }), 500

@app.route('/create_event', methods=['POST'])
def create_event():
    try:
        data = request.get_json()

        olusturan_id = request.cookies.get('user_data')

        if not olusturan_id:
            return jsonify({"success": False, "message": "Kullanıcı girişi yapılmadı"}), 400

        etkinlik_adi = data.get('event_name')
        aciklama = data.get('description')
        tarih = datetime.strptime(data.get('date'), '%Y-%m-%d').date()
        saat = datetime.strptime(data.get('time'), '%H:%M').time()
        etkinlik_suresi = data.get('duration')
        konum = data.get('location')
        kategori = data.get('category')

        new_event = Etkinlik(
            etkinlik_adi=etkinlik_adi,
            aciklama=aciklama,
            tarih=tarih,
            saat=saat,
            etkinlik_suresi=etkinlik_suresi,
            konum=konum,
            kategori=kategori,
            olusturan_id=olusturan_id
        )

        db.session.add(new_event)
        db.session.commit()

        return jsonify({"success": True, "message": "Etkinlik başarıyla oluşturuldu."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Hata: {str(e)}"}), 500

@app.route('/get_all_events', methods=['GET'])
def get_all_events():
    events = Etkinlik.query.filter(Etkinlik.onay_durumu == True).all()

    return jsonify({
        "events": [{
            "id": event.id,
            "event_name": event.etkinlik_adi,
            "description": event.aciklama,
            "date": event.tarih.strftime('%Y-%m-%d') if event.tarih else None,
            "time": event.saat.strftime('%H:%M') if event.saat else None,
            "duration": event.etkinlik_suresi,
            "location": event.konum,
            "category": event.kategori,
            "user_id": event.olusturan_id
        } for event in events]
    })

@app.route('/get_event_details', methods=['GET'])
def get_event_details():
    event_id = request.args.get('event_id')
    event = Etkinlik.query.filter_by(id=event_id).first()

    if event:

        return jsonify({
            "success": True,
            "event": {
                "event_name": event.etkinlik_adi,
                "description": event.aciklama,
                "date": event.tarih.strftime('%Y-%m-%d'),
                "time": event.saat.strftime('%H:%M'),
                "duration": event.etkinlik_suresi,
                "location": event.konum,
                "category": event.kategori,
            }
        })
    else:
        return jsonify({"success": False, "message": "Etkinlik bulunamadı"})

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    user_id = request.args.get('user_id')

    user = Kullanici.query.filter_by(id=user_id).first()

    print(user.konum)

    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user.id,
                "username": user.kullanici_adi,
                "name": user.ad,
                "surname": user.soyad,
                "gender": user.cinsiyet,
                "birthdate": user.dogum_tarihi.strftime('%Y.%m.%d') if user.dogum_tarihi else None,
                "interests": user.ilgi_alanlari,
                "location": user.konum,
                "phone": user.telefon_no,
                "email": user.eposta,
                "profileImage": user.profil_fotografi
            }
        })
    else:
        return jsonify({"success": False, "message": "Kullanıcı bulunamadı"})

@app.route('/join_event', methods=['POST'])
def join_event():
    data = request.get_json()
    user_id = request.cookies.get('user_data')
    event_id = data.get('eventId')

    if not user_id or not event_id:
        return jsonify({"success": False, "message": "User or event ID missing"}), 400

    existing_entry = Katilimci.query.filter_by(kullanici_id=user_id, etkinlik_id=event_id).first()
    if existing_entry:
        return jsonify({"success": False, "message": "You have already joined this event"}), 400

    new_participant = Katilimci(kullanici_id=user_id, etkinlik_id=event_id)
    db.session.add(new_participant)
    db.session.commit()

    return jsonify({"success": True, "message": "You have successfully joined the event"}), 201

@app.route('/get_joined_events', methods=['GET'])
def get_joined_events():
    user_id = request.cookies.get('user_data')

    if not user_id:
        return jsonify({"success": False, "message": "Kullanıcı girişi yapılmadı"})

    joined_events = (
        db.session.query(Etkinlik)
        .join(Katilimci, Katilimci.etkinlik_id == Etkinlik.id)
        .filter(Katilimci.kullanici_id == user_id)
        .all()
    )

    return jsonify({
        "events": [{
            "id": event.id,
            "event_name": event.etkinlik_adi,
            "description": event.aciklama,
            "date": event.tarih.strftime('%Y-%m-%d') if event.tarih else None,
            "time": event.saat.strftime('%H:%M') if event.saat else None,
            "duration": event.etkinlik_suresi,
            "location": event.konum,
            "category": event.kategori
        } for event in joined_events]
    })

@app.route('/leave_event', methods=['POST'])
def leave_event():
    try:
        data = request.get_json()
        event_id = data.get('eventId')
        user_id = request.cookies.get('user_data')

        if not event_id:
            return jsonify({'success': False, 'message': 'Event ID is required'}), 400

        katilimci = Katilimci.query.filter_by(kullanici_id=user_id, etkinlik_id=event_id).first()

        if not katilimci:
            return jsonify({'success': False, 'message': 'You are not registered for this event'}), 400

        db.session.delete(katilimci)
        db.session.commit()

        return jsonify({'success': True, 'message': 'You have successfully left the event'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/get_users', methods=['GET'])
def get_users():
    user_id = request.cookies.get('user_data')
    etkinlik_id = request.args.get('etkinlik_id')

    if not user_id:
        return jsonify({"success": False, "message": "Kullanıcı kimliği bulunamadı!"}), 400

    if etkinlik_id:
        katilimcilar = (
            db.session.query(Kullanici)
            .join(Katilimci, Katilimci.kullanici_id == Kullanici.id)
            .filter(Katilimci.etkinlik_id == etkinlik_id, Kullanici.id != user_id)
            .all()
        )
    else:
        katilimcilar = Kullanici.query.filter(Kullanici.id != user_id).all()

    kullanici_listesi = [{"id": kullanici.id, "ad": kullanici.kullanici_adi} for kullanici in katilimcilar]

    return jsonify({"success": True, "users": kullanici_listesi})

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    etkinlik_id = data.get('etkinlik_id')
    mesaj_metni = data.get('mesaj_metni')
    gonderici_id = request.cookies.get('user_data')

    print(f"Mesaj metni: {mesaj_metni}")
    print(f"Gonderici ID: {gonderici_id}")

    if not etkinlik_id or not mesaj_metni or not gonderici_id:
        return jsonify({'success': False, 'message': 'Eksik bilgi!'}), 400

    alici_id = 0

    yeni_mesaj = Mesaj(
        gonderici_id=gonderici_id,
        alici_id=alici_id,
        mesaj_metni=mesaj_metni,
        etkinlik_id=etkinlik_id
    )

    print(f"Yeni Mesaj: {yeni_mesaj}")
    db.session.add(yeni_mesaj)

    print(f"Veritabanı değişiklikleri: {db.session.new}")
    db.session.commit()

    return jsonify({'success': True, 'message': 'Mesaj başarıyla gönderildi'})

# ARTIK KULLANILMIYOR
@app.route('/get_messages', methods=['GET'])
def get_messages():
    gonderici_id = request.cookies.get('user_data')
    alici_id = request.args.get('alici_id')

    mesajlar = Mesaj.query.filter(
        ((Mesaj.gonderici_id == gonderici_id) & (Mesaj.alici_id == alici_id)) |
        ((Mesaj.gonderici_id == alici_id) & (Mesaj.alici_id == gonderici_id))
    ).order_by(Mesaj.gonderim_zamani).all()

    mesaj_listesi = []

    for mesaj in mesajlar:
        if mesaj.gonderici_id == gonderici_id:
            gonderici_ad = "Ben"
        else:
            gonderici = Kullanici.query.filter_by(id=mesaj.gonderici_id).first()
            gonderici_ad = gonderici.kullanici_adi if gonderici else "Bilinmeyen Kullanıcı"

        if mesaj.alici_id == gonderici_id:
            alici_ad = "Ben"
        else:
            alici = Kullanici.query.filter_by(id=mesaj.alici_id).first()
            alici_ad = alici.kullanici_adi if alici else "Bilinmeyen Kullanıcı"

        mesaj_listesi.append({
            'id': mesaj.id,
            'mesaj_metni': mesaj.mesaj_metni,
            'gonderici_ad': gonderici_ad,
            'alici_ad': alici_ad,
            'tarih': mesaj.gonderim_zamani.strftime('%Y-%m-%d %H:%M')
        })

    return jsonify(mesaj_listesi)

@app.route('/get_messages_by_event', methods=['GET'])
def get_messages_by_event():
    etkinlik_id = request.args.get('etkinlik_id')

    if not etkinlik_id:
        return jsonify({"success": False, "message": "Etkinlik ID gerekli"}), 400

    messages = Mesaj.query.filter_by(etkinlik_id=etkinlik_id).join(Kullanici, Kullanici.id == Mesaj.gonderici_id).order_by(Mesaj.gonderim_zamani).all()

    if not messages:
        return jsonify({"success": False, "message": "Hiç mesaj bulunamadı"}), 404

    return jsonify({
        "success": True,
        "messages": [
            {
                "id": message.id,
                "gonderici_ad": message.gonderici.kullanici_adi,
                "mesaj_metni": message.mesaj_metni,
                "tarih": message.gonderim_zamani.strftime('%Y-%m-%d %H:%M')
            }
            for message in messages
        ]
    })

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/update_user_data', methods=['POST'])
def update_user_data():
    try:
        user_id = request.form.get('id')
        user = Kullanici.query.get(user_id)

        if not user:
            return jsonify({"message": "Kullanıcı bulunamadı!"}), 404

        user.ad = request.form.get('name', user.ad)
        user.soyad = request.form.get('surname', user.soyad)
        user.eposta = request.form.get('email', user.eposta)
        user.telefon_no = request.form.get('phone', user.telefon_no)
        user.konum = request.form.get('address', user.konum)

        new_password = request.form.get('password')
        if new_password != 'undefined':
            user.sifre = new_password

        if 'photo' in request.files:
            file = request.files['photo']
            if file and allowed_file(file.filename):
                filename = f"{user.id}_profile.jpg"
                filename = secure_filename(filename)
                app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static\\uploads')
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                print(filepath)
                file.save(filepath)
                user.profil_fotografi = filepath

        db.session.commit()
        return jsonify({"message": "Kullanıcı başarıyla güncellendi!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Bir hata oluştu: {str(e)}"}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER']), filename)

@app.route('/add_point', methods=['POST'])
def add_point():
    try:
        data = request.get_json()
        kullanici_id = data.get('user_id')
        puan = data.get('point')
        kazanilan_tarih = data.get('date')

        if not kullanici_id or puan is None:
            return jsonify({"success": False, "message": "Kullanıcı ID ve puan zorunludur"}), 400

        if not kazanilan_tarih:
            kazanilan_tarih = datetime.utcnow().date()
        else:
            kazanilan_tarih = datetime.strptime(kazanilan_tarih, '%Y-%m-%d').date()

        yeni_puan = Puan(
            kullanici_id=kullanici_id,
            puan=puan,
            kazanilan_tarih=kazanilan_tarih
        )

        db.session.add(yeni_puan)
        db.session.commit()

        return jsonify({"success": True, "message": "Puan başarıyla kaydedildi"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Hata oluştu: {str(e)}"}), 500

@app.route('/delete_point', methods=['POST'])
def delete_point():
    try:
        data = request.get_json()

        kullanici_id = request.cookies.get('user_data')
        puan = data.get('point')

        if not kullanici_id or puan is None:
            return jsonify({"success": False, "message": "Kullanıcı ID ve puan zorunludur"}), 400

        puan_kaydi = Puan.query.filter_by(kullanici_id=kullanici_id, puan=puan).first()

        if not puan_kaydi:
            return jsonify({"success": False, "message": "Belirtilen puan kaydı bulunamadı"}), 404

        db.session.delete(puan_kaydi)
        db.session.commit()

        return jsonify({"success": True, "message": "Puan başarıyla silindi"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": f"Hata oluştu: {str(e)}"}), 500

@app.route('/get_user_points', methods=['GET'])
def get_user_points():
    try:
        kullanici_id = request.cookies.get('user_data')  # ya da request.args.get('user_id')

        if not kullanici_id:
            return jsonify({"success": False, "message": "Kullanıcı ID bulunamadı"}), 400

        puanlar = Puan.query.filter_by(kullanici_id=kullanici_id).order_by(Puan.kazanilan_tarih.desc()).all()

        if not puanlar:
            return jsonify({"success": False, "message": "Puan kaydı bulunamadı"}), 404

        puan_listesi = [
            {
                "point": puan.puan,
                "date": puan.kazanilan_tarih.strftime('%Y-%m-%d')
            }
            for puan in puanlar
        ]

        return jsonify({"success": True, "puanlar": puan_listesi}), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Hata oluştu: {str(e)}"}), 500

@app.route('/get_pending_events', methods=['GET'])
def get_pending_events():
    pending_events = Etkinlik.query.filter(Etkinlik.onay_durumu == False).all()
    return jsonify({
        "events": [{
            "id": event.id,
            "event_name": event.etkinlik_adi,
            "description": event.aciklama,
            "date": event.tarih.strftime('%Y-%m-%d') if event.tarih else None,
            "time": event.saat.strftime('%H:%M') if event.saat else None,
            "duration": event.etkinlik_suresi,
            "location": event.konum,
            "category": event.kategori
        } for event in pending_events]
    })

@app.route('/approve_event', methods=['POST'])
def approve_event():
    try:
        data = request.get_json()
        etkinlik_id = data.get('eventId')

        etkinlik = Etkinlik.query.filter_by(id=etkinlik_id).first()
        if etkinlik:
            etkinlik.onay_durumu = True
            db.session.commit()
            return jsonify({"success": True, "message": "Event approved successfully!"})
        else:
            return jsonify({"success": False, "message": "Event not found!"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/delete_event', methods=['POST'])
def delete_event():
    try:
        data = request.get_json()
        etkinlik_id = data.get('eventId')

        etkinlik = Etkinlik.query.filter_by(id=etkinlik_id).first()
        if etkinlik:
            Katilimci.query.filter_by(etkinlik_id=etkinlik_id).delete()
            db.session.commit()

            db.session.delete(etkinlik)
            db.session.commit()
            return jsonify({"success": True, "message": "Etkinlik başarıyla silindi!"})
        else:
            return jsonify({"success": False, "message": "Etkinlik bulunamadı!"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/conceal_event', methods=['POST'])
def conceal_event():
    try:
        data = request.get_json()
        event_id = data.get('eventId')

        event = Etkinlik.query.filter_by(id=event_id).first()
        if event:
            Katilimci.query.filter_by(etkinlik_id=event_id).delete()
            db.session.commit()

            event.onay_durumu = False
            db.session.commit()
            return jsonify({"success": True, "message": "Etkinlik başarıyla gizlendi!"})
        else:
            return jsonify({"success": False, "message": "Etkinlik bulunamadı!"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/get_all_users', methods=['GET'])
def get_all_users():
    try:
        users = Kullanici.query.all()
        users_list = []

        for user in users:
            users_list.append({
                'kullanici_adi': user.kullanici_adi,
                'eposta': user.eposta,
                'konum': user.konum,
                'ilgi_alanlari': user.ilgi_alanlari,
                'ad': user.ad,
                'soyad': user.soyad,
                'dogum_tarihi': user.dogum_tarihi.strftime('%Y.%m.%d') if user.dogum_tarihi else None,
                'cinsiyet': user.cinsiyet,
                'telefon_no': user.telefon_no
            })

        return jsonify({'success': True, 'users': users_list})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/update_event', methods=['POST'])
def update_event():
    data = request.get_json()

    event_id = request.args.get('event_id')
    event = Etkinlik.query.get(event_id)

    if not event:
        return jsonify({'success': False, 'message': 'Event not found'}), 404

    event.etkinlik_adi = data.get('event_name', event.etkinlik_adi)
    event.aciklama = data.get('description', event.aciklama)
    event.tarih = datetime.strptime(data.get('date'), '%Y-%m-%d').date() if data.get('date') else event.tarih
    event.saat = datetime.strptime(data.get('time'), '%H:%M').time() if data.get('time') else event.saat
    event.konum = data.get('location', event.konum)
    event.kategori = data.get('category', event.kategori)

    db.session.commit()

    return jsonify({'success': True, 'message': 'Event updated successfully!'}), 200

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=3000)