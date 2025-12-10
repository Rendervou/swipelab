@extends('layouts.app')

@section('content')
<style>
    :root {
        --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --success-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .admin-container {
        padding: 2rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
    }

    .admin-header {
        margin-bottom: 3rem;
    }

    .admin-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
    }

    .admin-subtitle {
        color: #718096;
        font-size: 1.1rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .stat-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--primary-gradient);
    }

    .stat-card:nth-child(2)::before {
        background: var(--success-gradient);
    }

    .stat-card:nth-child(3)::before {
        background: var(--info-gradient);
    }

    .stat-card:nth-child(4)::before {
        background: var(--warning-gradient);
    }

    .stat-card:nth-child(5)::before {
        background: var(--primary-gradient);
    }

    .stat-card:nth-child(6)::before {
        background: var(--success-gradient);
    }

    .stat-card:nth-child(7)::before {
        background: var(--info-gradient);
    }

    .stat-card:nth-child(8)::before {
        background: var(--warning-gradient);
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        color: #718096;
        font-size: 0.95rem;
        font-weight: 500;
    }

    .section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table th {
        background: #f7fafc;
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #2d3748;
        border-bottom: 2px solid #e2e8f0;
    }

    .table td {
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .table tbody tr:hover {
        background: #f7fafc;
    }

    .badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .badge-user {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .badge-admin {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }

    .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 600;
        transition: all 0.3s ease;
        text-decoration: none;
    }

    .btn-primary {
        background: var(--primary-gradient);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-danger {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        font-size: 0.85rem;
        padding: 0.5rem 1rem;
    }

    .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(245, 87, 108, 0.4);
    }

    .btn-view-all {
        display: inline-block;
        margin-top: 1.5rem;
        background: var(--primary-gradient);
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-view-all:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-gradient);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
    }

    .design-thumbnail {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        object-fit: cover;
        background: #e2e8f0;
    }

    .activity-item {
        display: flex;
        gap: 1rem;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .activity-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
    }

    .activity-content {
        flex: 1;
    }

    .activity-title {
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 0.25rem;
    }

    .activity-meta {
        font-size: 0.85rem;
        color: #718096;
    }

    .grid-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        .admin-container {
            padding: 1rem;
        }

        .admin-title {
            font-size: 1.8rem;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .grid-2 {
            grid-template-columns: 1fr;
        }

        .table {
            font-size: 0.9rem;
        }

        .table th, .table td {
            padding: 0.75rem 0.5rem;
        }
    }
</style>

<div class="admin-container">
    <div class="admin-header">
        <h1 class="admin-title">🎛️ Admin Dashboard</h1>
        <p class="admin-subtitle">Welcome to the SwipeLab administration panel</p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-number">{{ $stats['total_users'] }}</div>
            <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $stats['total_admins'] }}</div>
            <div class="stat-label">Admin Users</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $stats['total_regular_users'] }}</div>
            <div class="stat-label">Regular Users</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $stats['total_designs'] }}</div>
            <div class="stat-label">Total Designs</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $stats['total_feedback'] }}</div>
            <div class="stat-label">Total Feedback</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $stats['total_likes'] }}</div>
            <div class="stat-label">Total Likes</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{{ $stats['total_views'] }}</div>
            <div class="stat-label">Total Views</div>
        </div>
    </div>

    <!-- Recent Activity & Top Content -->
    <div class="grid-2">
        <!-- Recent Users -->
        <div class="section">
            <h2 class="section-title">👥 Recent Users</h2>
            @if($recentUsers->count() > 0)
                <div>
                    @foreach($recentUsers as $user)
                        <div class="activity-item">
                            <div class="avatar">
                                {{ strtoupper(substr($user->name, 0, 1)) }}
                            </div>
                            <div class="activity-content" style="flex: 1;">
                                <div class="activity-title">{{ $user->name }}</div>
                                <div class="activity-meta">{{ $user->email }}</div>
                                <div class="activity-meta" style="margin-top: 0.25rem;">
                                    <span class="badge {{ $user->isAdmin() ? 'badge-admin' : 'badge-user' }}">
                                        {{ ucfirst($user->role) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
                <a href="{{ route('admin.users') }}" class="btn-view-all">View All Users →</a>
            @else
                <p style="color: #718096; text-align: center; padding: 2rem;">No users yet</p>
            @endif
        </div>

        <!-- Top Designs -->
        <div class="section">
            <h2 class="section-title">⭐ Top Designs</h2>
            @if($topDesigns->count() > 0)
                <div>
                    @foreach($topDesigns as $design)
                        <div class="activity-item">
                            <div style="width: 50px; height: 50px; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                                {{ substr($design->title, 0, 2) }}
                            </div>
                            <div class="activity-content" style="flex: 1;">
                                <div class="activity-title">{{ substr($design->title, 0, 30) }}</div>
                                <div class="activity-meta">by {{ $design->user->name }}</div>
                                <div class="activity-meta" style="margin-top: 0.25rem;">
                                    ❤️ {{ $design->likes }} likes • 👁️ {{ $design->views }} views
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
                <a href="{{ route('admin.designs') }}" class="btn-view-all">View All Designs →</a>
            @else
                <p style="color: #718096; text-align: center; padding: 2rem;">No designs yet</p>
            @endif
        </div>
    </div>

    <!-- Recent Designs -->
    <div class="section">
        <h2 class="section-title">🎨 Recent Designs</h2>
        @if($recentDesigns->count() > 0)
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Designer</th>
                        <th>Category</th>
                        <th>Likes</th>
                        <th>Views</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($recentDesigns as $design)
                        <tr>
                            <td><strong>{{ substr($design->title, 0, 30) }}</strong></td>
                            <td>{{ $design->user->name }}</td>
                            <td>{{ $design->category->name ?? 'N/A' }}</td>
                            <td>❤️ {{ $design->likes }}</td>
                            <td>👁️ {{ $design->views }}</td>
                            <td>{{ $design->created_at->format('M d, Y') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <a href="{{ route('admin.designs') }}" class="btn-view-all">Manage All Designs →</a>
        @else
            <p style="color: #718096; text-align: center; padding: 2rem;">No designs uploaded yet</p>
        @endif
    </div>

    <!-- Quick Management Links -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem;">
        <a href="{{ route('admin.users') }}" class="btn btn-primary" style="text-align: center; padding: 1.5rem 1rem;">
            👥 Manage Users
        </a>
        <a href="{{ route('admin.designs') }}" class="btn btn-primary" style="text-align: center; padding: 1.5rem 1rem;">
            🎨 Manage Designs
        </a>
        <a href="{{ route('admin.feedback') }}" class="btn btn-primary" style="text-align: center; padding: 1.5rem 1rem;">
            💬 Manage Feedback
        </a>
        <a href="{{ route('admin.categories') }}" class="btn btn-primary" style="text-align: center; padding: 1.5rem 1rem;">
            📂 Manage Categories
        </a>
    </div>
</div>
@endsection
