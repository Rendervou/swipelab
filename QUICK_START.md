# 🎨 SwipeLab - Crowdsourced Design Feedback Platform

Sebuah aplikasi Laravel modern untuk sharing, feedback, dan gamifikasi design UI/UX, poster, logo, dan karya seni digital.

## ⚡ Quick Start

### 1. Setup Database
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE swipelab;"

# Run migrations
php artisan migrate

# Seed categories and badges
php artisan db:seed
```

### 2. Setup Storage
```bash
php artisan storage:link
```

### 3. Run Development Servers
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Frontend assets
npm run dev
```

Access: **http://localhost:8000**

## 📦 Project Structure

```
swipelab/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CategoryController.php    # CRUD kategori
│   │   │   ├── DesignController.php      # Upload & manage design
│   │   │   ├── SwipeController.php       # Swipe left/right
│   │   │   ├── FeedbackController.php    # Feedback & rating
│   │   │   └── DashboardController.php   # User stats
│   │   └── Resources/
│   │       ├── DesignResource.php        # Design API response
│   │       └── FeedbackResource.php      # Feedback API response
│   └── Models/
│       ├── User.php
│       ├── Category.php
│       ├── Design.php
│       ├── Swipe.php
│       ├── Feedback.php
│       ├── Badge.php
│       └── Points.php
├── database/
│   ├── migrations/              # Table structures
│   └── seeders/
│       └── DatabaseSeeder.php   # Sample data
├── resources/
│   └── views/
│       ├── dashboard.blade.php         # User dashboard
│       ├── designs/create.blade.php    # Upload form
│       ├── swipe.blade.php             # Swipe interface
│       └── categories.blade.php        # Category management
└── routes/
    └── api.php                         # API endpoints

```

## 🔑 Key Features

### ✅ Authentication
- Register & Login dengan Laravel Breeze
- Profile management
- Token-based API (Sanctum)

### ✅ Design Upload
- Upload JPG/PNG (max 10MB)
- Kategori pilihan
- Auto +10 points

### ✅ Swipe System
- Random design (exclude milik sendiri)
- Swipe Left/Right
- Auto +2 points untuk design owner

### ✅ Feedback
- Rating 1-5 bintang
- Komentar konstruktif
- Auto +1 points

### ✅ Gamifikasi
```
Points:
  - Upload design:    +10 points
  - Receive like:     +2 points
  - Give feedback:    +1 point

Levels:
  - Beginner:         0 points
  - Intermediate:     50 points
  - Advanced:         100 points
  - Master:           200 points
  - Expert:           500 points
  - Legend:           1000 points

Badges:
  - Getting Started         (0 points)
  - Contributor             (10 points)
  - Popular Creator         (50 points)
  - Master Creator          (100 points)
  - Community Star          (500 points)
  - Design Legend           (1000 points)
```

## 🌐 API Endpoints

### Public
```
GET /api/categories              # List all categories
GET /api/categories/{id}         # Get category
```

### Auth Required
```
POST   /api/designs              # Upload design
GET    /api/designs/my           # My designs
GET    /api/swipe/random         # Get random design
POST   /api/swipe/left           # Dislike
POST   /api/swipe/right          # Like
POST   /api/feedback             # Give feedback
GET    /api/dashboard            # User stats
GET    /api/profile/{username}   # Public profile
```

**Complete API docs:** See `DOCUMENTATION.md`

## 📊 Database Schema

```
users
├── id, name, email, password, created_at

categories
├── id, name, slug, description

designs
├── id, user_id, category_id, title, description, image_path, views, likes

swipes
├── id, user_id, design_id, direction (left/right), created_at

feedback
├── id, user_id, design_id, comment, rating (1-5), created_at

points
├── id, user_id, total_points, upload_points, like_points, feedback_points

badges
├── id, name, description, required_points

user_badges
├── id, user_id, badge_id
```

## 🎯 Usage Example

### 1. Register & Login
Visit `http://localhost:8000/register`

### 2. Upload Design
- Go to Dashboard → Upload Design
- Fill form & upload image
- Earn +10 points ✓

### 3. Swipe Designs
- Go to Swipe interface
- Swipe Left (👎) or Right (👍)
- Give feedback & rating
- Earn +1 point for feedback ✓

### 4. View Dashboard
- See stats: uploads, likes, feedback, points, level, badges
- View recent designs

### 5. Manage Categories (Admin)
- Go to Categories page
- Add/Edit/Delete categories

## 🔧 Configuration

### .env Setup
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swipelab
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public

SANCTUM_STATEFUL_DOMAINS=localhost:8000
```

## 📁 File Upload Location
Images stored in: `storage/app/public/designs/`

Access via: `http://localhost:8000/storage/designs/filename.jpg`

## 🧪 Testing API

### Using Curl
```bash
# Create design
curl -X POST http://localhost:8000/api/designs \
  -H "Authorization: Bearer {token}" \
  -F "title=My Design" \
  -F "description=Desc" \
  -F "category_id=1" \
  -F "image=@design.jpg"

# Get random design
curl -X GET http://localhost:8000/api/swipe/random \
  -H "Authorization: Bearer {token}"

# Swipe right (like)
curl -X POST http://localhost:8000/api/swipe/right \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"design_id": 1}'

# Submit feedback
curl -X POST http://localhost:8000/api/feedback \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": 1,
    "comment": "Great design!",
    "rating": 5
  }'
```

### Using Postman
1. Import `DOCUMENTATION.md` examples
2. Set Authorization header: `Bearer {token}`
3. Test endpoints

## 🚀 Deployment

### Heroku
```bash
heroku create swipelab
git push heroku main
heroku run php artisan migrate --force
heroku run php artisan db:seed
```

### DigitalOcean / VPS
See `DOCUMENTATION.md` → Deployment section

## 📝 Common Issues

### Storage link error
```bash
php artisan storage:link
```

### Migrations fail
```bash
php artisan migrate:reset
php artisan migrate
php artisan db:seed
```

### API returns 401
Check Bearer token in Authorization header

### Images not showing
Verify `public/storage` symlink exists

## 📚 Documentation
- **Full API Docs:** `DOCUMENTATION.md`
- **Laravel Docs:** https://laravel.com/docs
- **Tailwind CSS:** https://tailwindcss.com

## 💡 Next Steps

1. ✅ Customize design in `resources/views/`
2. ✅ Add email notifications
3. ✅ Implement search & filters
4. ✅ Add user following system
5. ✅ Create admin dashboard
6. ✅ Setup payment integration

## 🤝 Support

Found a bug? Create an issue!

---

**Built with Laravel 10/11 + Tailwind CSS + MySQL**

Enjoy building! 🚀
