<x-app-layout>
    <x-slot name="header">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem 0; margin: -1.5rem 0 0 0;">
            <div style="max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;">
                <h2 style="font-size: 2rem; font-weight: 700; color: white; margin: 0;">
                    ✨ Welcome Back!
                </h2>
                <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0 0; font-size: 0.95rem;">
                    Keep creating amazing designs and growing your skills
                </p>
            </div>
        </div>
    </x-slot>

    <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 2rem 0; min-height: calc(100vh - 200px);">
        <style>
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            @keyframes glow {
                0%, 100% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
                50% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5); }
            }
            .stat-card {
                animation: slideUp 0.6s ease-out forwards;
                opacity: 0;
            }
            .stat-card:nth-child(1) { animation-delay: 0.1s; }
            .stat-card:nth-child(2) { animation-delay: 0.2s; }
            .stat-card:nth-child(3) { animation-delay: 0.3s; }
            .stat-card:nth-child(4) { animation-delay: 0.4s; }
            .stat-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
            }
            .badge-item {
                animation: slideUp 0.6s ease-out forwards;
                opacity: 0;
                transition: all 0.3s ease;
            }
            .badge-item:hover {
                transform: scale(1.05) rotate(2deg);
            }
            .badge-item:nth-child(1) { animation-delay: 0.5s; }
            .badge-item:nth-child(2) { animation-delay: 0.6s; }
            .badge-item:nth-child(3) { animation-delay: 0.7s; }
            .badge-item:nth-child(4) { animation-delay: 0.8s; }
            .badge-item:nth-child(5) { animation-delay: 0.9s; }
            .badge-item:nth-child(6) { animation-delay: 1s; }
            .action-btn {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .action-btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
            }
            .action-btn:active {
                transform: translateY(-2px);
            }
        </style>
        <div style="max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;">
            <!-- Stats Grid with Modern Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
                <!-- Design Upload Card -->
                <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <p style="color: rgba(255,255,255,0.8); font-size: 0.875rem; font-weight: 500; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">📤 Designs</p>
                            <p style="font-size: 2.5rem; font-weight: 700; color: white; margin: 0.5rem 0 0 0;">{{ $stats['designs_count'] ?? 0 }}</p>
                            <p style="color: rgba(255,255,255,0.7); font-size: 0.75rem; margin: 0.5rem 0 0 0;">Uploaded</p>
                        </div>
                        <div style="font-size: 2.5rem; opacity: 0.8;">📊</div>
                    </div>
                </div>

                <!-- Likes Card -->
                <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <p style="color: rgba(255,255,255,0.8); font-size: 0.875rem; font-weight: 500; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">❤️ Likes</p>
                            <p style="font-size: 2.5rem; font-weight: 700; color: white; margin: 0.5rem 0 0 0;">{{ $stats['total_likes'] ?? 0 }}</p>
                            <p style="color: rgba(255,255,255,0.7); font-size: 0.75rem; margin: 0.5rem 0 0 0;">Total love</p>
                        </div>
                        <div style="font-size: 2.5rem; opacity: 0.8;">💕</div>
                    </div>
                </div>

                <!-- Feedback Card -->
                <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <p style="color: rgba(255,255,255,0.8); font-size: 0.875rem; font-weight: 500; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">💬 Feedback</p>
                            <p style="font-size: 2.5rem; font-weight: 700; color: white; margin: 0.5rem 0 0 0;">{{ $stats['feedback_count'] ?? 0 }}</p>
                            <p style="color: rgba(255,255,255,0.7); font-size: 0.75rem; margin: 0.5rem 0 0 0;">Received</p>
                        </div>
                        <div style="font-size: 2.5rem; opacity: 0.8;">📝</div>
                    </div>
                </div>

                <!-- Points Card -->
                <div class="stat-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(250, 112, 154, 0.3); cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <p style="color: rgba(255,255,255,0.8); font-size: 0.875rem; font-weight: 500; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">⭐ Points</p>
                            <p style="font-size: 2.5rem; font-weight: 700; color: white; margin: 0.5rem 0 0 0;">{{ $stats['total_points'] ?? 0 }}</p>
                            <p style="color: rgba(255,255,255,0.7); font-size: 0.75rem; margin: 0.5rem 0 0 0;">Total earned</p>
                        </div>
                        <div style="font-size: 2.5rem; opacity: 0.8;">🏆</div>
                    </div>
                </div>
            </div>

            <!-- Level & Achievements Section -->
            <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <!-- Level Card - Modern Design -->
                <div style="background: white; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); padding: 2.5rem; overflow: hidden; position: relative;">
                    <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 50%; margin: -80px -80px 0 0;"></div>
                    <div style="position: relative; z-index: 2;">
                        <p style="color: #6b7280; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0;">🎯 Your Progress</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; align-items: center;">
                            <div>
                                <p style="font-size: 3.5rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0;">
                                    @php
                                        $levels = ['Pemula', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Maestro'];
                                        $userLevel = min(intval(($stats['total_points'] ?? 0) / 50), 5);
                                        echo $levels[$userLevel] ?? 'Pemula';
                                    @endphp
                                </p>
                                <p style="color: #6b7280; font-size: 0.875rem; margin: 0.5rem 0 0 0;">Level {{ $userLevel + 1 }}/6</p>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 3rem;">⭐</div>
                                <p style="color: #6b7280; font-size: 0.875rem; margin: 0.5rem 0 0 0;">Current Achievement</p>
                            </div>
                        </div>
                        <div style="margin-top: 2rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                                <p style="color: #6b7280; font-size: 0.875rem; margin: 0;">Progress to next level</p>
                                <p style="color: #1f2937; font-weight: 600; font-size: 0.875rem; margin: 0;">
                                    @php
                                        $currentPoints = ($stats['total_points'] ?? 0) % 50;
                                        echo $currentPoints;
                                    @endphp
                                    /50 XP
                                </p>
                            </div>
                            <div style="width: 100%; background: #e5e7eb; border-radius: 10px; height: 10px; overflow: hidden;">
                                @php
                                    $currentPoints = ($stats['total_points'] ?? 0) % 50;
                                    $progress = ($currentPoints / 50) * 100;
                                @endphp
                                <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; width: {{ $progress }}%; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Achievements Section - Pinterest Style -->
                <div style="background: white; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); padding: 2.5rem; overflow: hidden;">
                    <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin: 0 0 1.5rem 0;">🏆 Achievements Unlocked</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.25rem;">
                        <!-- Badge 1 -->
                        <div class="badge-item" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.2);">
                            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🎯</div>
                            <p style="color: white; font-weight: 600; font-size: 0.875rem; margin: 0;">Getting Started</p>
                            <p style="color: rgba(255,255,255,0.8); font-size: 0.75rem; margin: 0.5rem 0 0 0;">0 pts</p>
                        </div>
                        <!-- Badge 2 -->
                        <div class="badge-item" style="background: rgba(59, 130, 246, 0.1); border: 2px dashed #3b82f6; border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; opacity: 0.6;">
                            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; filter: grayscale(100%);">🌟</div>
                            <p style="color: #6b7280; font-weight: 600; font-size: 0.875rem; margin: 0;">Rising Star</p>
                            <p style="color: #9ca3af; font-size: 0.75rem; margin: 0.5rem 0 0 0;">50 pts</p>
                        </div>
                        <!-- Badge 3 -->
                        <div class="badge-item" style="background: rgba(59, 130, 246, 0.1); border: 2px dashed #3b82f6; border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; opacity: 0.6;">
                            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; filter: grayscale(100%);">🔥</div>
                            <p style="color: #6b7280; font-weight: 600; font-size: 0.875rem; margin: 0;">Designer Pro</p>
                            <p style="color: #9ca3af; font-size: 0.75rem; margin: 0.5rem 0 0 0;">200 pts</p>
                        </div>
                        <!-- Badge 4 -->
                        <div class="badge-item" style="background: rgba(59, 130, 246, 0.1); border: 2px dashed #3b82f6; border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; opacity: 0.6;">
                            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; filter: grayscale(100%);">👑</div>
                            <p style="color: #6b7280; font-weight: 600; font-size: 0.875rem; margin: 0;">Master Critic</p>
                            <p style="color: #9ca3af; font-size: 0.75rem; margin: 0.5rem 0 0 0;">500 pts</p>
                        </div>
                        <!-- Badge 5 -->
                        <div class="badge-item" style="background: rgba(59, 130, 246, 0.1); border: 2px dashed #3b82f6; border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; opacity: 0.6;">
                            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; filter: grayscale(100%);">💎</div>
                            <p style="color: #6b7280; font-weight: 600; font-size: 0.875rem; margin: 0;">Innovation Leader</p>
                            <p style="color: #9ca3af; font-size: 0.75rem; margin: 0.5rem 0 0 0;">1000 pts</p>
                        </div>
                        <!-- Badge 6 -->
                        <div class="badge-item" style="background: rgba(59, 130, 246, 0.1); border: 2px dashed #3b82f6; border-radius: 16px; padding: 1.5rem; text-align: center; cursor: pointer; opacity: 0.6;">
                            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; filter: grayscale(100%);">🚀</div>
                            <p style="color: #6b7280; font-weight: 600; font-size: 0.875rem; margin: 0;">Legend</p>
                            <p style="color: #9ca3af; font-size: 0.75rem; margin: 0.5rem 0 0 0;">2000 pts</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA Action Buttons - Modern Design -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <a href="/designs/create" class="action-btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.25rem; border-radius: 16px; font-weight: 600; text-align: center; text-decoration: none; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1rem;">
                    <span>📤</span> Upload Design
                </a>
                <a href="/swipe" class="action-btn" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.25rem; border-radius: 16px; font-weight: 600; text-align: center; text-decoration: none; box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1rem;">
                    <span>👆</span> Start Swiping
                </a>
                <a href="/categories" class="action-btn" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.25rem; border-radius: 16px; font-weight: 600; text-align: center; text-decoration: none; box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1rem;">
                    <span>🏷️</span> Explore Categories
                </a>
            </div>

            <!-- Recent Designs Section - Pinterest Card Style -->
            <div style="background: white; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); padding: 2.5rem; overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin: 0;">📸 My Recent Designs</h3>
                    <a href="/designs/create" style="color: #667eea; text-decoration: none; font-weight: 600; font-size: 0.875rem; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(102, 126, 234, 0.1); transition: all 0.3s ease;">
                        View All →
                    </a>
                </div>
                <div style="text-align: center; padding: 3rem 1.5rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.6;">🎨</div>
                    <p style="color: #6b7280; font-size: 1.125rem; font-weight: 500; margin: 0;">No designs yet</p>
                    <p style="color: #9ca3af; font-size: 0.875rem; margin: 0.5rem 0 0 0;">Start by uploading your first design to showcase your work</p>
                    <a href="/designs/create" style="display: inline-block; margin-top: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.875rem; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                        Create Your First Design
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
