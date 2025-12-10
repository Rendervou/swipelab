# SwipeLab - Platform Crowdsourced Feedback UI/UX Design

Sebuah platform komunitas untuk berbagi desain UI/UX, poster, logo, dan karya seni digital dengan sistem feedback dan gamifikasi.

## 📋 Fitur Utama

### 1. **Authentication (Laravel Breeze)**
- Register akun baru
- Login/Logout
- Profile management

### 2. **Upload Design**
- Upload design dengan judul, deskripsi, dan kategori
- Support format JPG/PNG maksimal 10MB
- Automatic point system (+10 points per upload)

### 3. **Swipe System**
- Lihat design random dari user lain (exclude milik sendiri)
- Swipe Left (tidak suka) / Swipe Right (suka)
- Automatic like points untuk design owner (+2 points)

### 4. **Feedback System**
- Berikan komentar + rating (1-5 bintang)
- Lihat feedback yang diterima
- Automatic feedback points (+1 point per feedback)

### 5. **Gamifikasi**
- **Point System:**
  - Upload Design: +10 points
  - Menerima Like: +2 points
  - Memberikan Feedback: +1 point
  
- **Level System:**
  - Beginner (0 points)
  - Intermediate (50 points)
  - Advanced (100 points)
  - Master (200 points)
  - Expert (500 points)
  - Legend (1000 points)

- **Badge System:**
  - Getting Started (0 points)
  - Contributor (10 points)
  - Popular Creator (50 points)
  - Master Creator (100 points)
  - Community Star (500 points)
  - Design Legend (1000 points)

### 6. **Dashboard**
- Total design yang diupload
- Total likes diterima
- Feedback yang masuk
- Total points dan current level
- Badge collection
- Recent designs

### 7. **Kategori Management**
- CRUD kategori (Create, Read, Update, Delete)
- Kategori default: UI/UX, Poster, Logo, Art, Web Design, Motion Graphics

## 🛠️ Tech Stack

- **Framework:** Laravel 10/11
- **Frontend:** Blade + Tailwind CSS
- **API:** RESTful dengan API Resources
- **Database:** MySQL
- **Storage:** Local Public Storage
- **Authentication:** Laravel Breeze + Sanctum

## 📁 Struktur Database

### Tables:
1. **users** - User accounts
2. **categories** - Design categories
3. **designs** - User design uploads
4. **swipes** - Swipe history (left/right)
5. **feedback** - Comments & ratings
6. **points** - User point tracking
7. **badges** - Achievement badges
8. **user_badges** - User badge collection

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js & npm

### Setup Steps

1. **Clone Repository**
```bash
git clone <repository>
cd swipelab
```

2. **Install Dependencies**
```bash
composer install
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure Database**
Edit `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swipelab
DB_USERNAME=root
DB_PASSWORD=
```

5. **Create Database**
```bash
mysql -u root -p
CREATE DATABASE swipelab;
EXIT;
```

6. **Run Migrations & Seeders**
```bash
php artisan migrate
php artisan db:seed
```

7. **Setup Storage Link**
```bash
php artisan storage:link
```

8. **Build Frontend Assets**
```bash
npm run build
```

9. **Start Development Server**
```bash
php artisan serve
npm run dev  # In another terminal
```

Access: `http://localhost:8000`

## 📡 API Endpoints

### Categories (Public)
```
GET    /api/categories              # Get all categories
GET    /api/categories/{id}         # Get specific category
POST   /api/categories              # Create (auth required)
PUT    /api/categories/{id}         # Update (auth required)
DELETE /api/categories/{id}         # Delete (auth required)
```

### Designs (Auth Required)
```
GET    /api/designs/my              # Get user's designs
GET    /api/designs/{id}            # Get specific design
POST   /api/designs                 # Upload design
PUT    /api/designs/{id}            # Update design
DELETE /api/designs/{id}            # Delete design
```

### Swipe System (Auth Required)
```
GET    /api/swipe/random            # Get random design to swipe
POST   /api/swipe/left              # Swipe left (dislike)
POST   /api/swipe/right             # Swipe right (like)
GET    /api/swipe/history           # Get swipe history
```

### Feedback (Auth Required)
```
GET    /api/designs/{id}/feedback   # Get feedback for design
GET    /api/feedback/received       # Get feedback received
GET    /api/feedback/given          # Get feedback given
POST   /api/feedback                # Submit feedback
PUT    /api/feedback/{id}           # Update feedback
DELETE /api/feedback/{id}           # Delete feedback
```

### Dashboard (Auth Required)
```
GET    /api/dashboard               # Get user dashboard stats
GET    /api/profile/{username}      # Get public user profile
```

## 📝 API Request & Response Examples

