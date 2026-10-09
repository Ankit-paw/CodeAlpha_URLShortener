# Shortly — URL Shortener 🚀

A full-stack URL shortener built with Node.js, Express.js, MongoDB, HTML, CSS, and JavaScript.

Shortly converts long URLs into short, shareable links and provides click analytics, custom aliases, and recent URL history.

## ✨ Features

* 🔗 Generate short URLs
* 🎯 Custom aliases for personalized links
* 📊 Track link clicks
* 📚 View recently shortened URLs
* 🔄 Redirect short links to original URLs
* 🛡️ Security headers and API rate limiting
* 📱 Responsive frontend interface
* ☁️ MongoDB Atlas database integration

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas
**Libraries:** Mongoose, Helmet, CORS, express-rate-limit

## 📁 Project Structure

```text
CodeAlpha_URLShortener/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env.example
└── .gitignore
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ankit-paw/CodeAlpha_URLShortener.git
cd CodeAlpha_URLShortener
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
```

Replace the MongoDB placeholder with your own connection string. Never publish your real credentials.

### 4. Start the backend

```bash
node server.js
```

### 5. Run the frontend

Open `frontend/index.html` with VS Code Live Server.

## 🔌 API Endpoints

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| POST   | `/api/urls`                      | Create a short URL       |
| GET    | `/api/urls/history`              | Get recent URLs          |
| GET    | `/api/urls/analytics/:shortCode` | Get click analytics      |
| GET    | `/:shortCode`                    | Redirect to original URL |

## 🔐 Security

* Environment variables are excluded from Git using `.gitignore`.
* Helmet adds security-related HTTP headers.
* Rate limiting helps reduce excessive API requests.
* Request body size is limited.

## 👨‍💻 Author

**Ankit Patwa**

GitHub: [Ankit-paw](https://github.com/Ankit-paw)

---

Built as a backend development internship project for CodeAlpha.
