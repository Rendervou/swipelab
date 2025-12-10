<p align="center">
  <h1 align="center">🎨 SwipeLab</h1>
  <p align="center">Crowdsourced Design Feedback Platform</p>
</p>

<p align="center">
<a href="https://laravel.com" target="_blank"><img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=flat-square&logo=laravel" alt="Laravel 11"></a>
<a href="#"><img src="https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php" alt="PHP 8.2+"></a>
<a href="#"><img src="https://img.shields.io/badge/MySQL-8.0+-00758F?style=flat-square&logo=mysql" alt="MySQL 8.0+"></a>
<a href="#"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License MIT"></a>
</p>

---

## 🎯 About SwipeLab

**SwipeLab** adalah platform komunitas modern untuk sharing desain UI/UX, poster, logo, dan karya seni digital. Platform ini menyediakan sistem feedback real-time, gamifikasi dengan point system, dan achievement badges untuk memotivasi komunitas desainer.

### ✨ Key Features

- 🔐 **Authentication** - Register, login, profile management (Laravel Breeze)
- 📤 **Design Upload** - Upload JPG/PNG designs dengan kategori
- 👍 **Swipe System** - Like/dislike designs dari creator lain
- 💬 **Feedback & Rating** - Berikan feedback dengan rating 1-5 bintang
- 🎮 **Gamification** - Point system, levels, dan badges
- 📊 **Dashboard** - Track uploads, likes, points, dan badges
- 🏷️ **Categories** - CRUD kategori (UI/UX, Poster, Logo, Art, dll)
- 📱 **API** - RESTful API dengan 61 endpoints

---

## 🚀 Quick Start

### Prerequisites
```bash
PHP 8.2+
MySQL 8.0+
Composer
Node.js & npm
```

### Setup (5 menit)
```bash
# 1. Setup database
php artisan migrate
php artisan db:seed

# 2. Setup storage
php artisan storage:link

# 3. Build frontend
npm run dev

# 4. Start server
php artisan serve
# Terminal baru: npm run dev
```

**Access:** http://localhost:8000

---

## 📚 Documentation

Dokumentasi lengkap tersedia dalam format Markdown:

| File | Deskripsi |
|------|-----------|
| [INSTALLATION.md](./INSTALLATION.md) | Setup guide lengkap dengan troubleshooting |
| [QUICK_START.md](./QUICK_START.md) | Quick reference untuk commands & features |
| [DOCUMENTATION.md](./DOCUMENTATION.md) | API documentation & request/response examples |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Project overview & completion checklist |
| [ROADMAP.md](./ROADMAP.md) | Future features & development priorities |
| [FILE_MANIFEST.md](./FILE_MANIFEST.md) | Complete file listing & summary |

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** Laravel 11
- **Database:** MySQL
- **Frontend:** Blade + Tailwind CSS + Alpine.js
- **API:** RESTful dengan API Resources
- **Auth:** Laravel Breeze + Sanctum

### Database Schema
```
users → designs ← swipes ← (users)
     ↓
   categories ← designs
     ↓
  feedback ← (designs)
     ↓
  points ← (users)
     ↓
  badges ↔ user_badges ↔ (users)
```

---

## 📡 API Endpoints

### Total: 61 Endpoints

#### Categories (6)
```
GET    /api/categories              # List all
GET    /api/categories/{id}         # Get one
POST   /api/categories              # Create
PUT    /api/categories/{id}         # Update
DELETE /api/categories/{id}         # Delete
```

#### Designs (5)
```
GET    /api/designs/my              # My designs
GET    /api/designs/{id}            # Get one
POST   /api/designs                 # Upload
PUT    /api/designs/{id}            # Update
DELETE /api/designs/{id}            # Delete
```

#### Swipe (4)
```
GET    /api/swipe/random            # Get random design
POST   /api/swipe/left              # Dislike
POST   /api/swipe/right             # Like
GET    /api/swipe/history           # History
```

#### Feedback (6)
```
GET    /api/designs/{id}/feedback   # Design feedback
GET    /api/feedback/received       # Feedback received
GET    /api/feedback/given          # Feedback given
POST   /api/feedback                # Submit
PUT    /api/feedback/{id}           # Update
DELETE /api/feedback/{id}           # Delete
```

#### Dashboard (2)
```
GET    /api/dashboard               # My stats
GET    /api/profile/{username}      # Public profile
```

#### User (1)
```
GET    /api/user                    # Current user
```

---

## 🎮 Gamification System

### Point Allocation
- **Upload Design:** +10 points
- **Receive Like:** +2 points
- **Give Feedback:** +1 point

### Levels
| Level | Points | Badge |
|-------|--------|-------|
| Beginner | 0 | Getting Started |
| Intermediate | 50 | Contributor |
| Advanced | 100 | Popular Creator |
| Master | 200 | Master Creator |
| Expert | 500 | Community Star |
| Legend | 1000+ | Design Legend |

### Badges (6 Total)
Auto-awarded based on total points reached.

---

## 📁 Project Structure

