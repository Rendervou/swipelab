@extends('layouts.app')

@section('content')
<style>
    :root {
        --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --accent-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .designer-profile-container {
        padding: 2rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
    }

    .profile-header {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }

    .profile-content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .profile-sidebar {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        height: fit-content;
    }

    .profile-avatar {
        width: 100%;
        height: 200px;
        border-radius: 12px;
        background: var(--primary-gradient);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: white;
        margin-bottom: 1rem;
    }

    .profile-name {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .profile-email {
        color: #718096;
        font-size: 0.9rem;
        text-align: center;
        margin-bottom: 1.5rem;
        word-break: break-all;
    }

    .profile-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid #e2e8f0;
    }

    .stat-item {
        text-align: center;
    }

    .stat-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: #667eea;
    }

    .stat-label {
        font-size: 0.85rem;
        color: #718096;
        margin-top: 0.25rem;
    }

    .profile-actions {
        display: grid;
        gap: 0.75rem;
    }

    .btn {
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: var(--primary-gradient);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
        background: white;
        color: #667eea;
        border: 2px solid #667eea;
    }

    .btn-secondary:hover {
        background: #f7fafc;
    }

    .btn-success {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
    }

    .portfolio-section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .portfolio-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 2rem;
    }

    .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .design-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .design-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .design-image {
        width: 100%;
        height: 200px;
        background: var(--primary-gradient);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
        position: relative;
        overflow: hidden;
    }

    .design-image:hover::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
    }

    .design-content {
        padding: 1.5rem;
    }

    .design-title {
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .design-category {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
    }

    .design-stats {
        display: flex;
        justify-content: space-around;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
        font-size: 0.85rem;
    }

    .design-stat {
        text-align: center;
    }

    .design-stat-value {
        font-weight: 700;
        color: #667eea;
    }

    .design-stat-label {
        color: #718096;
        font-size: 0.75rem;
    }

    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #718096;
    }

    .empty-state-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .alert {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .alert-success {
        background: #c6f6d5;
        color: #22543d;
        border: 1px solid #9ae6b4;
    }

    .alert-error {
        background: #fed7d7;
        color: #742a2a;
        border: 1px solid #fc8181;
    }

    @media (max-width: 768px) {
        .designer-profile-container {
            padding: 1rem;
        }

        .profile-content {
            grid-template-columns: 1fr;
        }

        .profile-sidebar {
            order: 2;
        }

        .portfolio-section {
            order: 1;
        }

        .portfolio-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }

        .design-image {
            height: 150px;
        }
    }
</style>

<div class="designer-profile-container">
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if(session('error'))
        <div class="alert alert-error">{{ session('error') }}</div>
    @endif

    <!-- Profile Header -->
    <div class="profile-content">
        <!-- Sidebar -->
        <div class="profile-sidebar">
            <div class="profile-avatar">
                {{ strtoupper(substr($user->name, 0, 1)) }}
            </div>
            <div class="profile-name">{{ $user->name }}</div>
            <div class="profile-email">{{ $user->email }}</div>

            <!-- Stats -->
            <div class="profile-stats">
                <div class="stat-item">
                    <div class="stat-number">{{ $designs->count() }}</div>
                    <div class="stat-label">Designs</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ $followers_count }}</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ $following_count }}</div>
                    <div class="stat-label">Following</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ $user->getTotalPoints() }}</div>
                    <div class="stat-label">Points</div>
                </div>
            </div>

            <!-- Actions -->
            <div class="profile-actions">
                @if(auth()->check() && auth()->id() !== $user->id)
                    @if($is_following)
                        <form action="{{ route('designer.unfollow', $user) }}" method="POST">
                            @csrf
                            <button type="submit" class="btn btn-secondary" style="width: 100%;">
                                ✓ Following
                            </button>
                        </form>
                    @else
                        <form action="{{ route('designer.follow', $user) }}" method="POST">
                            @csrf
                            <button type="submit" class="btn btn-primary" style="width: 100%;">
                                + Follow Designer
                            </button>
                        </form>
                    @endif
                @elseif(auth()->check() && auth()->id() === $user->id)
                    <a href="{{ route('profile.edit') }}" class="btn btn-primary" style="width: 100%; display: block;">
                        Edit Profile
                    </a>
                @endif

                <a href="{{ route('designer.followers', $user) }}" class="btn btn-secondary" style="width: 100%; display: block;">
                    👥 {{ $followers_count }} Followers
                </a>
                <a href="{{ route('designer.following', $user) }}" class="btn btn-secondary" style="width: 100%; display: block;">
                    👤 {{ $following_count }} Following
                </a>
            </div>
        </div>

        <!-- Portfolio -->
        <div class="portfolio-section">
            <div class="portfolio-title">🎨 Design Portfolio</div>

            @if($designs->count() > 0)
                <div class="portfolio-grid">
                    @foreach($designs as $design)
                        <a href="{{ route('design.view', $design) }}" class="design-card">
                            <div class="design-image">
                                {{ substr($design->title, 0, 2) }}
                            </div>
                            <div class="design-content">
                                <div class="design-title">{{ $design->title }}</div>
                                @if($design->category)
                                    <div class="design-category">{{ $design->category->name }}</div>
                                @endif
                                <div class="design-stats">
                                    <div class="design-stat">
                                        <div class="design-stat-value">❤️ {{ $design->likes ?? 0 }}</div>
                                        <div class="design-stat-label">Likes</div>
                                    </div>
                                    <div class="design-stat">
                                        <div class="design-stat-value">💬 {{ $design->comments->count() }}</div>
                                        <div class="design-stat-label">Feedback</div>
                                    </div>
                                    <div class="design-stat">
                                        <div class="design-stat-value">👁️ {{ $design->views ?? 0 }}</div>
                                        <div class="design-stat-label">Views</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>
            @else
                <div class="empty-state">
                    <div class="empty-state-icon">🎨</div>
                    <p>No designs yet</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
