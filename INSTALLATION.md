# 🚀 Installation Guide - SwipeLab

Complete step-by-step installation guide untuk SwipeLab platform.

## ✅ Prerequisites

Pastikan sudah install:
- **PHP** 8.2+ (with extensions: PDO, OpenSSL, Mbstring, JSON)
- **Composer** (latest version)
- **MySQL** 8.0+ atau **MariaDB** 10.3+
- **Node.js** 14+ dan **npm**
- **Git** (optional, untuk clone repo)

### Check Requirements
```bash
# PHP version
php -v

# Composer
composer --version

# Node.js dan npm
node -v
npm -v

# MySQL
mysql --version
```

## 📦 Step 1: Clone & Setup Project

### Option A: Clone from Git
```bash
git clone <repository-url>
cd swipelab
```

### Option B: Manual Setup
```bash
# Create directory
mkdir swipelab
cd swipelab

# Copy files ke folder ini (dari project folder)
# Pastikan sudah ada: app/, database/, routes/, etc.
```

## 🔧 Step 2: Install Dependencies

### Install Composer Dependencies
```bash
composer install
```

### Install NPM Dependencies
```bash
npm install
```

### Update Dependencies (optional)
```bash
composer update
npm update
```

## 🔐 Step 3: Environment Configuration

### Generate APP_KEY
```bash
php artisan key:generate
```

### Setup .env File
```bash
# Copy .env.example ke .env
cp .env.example .env
```

### Edit .env dengan text editor (VS Code, Notepad++, dll)

**Database Configuration:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swipelab
DB_USERNAME=root
DB_PASSWORD=
```

**Storage Configuration:**
```env
FILESYSTEM_DISK=public
```

**API Configuration:**
```env
SANCTUM_STATEFUL_DOMAINS=localhost:8000
```

## 📊 Step 4: Database Setup

### Create Database
```bash
# Via MySQL Command Line
mysql -u root -p
# Masukkan password (jika ada)

# Jalankan command:
CREATE DATABASE swipelab;
EXIT;
```

### Alternative: Via Laragon/XAMPP
1. Buka phpMyAdmin (http://localhost/phpmyadmin)
2. Klik "New"
3. Database name: `swipelab`
4. Klik "Create"

## 🗄️ Step 5: Run Migrations & Seeders

### Jalankan Migrations (buat tabel)
```bash
php artisan migrate
```

**Output yang diharapkan:**
```
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (...)
[semua migrations berhasil]
```

### Jalankan Seeders (isi data awal)
```bash
php artisan db:seed
```

**Data yang ditambahkan:**
- 6 Categories (UI/UX, Poster, Logo, Art, Web Design, Motion Graphics)
- 6 Badges (Getting Started, Contributor, Popular Creator, Master Creator, Community Star, Design Legend)

## 🖼️ Step 6: Setup File Storage

### Create Storage Link
```bash
php artisan storage:link
```

**Verifikasi:**
```bash
# Windows - cek apakah folder symlink terbuat
dir public/storage
```

**Jika error terjadi:**
```bash
# Remove symlink jika sudah ada
rm public/storage

# Buat ulang
php artisan storage:link
```

## 🎨 Step 7: Build Frontend Assets

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## 🚀 Step 8: Start Development Servers

### Terminal 1: Laravel Development Server
```bash
php artisan serve
```

**Output:**
```
Starting Laravel development server: http://127.0.0.1:8000
```

### Terminal 2: Frontend Asset Watcher
```bash
npm run dev
```

**Output:**
```
[Vite] ...
✓ built in XXXms
```

## 🌐 Step 9: Access Application

Buka browser dan akses:
```
http://localhost:8000
```

**Home Page:** Shows welcome screen
**Register:** Click "Register" di top right
**Login:** After register, login with credentials

## ✨ Step 10: Verify Installation

### Checklist
- [ ] Homepage loads (http://localhost:8000)
- [ ] Register page accessible (/register)
- [ ] Can create account with email
- [ ] Can login with credentials
- [ ] Dashboard shows after login
- [ ] Can see "Upload Design" button
- [ ] Can see "Swipe" button
- [ ] Images load correctly

### Test API (Optional)
```bash
# Test categories endpoint
curl http://localhost:8000/api/categories

# Expected response:
# [{"id":1,"name":"UI/UX Design","slug":"ui-ux",...}, ...]
```

## 🐛 Troubleshooting

### Issue: "APP_KEY not set"
```bash
php artisan key:generate
```

### Issue: "Database connection refused"
- Check MySQL is running
- Verify DB_HOST, DB_USERNAME, DB_PASSWORD di .env
- Create database manually via phpMyAdmin

```bash
# Test connection
php artisan tinker
>>> DB::connection()->getPdo()
```

### Issue: "SQLSTATE[HY000]: General error"
```bash
# Reset database
php artisan migrate:reset
php artisan migrate
php artisan db:seed
```

### Issue: "Specified key was too long"
- Edit database/migrations files
- Change charset dalam migrations jika perlu

### Issue: "Storage link tidak berfungsi"
```bash
# Cek apakah symlink ada
php artisan storage:link

# Verify file dapat diakses
# http://localhost:8000/storage/designs/filename.jpg
```

### Issue: "npm run dev tidak berjalan"
```bash
# Clear npm cache
npm cache clean --force

# Install ulang
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "CORS error pada API"
- Verify SANCTUM_STATEFUL_DOMAINS di .env
- Check config/cors.php

## 📱 Database Verification

### Check Tables Created
```bash
mysql -u root -p swipelab

# Di MySQL console:
SHOW TABLES;

# Output harus menampilkan:
# - users
# - categories
# - designs
# - swipes
# - feedback
# - points
# - badges
# - user_badges
```

## 🔄 Reset Database (Jika Diperlukan)

```bash
# Reset migrations + seeders
php artisan migrate:reset

# Jalankan ulang
php artisan migrate
php artisan db:seed
```

## 📝 Create Test User (Manual)

```bash
php artisan tinker

# Create user
$user = \App\Models\User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('password'),
]);

# Create points record
\App\Models\Points::create(['user_id' => $user->id]);

exit
```

## 🎯 Next Steps

1. **Customize Branding**
   - Edit `resources/views/layouts/app.blade.php`
   - Change app name, colors, logo

2. **Add More Categories**
   - Via API: POST `/api/categories`
   - Atau edit `database/seeders/DatabaseSeeder.php`

3. **Configure Email**
   - Edit `.env` mail settings
   - For notifications

4. **Setup SSL (Production)**
   - Use Let's Encrypt
   - Configure nginx/apache

5. **Performance Optimization**
   - Run: `php artisan config:cache`
   - Run: `php artisan route:cache`
   - Run: `php artisan view:cache`

## 🆘 Additional Help

### Common Commands
```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Run migrations step by step
php artisan migrate --step

# Rollback last migration
php artisan migrate:rollback

# Create new migration
php artisan make:migration create_table_name

# Tinker console (interactive)
php artisan tinker
```

### File Permissions (Linux/Mac)
```bash
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

### Apache .htaccess (if needed)
Create `public/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [QSA,L]
</IfModule>
```

---

**Installation Complete! Enjoy building with SwipeLab! 🚀**

For more help, see:
- DOCUMENTATION.md - Full API documentation
- QUICK_START.md - Quick reference guide
