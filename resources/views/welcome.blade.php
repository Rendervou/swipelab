<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SwipeLab - Get Real Feedback, Level Up Your Designs</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Figtree', sans-serif;
            background: linear-gradient(135deg, #0a1428 0%, #1a1f3a 50%, #0f1629 100%);
            color: #e0e0e0;
            min-height: 100vh;
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 80px;
            height: 100vh;
            background: rgba(15, 22, 41, 0.8);
            border-right: 1px solid rgba(91, 124, 255, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
            gap: 20px;
            z-index: 100;
        }

        .sidebar-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            font-size: 20px;
        }

        .sidebar-icon:hover {
            background: rgba(91, 124, 255, 0.1);
            border-color: rgba(91, 124, 255, 0.3);
        }

        .sidebar-icon.active {
            background: #5B7CFF;
            border-color: #5B7CFF;
            color: white;
        }

        .logo-icon {
            background: #6366f1;
            color: white;
            font-weight: 700;
            font-size: 24px;
        }

        .main-content {
            margin-left: 80px;
            padding: 40px;
            max-width: 100%;
        }

        .badge {
            display: inline-block;
            background: rgba(91, 124, 255, 0.2);
            border: 1px solid rgba(91, 124, 255, 0.5);
            padding: 6px 14px;
            border-radius: 20px;
            color: #93c5ff;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .hero-title {
            font-size: 56px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
            color: white;
        }

        .hero-title .highlight {
            color: #5B7CFF;
        }

        .hero-subtitle {
            font-size: 16px;
            color: #9ca3af;
            margin-bottom: 30px;
            line-height: 1.6;
            max-width: 600px;
        }

        .stats-group {
            display: flex;
            gap: 40px;
            margin-bottom: 30px;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
        }

        .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .buttons-group {
            display: flex;
            gap: 15px;
            margin-bottom: 40px;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        }

        .btn-primary {
            background: #5B7CFF;
            color: white;
        }

        .btn-primary:hover {
            background: #4a67ff;
            box-shadow: 0 0 20px rgba(91, 124, 255, 0.3);
        }

        .btn-secondary {
            background: rgba(91, 124, 255, 0.1);
            color: white;
            border: 1px solid rgba(91, 124, 255, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(91, 124, 255, 0.2);
        }

        .hero-container {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 40px;
            align-items: start;
        }

        .level-card {
            background: rgba(91, 124, 255, 0.1);
            border: 1px solid rgba(91, 124, 255, 0.3);
            border-radius: 16px;
            padding: 20px;
            color: white;
        }

        .level-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            font-size: 20px;
        }

        .level-number {
            background: #5B7CFF;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }

        .level-title {
            font-size: 14px;
            font-weight: 600;
        }

        .xp-text {
            font-size: 12px;
            color: #fbbf24;
        }

        .progress-bar {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            height: 8px;
            margin-bottom: 10px;
            overflow: hidden;
        }

        .progress-fill {
            background: linear-gradient(90deg, #5B7CFF, #8b5cf6);
            height: 100%;
            width: 50%;
        }

        .progress-text {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 15px;
        }

        .streak {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #9ca3af;
        }

        .streak-fire {
            font-size: 18px;
        }

        .section-title {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
            margin-top: 40px;
        }

        .section-subtitle {
            color: #9ca3af;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .featured-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .view-all {
            color: #5B7CFF;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .designs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .design-card {
            background: rgba(26, 31, 58, 0.8);
            border: 1px solid rgba(91, 124, 255, 0.2);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .design-card:hover {
            border-color: rgba(91, 124, 255, 0.5);
            box-shadow: 0 0 20px rgba(91, 124, 255, 0.1);
        }

        .design-image {
            width: 100%;
            height: 180px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            position: relative;
            overflow: hidden;
        }

        .design-image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            background: rgba(91, 124, 255, 0.05);
        }

        .featured-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #5B7CFF;
            color: white;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
        }

        .design-info {
            padding: 16px;
        }

        .design-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
            margin-bottom: 8px;
        }

        .design-designer {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #9ca3af;
        }

        .designer-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #5B7CFF;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: 600;
        }

        .design-tag {
            display: inline-block;
            background: rgba(91, 124, 255, 0.1);
            color: #93c5ff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            margin-top: 8px;
        }

        .reviewers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .reviewer-card {
            text-align: center;
        }

        .reviewer-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #5B7CFF;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: 600;
            margin: 0 auto 12px;
            position: relative;
        }

        .reviewer-badge {
            position: absolute;
            bottom: 0;
            right: 0;
            background: #fbbf24;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
        }

        .reviewer-name {
            font-size: 14px;
            font-weight: 600;
            color: white;
            margin-bottom: 4px;
        }

        .reviewer-xp {
            font-size: 12px;
            color: #fbbf24;
        }

        .reviewer-level {
            font-size: 11px;
            color: #9ca3af;
        }

        .cta-section {
            background: linear-gradient(135deg, #5B7CFF 0%, #8b5cf6 100%);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            margin-bottom: 40px;
        }

        .cta-title {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
        }

        .cta-subtitle {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 25px;
        }

        .cta-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .cta-buttons .btn {
            padding: 12px 28px;
        }

        .btn-cta-primary {
            background: white;
            color: #5B7CFF;
        }

        .btn-cta-primary:hover {
            background: rgba(255, 255, 255, 0.9);
        }

        .btn-cta-secondary {
            background: rgba(0, 0, 0, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cta-secondary:hover {
            background: rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
            .hero-container {
                grid-template-columns: 1fr;
            }

            .main-content {
                padding: 20px;
                margin-left: 60px;
            }

            .sidebar {
                width: 60px;
            }

            .sidebar-icon {
                width: 40px;
                height: 40px;
                font-size: 16px;
            }

            .hero-title {
                font-size: 36px;
            }

            .designs-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }

            .stats-group {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
    <body>
    <!-- Sidebar Navigation -->
    <div class="sidebar">
        <a href="{{ route('home') }}" class="sidebar-icon logo-icon" title="SwipeLab">S</a>
        <a href="{{ route('home') }}" class="sidebar-icon active" title="Home">🏠</a>
        <a href="#" class="sidebar-icon" title="Explore">🔍</a>
        <a href="#" class="sidebar-icon" title="Swipe">👆</a>
        <a href="#" class="sidebar-icon" title="Trending">🔥</a>
        <a href="@auth{{ route('designs.create') }}@else{{ route('register') }}@endauth" class="sidebar-icon" title="Upload">📤</a>
        <a href="#" class="sidebar-icon" title="Leaderboard">🏆</a>
        <a href="#" class="sidebar-icon" title="Notifications">🔔</a>
        <a href="#" class="sidebar-icon" title="Messages">💬</a>
        <a href="@auth{{ route('profile.edit') }}@else{{ route('login') }}@endauth" class="sidebar-icon" title="Settings">⚙️</a>
        <a href="@auth{{ route('profile.edit') }}@else{{ route('login') }}@endauth" class="sidebar-icon" title="Profile">👤</a>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Hero Section -->
        <div class="hero-container">
            <div>
                <div class="badge">🎯 Crowdsourced Design Feedback</div>
                <h1 class="hero-title">Get Real Feedback, <span class="highlight">Level Up Your Designs</span></h1>
                <p class="hero-subtitle">
                    Join thousands of designers getting structured feedback. Swipe, review, and help the community improve together.
                </p>

                <div class="stats-group">
                    <div class="stat-item">
                        <div class="stat-number">{{ number_format($stats['total_designs']) }}+</div>
                        <div class="stat-label">Designs</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">{{ number_format($stats['total_feedbacks']) }}+</div>
                        <div class="stat-label">Reviews</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">{{ number_format($stats['total_designers']) }}+</div>
                        <div class="stat-label">Designers</div>
                    </div>
                </div>

                <div class="buttons-group">
                    @auth
                        <a href="{{ route('swipe') }}" class="btn btn-primary">⚡ Start Swiping</a>
                        <a href="{{ route('designs.create') }}" class="btn btn-secondary">📤 Upload Design</a>
                    @else
                        <a href="{{ route('register') }}" class="btn btn-primary">⚡ Start Swiping</a>
                        <a href="{{ route('register') }}" class="btn btn-secondary">📤 Upload Design</a>
                    @endauth
                </div>
            </div>

            <!-- Level Card -->
            @if ($currentUser)
                <div class="level-card">
                    <div class="level-header">
                        <div class="level-number">{{ $currentUser['level'] }}</div>
                        <div>
                            <div class="level-title">Level {{ $currentUser['level'] }}</div>
                        </div>
                    </div>
                    <div class="xp-text">💠 {{ $currentUser['xp'] }} XP</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {{ ($currentUser['xp'] % 100) }}%;"></div>
                    </div>
                    <div class="progress-text">{{ $currentUser['xp'] % 100 }}/100 XP to next level</div>
                    <div class="streak">
                        <span class="streak-fire">🔥</span>
                        <span>0 days streak</span>
                    </div>
                </div>
            @else
                <div class="level-card">
                    <div style="text-align: center; padding: 20px 0;">
                        <div style="font-size: 40px; margin-bottom: 15px;">⭐</div>
                        <h3 style="color: white; margin-bottom: 10px;">Join the Community</h3>
                        <p style="color: #9ca3af; font-size: 13px; margin-bottom: 15px;">Sign up to track your progress and earn badges</p>
                        <a href="{{ route('register') }}" class="btn btn-primary" style="width: 100%; justify-content: center;">Get Started</a>
                    </div>
                </div>
            @endif
        </div>

        <!-- Featured Designs Section -->
        @if (count($featuredDesigns) > 0)
        <div>
            <div class="featured-header">
                <div>
                    <h2 class="section-title">🎨 Featured Designs</h2>
                    <p class="section-subtitle">Hand-picked by community</p>
                </div>
                <a href="#" class="view-all">View all →</a>
            </div>

            <div class="designs-grid">
                @foreach ($featuredDesigns as $design)
                <a href="{{ $design['view_url'] }}" style="text-decoration: none;">
                    <div class="design-card">
                        <div class="design-image">
                            @if ($design['image_url'])
                                <img src="{{ $design['image_url'] }}" alt="{{ $design['title'] }}" style="width: 100%; height: 100%; object-fit: cover;">
                            @else
                                <div class="design-image-placeholder">🎨</div>
                            @endif
                            @if ($design['is_featured'])
                                <div class="featured-badge">Featured</div>
                            @endif
                        </div>
                        <div class="design-info">
                            <div class="design-title">{{ $design['title'] }}</div>
                            <div class="design-designer">
                                <div class="designer-avatar">{{ $design['designer']['initials'] }}</div>
                                <span>{{ $design['designer']['name'] }}</span>
                            </div>
                            <div class="design-tag">{{ $design['category'] }}</div>
                        </div>
                    </div>
                </a>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Recent Uploads Section -->
        <div>
            <div class="featured-header">
                <div>
                    <h2 class="section-title">📤 Recent Uploads</h2>
                    <p class="section-subtitle">Fresh designs waiting for feedback</p>
                </div>
                <a href="#" class="view-all">View all →</a>
            </div>

            <div class="designs-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
                @foreach ($recentDesigns as $design)
                <a href="{{ $design['view_url'] }}" style="text-decoration: none;">
                    <div class="design-card">
                        <div class="design-image">
                            @if ($design['image_url'])
                                <img src="{{ $design['image_url'] }}" alt="{{ $design['title'] }}" style="width: 100%; height: 100%; object-fit: cover;">
                            @else
                                <div class="design-image-placeholder">🎨</div>
                            @endif
                        </div>
                        <div class="design-info">
                            <div class="design-title">{{ $design['title'] }}</div>
                            <div class="design-designer">
                                <div class="designer-avatar">{{ $design['designer']['initials'] }}</div>
                                <span>{{ $design['designer']['name'] }}</span>
                            </div>
                            <div class="design-tag">{{ $design['category'] }}</div>
                        </div>
                    </div>
                </a>
                @endforeach
            </div>
        </div>

        <!-- Top Reviewers Section -->
        @if (count($topReviewers) > 0)
        <div>
            <div class="featured-header">
                <div>
                    <h2 class="section-title">🏆 Top Reviewers</h2>
                    <p class="section-subtitle">Most active critics this week</p>
                </div>
                <a href="#" class="view-all">View all →</a>
            </div>

            <div class="reviewers-grid">
                @foreach ($topReviewers as $index => $reviewer)
                <a href="{{ $reviewer['profile_url'] }}" style="text-decoration: none;">
                    <div class="reviewer-card">
                        <div class="reviewer-avatar">
                            {{ $reviewer['initials'] }}
                            @if ($index < 3)
                                <div class="reviewer-badge">{{ $index + 1 }}</div>
                            @endif
                        </div>
                        <div class="reviewer-name">{{ $reviewer['name'] }}</div>
                        <div class="reviewer-xp">🔥 {{ number_format($reviewer['xp']) }} XP</div>
                        <div class="reviewer-level">Level {{ $reviewer['level'] }}</div>
                    </div>
                </a>
                @endforeach
            </div>
        </div>
        @endif

        <!-- CTA Section -->
        <div class="cta-section">
            <h2 class="cta-title">Ready to get feedback on your designs?</h2>
            <p class="cta-subtitle">Upload your work and get structured critiques from real designers</p>
            <div class="cta-buttons">
                @auth
                    <a href="{{ route('designs.create') }}" class="btn btn-cta-primary">📤 Upload Now</a>
                    <a href="#explore" class="btn btn-cta-secondary">🔍 Explore Designs</a>
                @else
                    <a href="{{ route('register') }}" class="btn btn-cta-primary">📤 Upload Now</a>
                    <a href="{{ route('register') }}" class="btn btn-cta-secondary">🔍 Explore Designs</a>
                @endauth
            </div>
        </div>

        <!-- Footer -->
        <footer style="border-top: 1px solid rgba(91, 124, 255, 0.1); padding: 40px 0; color: #9ca3af;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h3 style="color: white; font-size: 20px; font-weight: 700; margin-bottom: 8px;">🔄 SwipeLab</h3>
                    <p style="font-size: 14px;">Platform Crowdsourced Feedback Desain & UI/UX</p>
                </div>
            </div>
            <div style="border-top: 1px solid rgba(91, 124, 255, 0.1); padding-top: 20px; text-align: center; font-size: 12px;">
                <p>&copy; {{ date('Y') }} SwipeLab. All rights reserved.</p>
            </div>
        </footer>
    </div>

    </body>
</html>
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🎨</div>
                        <h3 class="text-xl font-bold mb-3">Easy Upload</h3>
                        <p style="color: rgba(255,255,255,0.9);">
                            Unggah desain Anda dalam hitungan detik. Support JPG, PNG, dan format populer lainnya hingga 10MB.
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="feature-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 2rem; border-radius: 16px; color: white; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.12);">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">✨</div>
                        <h3 class="text-xl font-bold mb-3">Swipe & Feedback</h3>
                        <p style="color: rgba(255,255,255,0.9);">
                            Lihat ribuan karya desainer lain, berikan rating, dan dapatkan feedback konstruktif.
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="feature-card" style="background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%); padding: 2rem; border-radius: 16px; color: white; box-shadow: 0 8px 20px rgba(167, 139, 250, 0.12);">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏆</div>
                        <h3 class="text-xl font-bold mb-3">Gamification System</h3>
                        <p style="color: rgba(255,255,255,0.9);">
                            Kumpulkan poin, raih lencana, dan naik level sambil berkembang sebagai designer.
                        </p>
                    </div>

                    <!-- Feature 4 -->
                    <div class="feature-card" style="background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%); padding: 2rem; border-radius: 16px; color: white; box-shadow: 0 8px 20px rgba(217, 70, 239, 0.08);">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🌟</div>
                        <h3 class="text-xl font-bold mb-3">6 Achievement Levels</h3>
                        <p style="color: rgba(255,255,255,0.95);">
                            Dari Pemula hingga Maestro. Setiap level membuka fitur dan pengakuan baru.
                        </p>
                    </div>

                    <!-- Feature 5 -->
                    <div class="feature-card" style="background: linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%); padding: 2rem; border-radius: 16px; color: #1f2937; box-shadow: 0 8px 20px rgba(180, 150, 250, 0.08);">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🤝</div>
                        <h3 class="text-xl font-bold mb-3">Community</h3>
                        <p style="color: #4b5563;">
                            Bergabung dengan ribuan designer berbakat dan komunitas yang supportif.
                        </p>
                    </div>

                    <!-- Feature 6 -->
                    <div class="feature-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); padding: 2rem; border-radius: 16px; color: white; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.12);">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">📊</div>
                        <h3 class="text-xl font-bold mb-3">Analytics Dashboard</h3>
                        <p style="color: rgba(255,255,255,0.95);">
                            Tracking performa desain Anda dengan statistik real-time dan insights.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p class="text-xl text-gray-600">Simple steps to start growing as a designer</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">1</div>
                        <h3 class="font-bold text-lg mb-2">Create Account</h3>
                        <p class="text-gray-600">Sign up free dengan email Anda dalam 30 detik</p>
                    </div>
                    <div class="text-center">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">2</div>
                        <h3 class="font-bold text-lg mb-2">Upload Design</h3>
                        <p class="text-gray-600">Bagikan karya Anda dan tunggu feedback dari komunitas</p>
                    </div>
                    <div class="text-center">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">3</div>
                        <h3 class="font-bold text-lg mb-2">Review Others</h3>
                        <p class="text-gray-600">Swipe dan berikan feedback pada desain orang lain</p>
                    </div>
                    <div class="text-center">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #c4b5fd 0%, #f0abfc 100%); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">4</div>
                        <h3 class="font-bold text-lg mb-2">Level Up</h3>
                        <p class="text-gray-600">Raih poin, badge, dan naik ke level berikutnya</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 3rem 0;">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="text-5xl font-bold mb-2">100+</div>
                        <p class="text-lg opacity-90">Designs Shared</p>
                    </div>
                    <div>
                        <div class="text-5xl font-bold mb-2">50+</div>
                        <p class="text-lg opacity-90">Active Members</p>
                    </div>
                    <div>
                        <div class="text-5xl font-bold mb-2">1000+</div>
                        <p class="text-lg opacity-90">Feedbacks Given</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-4xl font-bold text-gray-900 mb-6">Ready to Level Up Your Design Skills?</h2>
                <p class="text-xl text-gray-600 mb-10">
                    Join thousands of designers and get valuable feedback on your work today.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    @auth
                        <a href="{{ url('/dashboard') }}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem 2rem; border-radius: 12px; color: white; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);">
                            Go to Dashboard →
                        </a>
                    @else
                        <a href="{{ route('register') }}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem 2rem; border-radius: 12px; color: white; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);">
                            Get Started Free →
                        </a>
                        <a href="{{ route('login') }}" class="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg border-2 border-blue-600 hover:bg-gray-50 transition inline-block">
                            Already have an account? Sign In
                        </a>
                    @endauth
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-gray-400 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <div class="flex items-center justify-center space-x-2 mb-4">
                        <span class="text-3xl">🔄</span>
                        <span class="text-xl font-bold text-white">SwipeLab</span>
                    </div>
                    <p class="mb-6">Platform Crowdsourced Feedback Desain & UI/UX</p>
                    <p class="text-sm">&copy; 2024 SwipeLab. Semua hak cipta dilindungi.</p>
                </div>
            </div>
        </footer>
    </body>
</html>
