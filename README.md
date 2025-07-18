# Adoptly

Adoptly is a comprehensive web application designed to facilitate animal adoption, donations, and volunteering. It provides a seamless experience for users looking to adopt pets, contribute to animal welfare, or volunteer their time, as well as for administrators managing the platform.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Adoptly aims to bridge the gap between animal shelters and potential adopters, donors, and volunteers. The platform allows users to:

- Browse and filter adoptable pets
- Submit adoption requests
- Donate to support animal welfare
- Volunteer for animal care and events
- For admins: manage pets, adoption requests, donations, and volunteers

---

## Features

### User Features

- **Registration & Login:** Secure authentication for users and admins.
- **Pet Browsing:** View all available pets, filter by type (dog, cat, etc.), and see detailed profiles.
- **Adoption Requests:** Submit and track adoption requests.
- **Donations:** Make monetary donations to support the shelter.
- **Volunteering:** Sign up for volunteering opportunities.
- **Responsive UI:** Works on desktops, tablets, and mobile devices.

### Admin Features

- **Dashboard:** Overview of platform activity.
- **Manage Pets:** Add, edit, approve, or remove pet listings.
- **Manage Requests:** Approve or reject adoption and volunteer requests.
- **Manage Donations:** View and track donations.
- **User Management:** View and manage registered users.

---

## System Architecture

- **Frontend:** Static HTML, CSS, and JavaScript (Vanilla JS)
- **Backend:** Node.js with Express.js REST API
- **Database:** MongoDB (for storing users, pets, requests, donations, etc.)
- **Communication:** Fetch API for frontend-backend communication

---

## Folder Structure

```
Adoptly project/
│
├── backend/
│   ├── controllers/         # API logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API endpoints
│   ├── app.js               # Express app entry point
│   └── ...                  # Other backend files
│
├── frontend/
│   ├── assets/
│   │   ├── css/             # Stylesheets
│   │   ├── img/             # Images and icons
│   │   └── js/              # JavaScript files
│   ├── index.html           # Main landing page
│   ├── admin.html           # Admin dashboard
│   └── ...                  # Other HTML files
│
├── README.md
└── ...
```

---

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

- Open `frontend/index.html` directly in your browser, or use a local server (e.g., Live Server extension in VS Code).

---

## Usage Guide

### For Users

1. **Register** for an account or log in.
2. **Browse pets** on the homepage or via the "Adopt" section.
3. **Filter pets** by type (dog, cat, etc.).
4. **Submit an adoption request** for a pet you are interested in.
5. **Donate** via the "Donate" section.
6. **Sign up to volunteer** in the "Volunteer" section.
7. **View your requests and status** in your user dashboard.

### For Admins

1. **Log in** via the admin login page.
2. **Access the dashboard** to view pending requests, manage pets, and see platform statistics.
3. **Approve or reject** adoption and volunteer requests.
4. **Add, edit, or remove** pet listings.
5. **View and manage donations and users.**

---

## API Endpoints

**User Authentication**

- `POST /register` — Register a new user
- `POST /login` — User login

**Pets**

- `GET /pets` — List all pets
- `POST /pets` — Add a new pet (admin)
- `PUT /pets/:id` — Edit pet details (admin)
- `DELETE /pets/:id` — Remove a pet (admin)

**Adoption Requests**

- `POST /adoption-request` — Submit an adoption request
- `GET /adoption-requests` — List all requests (admin)
- `PUT /adoption-requests/:id` — Approve/reject request (admin)

**Donations**

- `POST /donate` — Make a donation
- `GET /donations` — List all donations (admin)

**Volunteering**

- `POST /volunteer` — Submit volunteer application
- `GET /volunteers` — List all volunteers (admin)

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Other:** Fetch API, LocalStorage/SessionStorage, FontAwesome

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

**Adoptly** – Making animal adoption easier, one pet at a time!# Adoptly-Project