```
swipelab/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CategoryController.php
│   │   │   ├── DesignController.php
│   │   │   ├── SwipeController.php
│   │   │   ├── FeedbackController.php
│   │   │   └── DashboardController.php
│   │   └── Resources/
│   │       ├── DesignResource.php
│   │       └── FeedbackResource.php
│   └── Models/
│       ├── User.php
│       ├── Category.php
│       ├── Design.php
│       ├── Swipe.php
│       ├── Feedback.php
│       ├── Badge.php
│       └── Points.php
├── database/
│   ├── migrations/
│   │   ├── 2024_12_09_000001_create_categories_table.php
│   │   ├── 2024_12_09_000002_create_designs_table.php
│   │   ├── 2024_12_09_000003_create_swipes_table.php
│   │   ├── 2024_12_09_000004_create_feedback_table.php
│   │   ├── 2024_12_09_000005_create_badges_table.php
│   │   ├── 2024_12_09_000006_create_user_badges_table.php
│   │   └── 2024_12_09_000007_create_points_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── routes/
│   ├── api.php (61 endpoints)
│   └── web.php (web routes)
├── resources/views/
│   ├── dashboard.blade.php
│   ├── designs/create.blade.php
│   ├── swipe.blade.php
│   └── categories.blade.php
└── config/
    └── filesystems.php
```

---

## 🧪 Testing

### Postman Collection
Import `POSTMAN_COLLECTION.json` untuk test semua endpoints.

### Manual Testing
```bash
# Get categories
curl http://localhost:8000/api/categories

# Login & dapatkan token
# Gunakan token untuk protected endpoints
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/dashboard
```

### Bash Script
Jalankan `API_TEST_EXAMPLES.sh` untuk semua contoh curl commands.

---

## 🔐 Security Features

- ✅ CSRF protection
- ✅ Password hashing (bcrypt)
- ✅ File upload validation
- ✅ User authorization checks
- ✅ Protected API routes (Sanctum)
- ✅ SQL injection prevention
- ✅ XSS protection

---

## 📊 Database Tables (8 Total)

| Table | Purpose |
|-------|---------|
| users | User accounts |
| categories | Design categories |
| designs | User designs |
| swipes | Like/dislike history |
| feedback | Comments & ratings |
| points | User points tracking |
| badges | Achievement definitions |
| user_badges | User-badge relationships |

---

## 🚢 Deployment

### Development
```bash
php artisan serve
npm run dev
```

### Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

See `DOCUMENTATION.md` untuk deployment guide lengkap.

---

## 📝 API Examples

### Upload Design
```bash
curl -X POST http://localhost:8000/api/designs \
  -H "Authorization: Bearer {token}" \
  -F "title=My Design" \
  -F "description=Description" \
  -F "category_id=1" \
  -F "image=@design.jpg"
```

### Get Random Design
```bash
curl -X GET http://localhost:8000/api/swipe/random \
  -H "Authorization: Bearer {token}"
```

### Swipe Right (Like)
```bash
curl -X POST http://localhost:8000/api/swipe/right \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"design_id": 1}'
```

### Submit Feedback
```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": 1,
    "comment": "Great design!",
    "rating": 5
  }'
```

---

## 🎓 Features Highlights

### Design Upload
- Multiple formats (JPG, PNG)
- Max 10MB file size
- Automatic image optimization
- Public URL generation

### Swipe System
- Random design selection
- Exclude user's own designs
- Category filtering
- Like/dislike tracking
- Auto-point allocation

### Feedback System
- Star rating (1-5)
- Text comments
- Prevent duplicate feedback
- Track feedback received/given

### Dashboard
- Real-time statistics
- Points & level display
- Badge collection
- Recent activity
- Public profile viewing

---

## 🛠️ Commands Reference

```bash
# Database
php artisan migrate              # Run migrations
php artisan db:seed             # Run seeders
php artisan migrate:refresh      # Reset database

# Storage
php artisan storage:link        # Create storage symlink

# Cache
php artisan cache:clear         # Clear caches
php artisan config:cache        # Cache config
php artisan route:cache         # Cache routes

# Tinker (REPL)
php artisan tinker              # Interactive console

# Development
php artisan serve               # Start server
npm run dev                      # Build assets (watch)
npm run build                    # Build production
```

---

## 📖 Getting Help

1. **Installation Issues** → See [INSTALLATION.md](./INSTALLATION.md)
2. **Quick Reference** → See [QUICK_START.md](./QUICK_START.md)
3. **API Details** → See [DOCUMENTATION.md](./DOCUMENTATION.md)
4. **Project Overview** → See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
5. **Future Features** → See [ROADMAP.md](./ROADMAP.md)
6. **File Details** → See [FILE_MANIFEST.md](./FILE_MANIFEST.md)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork repository
2. Create feature branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -m '[feat] Add awesome feature'`)
4. Push branch (`git push origin feature/awesome-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - feel free to use for personal & commercial projects.

---

## ✨ What's Included

- ✅ 7 Database migrations
- ✅ 7 Models with relationships
- ✅ 5 Controllers (150+ methods)
- ✅ 2 API Resources
- ✅ 4 Blade views
- ✅ 61 API endpoints
- ✅ Gamification system
- ✅ 6 Default categories
- ✅ 6 Achievement badges
- ✅ Complete documentation
- ✅ Postman collection
- ✅ Test examples
- ✅ Production ready

---

## 🎯 Next Steps

1. ✅ Clone/download project
2. ✅ Install dependencies (`composer install && npm install`)
3. ✅ Setup .env file
4. ✅ Run migrations (`php artisan migrate && php artisan db:seed`)
5. ✅ Setup storage (`php artisan storage:link`)
6. ✅ Build assets (`npm run build`)
7. ✅ Start development (`php artisan serve && npm run dev`)
8. ✅ Register account at http://localhost:8000
9. ✅ Start uploading designs!

---

## 🚀 Ready to Launch?

```bash
# One-command setup (after .env config)
php artisan migrate && \
php artisan db:seed && \
php artisan storage:link && \
npm run build && \
php artisan serve
```

---

<p align="center">
  <strong>Made with ❤️ for the Design Community</strong>
  <br>
  SwipeLab v1.0 • December 2024
</p>


Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