### 1. Register User
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Upload Design
```bash
curl -X POST http://localhost:8000/api/designs \
  -H "Authorization: Bearer {token}" \
  -F "title=My Awesome UI Design" \
  -F "description=A modern dashboard design" \
  -F "category_id=1" \
  -F "image=@design.jpg"
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "category_id": 1,
  "title": "My Awesome UI Design",
  "description": "A modern dashboard design",
  "image_url": "http://localhost:8000/storage/designs/...",
  "views": 0,
  "likes": 0,
  "created_at": "2024-12-09T10:00:00Z",
  "updated_at": "2024-12-09T10:00:00Z"
}
```

### 4. Get Random Design
```bash
curl -X GET "http://localhost:8000/api/swipe/random?category_id=1" \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "id": 2,
  "title": "Another Design",
  "description": "Great design description",
  "image_url": "http://localhost:8000/storage/designs/...",
  "views": 5,
  "likes": 3,
  "category": {
    "id": 1,
    "name": "UI/UX Design",
    "slug": "ui-ux"
  },
  "user": {
    "id": 2,
    "name": "Jane Smith"
  },
  "created_at": "2024-12-09T09:00:00Z"
}
```

### 5. Swipe Right (Like)
```bash
curl -X POST http://localhost:8000/api/swipe/right \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": 2
  }'
```

**Response:**
```json
{
  "message": "Swipe recorded",
  "swipe": {
    "id": 1,
    "user_id": 1,
    "design_id": 2,
    "direction": "right",
    "created_at": "2024-12-09T10:15:00Z"
  }
}
```

### 6. Submit Feedback
```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": 2,
    "comment": "Great design! Love the colors and layout.",
    "rating": 5
  }'
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "design_id": 2,
  "comment": "Great design! Love the colors and layout.",
  "rating": 5,
  "user": {
    "id": 1,
    "name": "John Doe"
  },
  "created_at": "2024-12-09T10:20:00Z"
}
```

### 7. Get Dashboard
```bash
curl -X GET http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": null,
    "created_at": "2024-12-09T08:00:00Z",
    "updated_at": "2024-12-09T08:00:00Z"
  },
  "total_uploads": 2,
  "total_likes": 5,
  "feedback_received": 3,
  "total_points": 25,
  "level": "Intermediate",
  "badges": [
    {
      "id": 1,
      "name": "Getting Started",
      "description": "Your first step",
      "required_points": 0
    },
    {
      "id": 2,
      "name": "Contributor",
      "description": "Uploaded your first design",
      "required_points": 10
    }
  ],
  "recent_designs": [...],
  "recent_feedback": [...]
}
```

## 🎨 Blade Views

### Tersedia:
1. **dashboard.blade.php** - Dashboard user dengan statistik
2. **designs/create.blade.php** - Form upload design
3. **swipe.blade.php** - Swipe interface + feedback form
4. **categories.blade.php** - Category management

### Struktur View:
- Menggunakan Laravel Breeze layout
- Tailwind CSS untuk styling
- Alpine.js optional untuk interaktivity

## 🔐 Authentication & Authorization

- Menggunakan **Laravel Sanctum** untuk API
- **Breeze** untuk web authentication
- Middleware auth melindungi protected routes
- Authorization checks untuk edit/delete resource milik user

## 📊 Point System Detail

```
Upload Design:     +10 points
Receive Like:      +2 points
Give Feedback:     +1 point
```

## 🛡️ Security Features

- CSRF protection di semua forms
- Password hashing dengan bcrypt
- File validation (JPG/PNG, max 10MB)
- Rate limiting (optional)
- User authorization pada resource modifications

## 🚢 Deployment

### Production Setup

1. **Set Environment**
```bash
cp .env.production .env
APP_ENV=production
APP_DEBUG=false
```

2. **Build Assets**
```bash
npm run prod
```

3. **Run Migrations**
```bash
php artisan migrate --force
php artisan db:seed
```

4. **Cache Config**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

5. **Setup Web Server (Nginx example)**
```nginx
server {
    listen 80;
    server_name swipelab.com;
    root /var/www/swipelab/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

6. **Setup SSL (Let's Encrypt)**
```bash
sudo certbot certonly --nginx -d swipelab.com
```

## 📚 Additional Resources

- Laravel Documentation: https://laravel.com/docs
- Laravel Breeze: https://github.com/laravel/breeze
- Sanctum: https://laravel.com/docs/sanctum
- Tailwind CSS: https://tailwindcss.com

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - feel free to use for personal & commercial projects

## 💬 Support

Untuk pertanyaan atau issues, silakan buat GitHub issue atau hubungi team.

---

**Made with ❤️ for the Design Community**
