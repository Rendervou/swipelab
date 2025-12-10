# 🎛️ Admin Role-Based Access Control (RBAC) System

## Overview

SwipeLab now has a complete role-based access control system with **Admin** and **User** roles. This allows administrators to manage users, designs, feedback, and categories through a dedicated admin panel.

## Features Implemented

### 1. **Database Schema**
- **Users Table Migration**: Added `role` enum field (`'user'`, `'admin'`) with default value `'user'`
- **Last Admin Login Timestamp**: Tracks when admins last logged in for security auditing
- **Backward Compatibility**: All existing users default to `'user'` role

### 2. **User Model Enhancements**
```php
// New helper methods in User model
$user->isAdmin()   // Returns true if user is admin
$user->isUser()    // Returns true if user is regular user
```

### 3. **Admin Middleware Protection**
- **IsAdmin Middleware**: Protects admin routes, returns 403 Unauthorized for non-admins
- **Registered in Kernel**: Available as `'admin'` middleware alias
- **Route Protection**: All admin routes require both `'auth'` and `'admin'` middleware

### 4. **Admin Routes** (Protected by `/admin` prefix and admin middleware)
```
GET  /admin                      → Admin Dashboard
GET  /admin/users               → User Management
PATCH /admin/users/{user}/role  → Update User Role (promote/demote)
DELETE /admin/users/{user}      → Delete User
GET  /admin/designs             → Design Moderation
DELETE /admin/designs/{design}  → Delete Design
GET  /admin/feedback            → Feedback Management
DELETE /admin/feedback/{item}   → Delete Feedback
GET  /admin/categories          → Category Overview
```

### 5. **Admin Dashboard Controller**
Full-featured controller with methods for:
- **Dashboard Overview**: Statistics and recent activity
- **User Management**: List, promote, demote, delete users
- **Design Moderation**: Review and delete designs
- **Feedback Management**: Review and moderate feedback
- **Category Management**: View category statistics

### 6. **Admin Dashboard Views**

#### Admin Dashboard (`/admin`)
- 📊 Platform statistics (total users, designs, feedback, likes, views)
- 👥 Recent users list with role badges
- ⭐ Top designs by likes
- 🎨 Recent designs table
- Quick management links to all admin sections

#### User Management (`/admin/users`)
- List all users with pagination
- View user roles (Admin/User badges)
- Promote users to admin
- Demote admins to regular users
- Delete users (cannot delete own account)

#### Design Moderation (`/admin/designs`)
- Grid view of all designs
- Design statistics (likes, views)
- Delete inappropriate or spam designs
- Designer attribution

#### Feedback Management (`/admin/feedback`)
- List all feedback/reviews
- Associate feedback with designs and users
- Delete spam or inappropriate feedback
- Star ratings display
- Timestamps for audit trails

#### Category Management (`/admin/categories`)
- View all categories
- Display design count per category
- Beautiful gradient card layout

### 7. **Navigation Integration**
- Admin users see "🎛️ Admin Panel" link in dropdown menu
- Link appears on both desktop and mobile navigation
- Only visible to users with admin role

### 8. **Artisan Command**
Promote a user to admin without database access:
```bash
php artisan make:admin email@example.com
```

## How to Use

### 1. **Promote a User to Admin**
```bash
# Using the command
php artisan make:admin user@example.com

# Or manually via database
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### 2. **Access Admin Panel**
1. Log in as an admin user
2. Click "🎛️ Admin Panel" in the user dropdown menu
3. You're now in the admin dashboard!

### 3. **Manage Users**
1. Go to "👥 Manage Users"
2. Click "Promote" to make a user an admin
3. Click "Demote" to remove admin privileges
4. Click "Delete" to remove a user

### 4. **Moderate Content**
- Visit "🎨 Manage Designs" to delete spam/inappropriate designs
- Visit "💬 Manage Feedback" to moderate user feedback
- Visit "📂 Manage Categories" to view category statistics

## Security Features

✅ **Authentication Required**: All admin routes require login  
✅ **Authorization Check**: IsAdmin middleware verifies admin role  
✅ **Self-Protection**: Cannot delete your own admin account  
✅ **Audit Trail**: Timestamps on all management actions  
✅ **User Attribution**: All actions tracked with user names  

## Database Migration

The migration file automatically adds the role column to existing users:
```bash
php artisan migrate
```

**Migration Details:**
- File: `database/migrations/2025_12_09_141455_add_role_to_users_table.php`
- Adds: `role` enum('user', 'admin') DEFAULT 'user'
- Adds: `last_admin_login` timestamp (nullable)

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Admin/
│   │       └── AdminDashboardController.php  (8 methods)
│   └── Middleware/
│       └── IsAdmin.php  (Role verification)
├── Console/
│   └── Commands/
│       └── MakeAdminCommand.php  (CLI tool)
└── Models/
    └── User.php  (Updated with role support)

resources/views/
└── admin/
    ├── dashboard.blade.php      (Admin overview)
    ├── users.blade.php          (User management)
    ├── designs.blade.php        (Design moderation)
    ├── feedback.blade.php       (Feedback management)
    └── categories.blade.php     (Category overview)

routes/
└── web.php  (Admin routes group with middleware)
```

## Testing the Admin System

1. **Create Test Admin:**
   ```bash
   php artisan make:admin testadmin@example.com
   ```

2. **Access Admin Panel:**
   - Login as `testadmin@example.com`
   - Click "🎛️ Admin Panel" in dropdown menu

3. **Manage Users:**
   - Click "👥 Manage Users"
   - Try promoting/demoting other users

4. **Moderate Content:**
   - Upload some designs as regular user
   - Go to admin panel and delete them
   - View feedback statistics

## Styling

All admin views feature:
- 🎨 Modern gradient backgrounds (purple, pink, cyan, orange)
- 📱 Fully responsive design (mobile, tablet, desktop)
- ✨ Smooth animations and hover effects
- 🎯 Intuitive card-based layout
- 📊 Beautiful data presentation

## Next Steps

Potential enhancements:
1. Analytics dashboard with charts (user growth, engagement metrics)
2. Content moderation filters (spam detection, inappropriate content)
3. Admin activity logs and audit trails
4. Bulk actions (delete multiple designs, promote multiple users)
5. Admin notifications and alerts
6. Advanced search and filtering
7. Email notifications for moderation actions
8. User statistics and reports

## Support

For questions about the admin system:
- Check the controller: `app/Http/Controllers/Admin/AdminDashboardController.php`
- Review the middleware: `app/Http/Middleware/IsAdmin.php`
- Examine the views in: `resources/views/admin/`

---

**SwipeLab Admin System v1.0** - Professional platform management features for growing design communities
