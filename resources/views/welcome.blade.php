<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>SwipeLab - Crowdsourced Design Feedback Platform</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600,700&display=swap" rel="stylesheet" />

        <!-- Styles -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            .hero-title {
                animation: fadeInUp 0.8s ease-out;
            }
            .feature-card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .feature-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <!-- Navigation -->
        <nav class="bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-2">
                        <span class="text-3xl">🔄</span>
                        <span class="text-2xl font-bold text-white">SwipeLab</span>
                    </div>
                    <div class="hidden sm:flex space-x-4">
                        @auth
                            <a href="{{ url('/dashboard') }}" class="px-4 py-2 text-white hover:bg-purple-700 rounded-md transition font-medium">Dashboard</a>
                            <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                                @csrf
                                <button type="submit" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition font-medium">Logout</button>
                            </form>
                        @else
                            <a href="{{ route('login') }}" class="px-4 py-2 text-white hover:bg-purple-700 rounded-md transition font-medium">Login</a>
                            @if (Route::has('register'))
                                <a href="{{ route('register') }}" class="px-4 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-md transition font-medium">Register</a>
                            @endif
                        @endauth
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-white py-20 sm:py-32">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div class="space-y-6 hero-title">
                        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                            Create. Share. Grow.
                        </h1>
                        <p class="text-xl text-blue-100 leading-relaxed">
                            SwipeLab adalah platform terpadu untuk designer dan UI/UX enthusiast. Bagikan karya Anda, dapatkan feedback berkualitas, dan raih prestasi bersama komunitas global.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 pt-4">
                            @auth
                                <a href="{{ url('/dashboard') }}" class="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition inline-block text-center">
                                    Go to Dashboard →
                                </a>
                            @else
                                <a href="{{ route('register') }}" class="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition inline-block text-center">
                                    Start for Free →
                                </a>
                                <a href="{{ route('login') }}" class="px-8 py-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-400 transition inline-block text-center border-2 border-white">
                                    Sign In
                                </a>
                            @endauth
                        </div>
                    </div>
                    <div class="hidden md:flex justify-center">
                        <div style="font-size: 8rem; animation: pulse 2s ease-in-out infinite;">🎨</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section with Modern Card Design -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose SwipeLab?</h2>
                    <p class="text-xl text-gray-600">Everything you need to grow as a designer</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="feature-card" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 2rem; border-radius: 16px; color: white; box-shadow: 0 8px 20px rgba(109, 40, 217, 0.12);">
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
