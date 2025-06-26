
# 💰 MoneyMap

**MoneyMap** is a full-stack web application to track your income and expenses, manage budgets, and gain insights through beautiful charts and visualizations.

## 🚀 Live Demo

Check out the live version: [https://moneymap09.vercel.app/](https://moneymap09.vercel.app/)

---

## 📂 Project Structure

```

MoneyMap/
├── frontend/   # React app for user interface
├── backend/    # Express API and MongoDB integration

````

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rjsnhk/MoneyMap.git
cd MoneyMap
````

---

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at: `http://localhost:5173/`

---

### 3. Setup Backend

```bash
cd ../backend
npm install
```

#### ➕ Configure `.env` in `/backend`

Create a `.env` file and add the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Then run the backend:

```bash
npm run dev
```

The backend runs at: `http://localhost:5000/`

---

## ✨ Features

* Track income and expenses by category
* Visualize transactions using charts
* Secure user authentication (JWT)
* Responsive and user-friendly interface

---

## 🔧 Tech Stack

* **Frontend**: React, Tailwind CSS, Chart.js
* **Backend**: Node.js, Express.js, MongoDB, Mongoose
* **Authentication**: JWT (JSON Web Tokens)
* **Deployment**: Vercel (Frontend), Render/Other (Backend)

---

## 📬 Contact

Feel free to reach out if you have questions or want to contribute!

---

> Made with ❤️ by [Rajesh Nahak](https://rjsnhk.onrender.com/)

```

Let me know if you'd like badges, contribution guidelines, or API documentation added!
```
