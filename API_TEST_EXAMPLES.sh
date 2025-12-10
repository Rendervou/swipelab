#!/bin/bash

# SwipeLab API Testing Script
# Complete examples untuk testing semua API endpoints

BASE_URL="http://localhost:8000"
TOKEN=""  # Will be set after login

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================"
echo "SwipeLab API Testing Script"
echo "================================${NC}\n"

# ==================== AUTHENTICATION ====================
echo -e "${YELLOW}1. AUTHENTICATION ENDPOINTS${NC}"

# Register
echo -e "${GREEN}[POST] Register New User${NC}"
curl -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Designer",
    "email": "designer@test.com",
    "password": "password123",
    "password_confirmation": "password123"
  }' \
  -c cookies.txt

echo -e "\n"

# Login
echo -e "${GREEN}[POST] Login${NC}"
curl -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "designer@test.com",
    "password": "password123"
  }' \
  -c cookies.txt -b cookies.txt

# Get User (requires auth)
echo -e "${GREEN}[GET] Get Current User${NC}"
curl -X GET "${BASE_URL}/api/user" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -b cookies.txt

echo -e "\n"

# ==================== CATEGORIES ====================
echo -e "${YELLOW}2. CATEGORY ENDPOINTS${NC}"

# Get All Categories
echo -e "${GREEN}[GET] Get All Categories (Public)${NC}"
curl -X GET "${BASE_URL}/api/categories"

echo -e "\n"

# Get Specific Category
echo -e "${GREEN}[GET] Get Category by ID${NC}"
curl -X GET "${BASE_URL}/api/categories/1"

echo -e "\n"

# Create Category (requires auth)
echo -e "${GREEN}[POST] Create New Category${NC}"
curl -X POST "${BASE_URL}/api/categories" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Photography",
    "slug": "photography",
    "description": "Professional photography and photo editing"
  }'

echo -e "\n"

# Update Category
echo -e "${GREEN}[PUT] Update Category${NC}"
curl -X PUT "${BASE_URL}/api/categories/7" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Photography",
    "slug": "photography",
    "description": "Updated description"
  }'

echo -e "\n"

# Delete Category
echo -e "${GREEN}[DELETE] Delete Category${NC}"
curl -X DELETE "${BASE_URL}/api/categories/7" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# ==================== DESIGNS ====================
echo -e "${YELLOW}3. DESIGN ENDPOINTS${NC}"

# Get My Designs
echo -e "${GREEN}[GET] Get My Designs${NC}"
curl -X GET "${BASE_URL}/api/designs/my" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Get Specific Design
echo -e "${GREEN}[GET] Get Design by ID${NC}"
curl -X GET "${BASE_URL}/api/designs/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Upload Design (requires actual image file)
echo -e "${GREEN}[POST] Upload Design${NC}"
echo "Note: Replace 'design.jpg' with actual image file path"
curl -X POST "${BASE_URL}/api/designs" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Modern UI Dashboard" \
  -F "description=A beautiful dashboard design for SaaS applications" \
  -F "category_id=1" \
  -F "image=@design.jpg"

echo -e "\n"

# Update Design
echo -e "${GREEN}[PUT] Update Design${NC}"
curl -X PUT "${BASE_URL}/api/designs/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Design Title",
    "description": "Updated description",
    "category_id": 1
  }'

echo -e "\n"

# Delete Design
echo -e "${GREEN}[DELETE] Delete Design${NC}"
curl -X DELETE "${BASE_URL}/api/designs/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# ==================== SWIPE SYSTEM ====================
echo -e "${YELLOW}4. SWIPE SYSTEM${NC}"

# Get Random Design
echo -e "${GREEN}[GET] Get Random Design to Swipe${NC}"
curl -X GET "${BASE_URL}/api/swipe/random" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Get Random Design with Category Filter
echo -e "${GREEN}[GET] Get Random Design (with category filter)${NC}"
curl -X GET "${BASE_URL}/api/swipe/random?category_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Swipe Left (Dislike)
echo -e "${GREEN}[POST] Swipe Left (Dislike)${NC}"
curl -X POST "${BASE_URL}/api/swipe/left" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": 2
  }'

echo -e "\n"

# Swipe Right (Like)
echo -e "${GREEN}[POST] Swipe Right (Like)${NC}"
curl -X POST "${BASE_URL}/api/swipe/right" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": 2
  }'

echo -e "\n"

# Get Swipe History
echo -e "${GREEN}[GET] Get Swipe History${NC}"
curl -X GET "${BASE_URL}/api/swipe/history" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# ==================== FEEDBACK ====================
echo -e "${YELLOW}5. FEEDBACK SYSTEM${NC}"

# Get Feedback for Design
echo -e "${GREEN}[GET] Get Feedback for Design${NC}"
curl -X GET "${BASE_URL}/api/designs/1/feedback" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Get My Feedback Received
echo -e "${GREEN}[GET] Get My Feedback Received${NC}"
curl -X GET "${BASE_URL}/api/feedback/received" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Get My Feedback Given
echo -e "${GREEN}[GET] Get My Feedback Given${NC}"
curl -X GET "${BASE_URL}/api/feedback/given" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Submit Feedback
echo -e "${GREEN}[POST] Submit Feedback${NC}"
curl -X POST "${BASE_URL}/api/feedback" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "design_id": 1,
    "comment": "Excellent design! The color palette is beautiful and the layout is very intuitive. Great work!",
    "rating": 5
  }'

echo -e "\n"

# Update Feedback
echo -e "${GREEN}[PUT] Update Feedback${NC}"
curl -X PUT "${BASE_URL}/api/feedback/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Updated feedback comment",
    "rating": 4
  }'

echo -e "\n"

# Delete Feedback
echo -e "${GREEN}[DELETE] Delete Feedback${NC}"
curl -X DELETE "${BASE_URL}/api/feedback/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# ==================== DASHBOARD ====================
echo -e "${YELLOW}6. DASHBOARD & PROFILE${NC}"

# Get Dashboard Stats
echo -e "${GREEN}[GET] Get Dashboard Stats${NC}"
curl -X GET "${BASE_URL}/api/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# Get Public Profile
echo -e "${GREEN}[GET] Get Public User Profile${NC}"
curl -X GET "${BASE_URL}/api/profile/john_doe" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n"

# ==================== USAGE INSTRUCTIONS ====================
echo -e "${BLUE}================================"
echo "TESTING INSTRUCTIONS"
echo "================================${NC}"
echo ""
echo "1. Replace 'YOUR_TOKEN_HERE' with actual Bearer token from login"
echo "2. Replace 'design.jpg' with actual image file path for upload"
echo "3. Replace design IDs (1, 2, etc) with actual IDs from your database"
echo "4. Replace 'john_doe' with actual username for profile endpoint"
echo ""
echo "Example Token Usage:"
echo "  - Login first to get token"
echo "  - Use token in header: Authorization: Bearer {token}"
echo ""
echo "Postman Import:"
echo "  - Import POSTMAN_COLLECTION.json to Postman"
echo "  - Set {{base_url}} variable to http://localhost:8000"
echo "  - Use Bearer token from login in Auth tab"
echo ""
echo -e "${BLUE}================================${NC}"

# Cleanup
rm -f cookies.txt
