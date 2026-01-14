# 🛡️ SHAKTI – AI Safety Navigation

![SHAKTI Badge](https://img.shields.io/badge/SHAKTI-Safety_First-e91e63?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**AI-Powered Safe Route Navigation for Women & Night Commuters**

🔗 **Live Demo:** _(https://shakti-project.vercel.app/)_  
🎥 **Video Demo:** _(https://drive.google.com/file/d/1XDYznmgY4uqmidifSvMaTtcYyfJrBEjG/view?usp=drivesdk)_

---

## 🎯 Problem Statement
Every 16 minutes, a woman faces harassment in urban India.  
SHAKTI addresses this by combining **safe route navigation**, **live tracking**, and **emergency SOS alerts** into one simple platform.

---

## ✨ Core Features

| Feature | Description | Status |
|------|-----------|------|
| 🤖 AI Route Scoring | Suggests safer routes based on safety score | ✅ |
| 🚨 One-Click SOS | Sends alert with live location | ✅ |
| 📍 Live Location | Real-time GPS tracking | ✅ |
| 💬 AI Safety Bot | 24/7 safety assistance | ✅ |
| 🔐 Phone Authentication | OTP-based login | ✅ |

---

## 🗺️ Smart Navigation

```js
const routeOptions = {
  safest: "🛡️ High safety (92/100)",
  balanced: "⚖️ Balanced route (78/100)",
  fastest: "⚡ Fastest path (65/100)"
};
```
Users can choose routes based on safety vs speed preference.

---

## 🚨 Emergency SOS Flow
1. Press SOS Button
2. User Confirmation
3. Auto-send:
   - 📍 Live Location
   - 📩 Alert Message
   - 👥 Emergency Contacts
  
---

## 🚀 Quick Start
1️⃣ Clone & Install
```bash
git clone https://github.com/yourusername/shakti.git
cd shakti
npm install
```

2️⃣ Run App
```bash
npm start
```
Open http://localhost:3000

---

## 📱 User Flow
Login → Add Emergency Contacts → Find Route →
Choose Safest Path → Start Journey →
Emergency? → Press SOS → Alert Sent

---

## 💻 Tech Stack
| Layer |	Technology |
|-------|------------|
| Frontend | React 18 + Hooks |
| Maps | Leaflet.js + React-Leaflet |
| Auth | Firebase Authentication |
| Backend |	Firebase Services |
| AI Logic | Custom Safety Scoring |
| Chatbot |	Rule-based AI Bot |

---

## 📁 Project Structure
SHAKTI/
```
SHAKTI/
├── backend-app/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── crime_data.py
│   │   │   ├── sos.py
│   │   │   └── routes.py
│   │   ├── utils/
│   │   │   ├── map_utils.py
│   │   │   └── safety_scoring.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend-app/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.js
│   │   │   ├── Chatbot.js
│   │   │   ├── Contacts.js
│   │   │   ├── Controls.js
│   │   │   ├── MapView.js
│   │   │   └── SOSButton.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── LICENSE
└── README.md
```

---


## 🌍 Deployment
### Frontend (Vercel)
```bash
npm run build
```
Deploy /build folder.

### Environment Variables
```env
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

---

## 🏆 Hackathon Highlights

- Safety-first navigation approach
- Real-time SOS alert system
- Simple phone-based authentication
- Clean, user-focused UI

---

## 🤝 Team
| Role | Contribution |
|------|--------------|
| Frontend Dev | UI & UX |
| Backend Dev	| Firebase & Auth |
| AI Logic | Route Safety Scoring |
| Design | User Experience |

---

## 📄 License

MIT License









