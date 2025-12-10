@extends('layouts.app')

@section('content')
<style>
    .designers-container {
        padding: 2rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
    }

    .designers-header {
        max-width: 1200px;
        margin: 0 auto 2rem;
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .header-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
    }

    .header-subtitle {
        color: #718096;
    }

    .designers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .designer-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .designer-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .designer-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 auto 1rem;
    }

    .designer-name {
        font-size: 1.3rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
    }

    .designer-email {
        color: #718096;
        font-size: 0.85rem;
        margin-bottom: 1rem;
        word-break: break-all;
    }

    .designer-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem 0;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
    }

    .stat {
        text-align: center;
    }

    .stat-number {
        font-weight: 700;
        color: #f5576c;
        font-size: 1.2rem;
    }

    .stat-label {
        color: #a0aec0;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }

    .designer-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }

    .btn {
        padding: 0.75rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        transition: all 0.3s ease;
        font-size: 0.85rem;
    }

    .btn-primary {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(245, 87, 108, 0.4);
    }

    .btn-secondary {
        background: white;
        color: #f5576c;
        border: 1px solid #f5576c;
    }

    .btn-secondary:hover {
        background: #f7fafc;
    }

    .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: #f5576c;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .back-link:hover {
        transform: translateX(-5px);
    }

    .pagination {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }

    .pagination a,
    .pagination span {
        padding: 0.5rem 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        text-decoration: none;
        color: #2d3748;
        font-size: 0.85rem;
    }

    .pagination a:hover {
        background: white;
    }

    .pagination .active {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        border-color: #f5576c;
    }

    @media (max-width: 768px) {
        .designers-container {
            padding: 1rem;
        }

        .designers-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .designer-card {
            padding: 1.5rem;
        }
    }
</style>

<div class="designers-container">
    <a href="{{ route('designer.profile', $user) }}" class="back-link">← Back to Profile</a>

    <div class="designers-header">
        <div class="header-title">{{ $user->name }} is Following</div>
        <div class="header-subtitle">
            {{ $designers->total() }} designer{{ $designers->total() !== 1 ? 's' : '' }}
        </div>
    </div>

    @if($designers->count() > 0)
        <div class="designers-grid">
            @foreach($designers as $designer)
                <div class="designer-card">
                    <div class="designer-avatar">
                        {{ strtoupper(substr($designer->name, 0, 1)) }}
                    </div>
                    <div class="designer-name">{{ $designer->name }}</div>
                    <div class="designer-email">{{ $designer->email }}</div>

                    <div class="designer-stats">
                        <div class="stat">
                            <div class="stat-number">{{ $designer->designs()->count() }}</div>
                            <div class="stat-label">Designs</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">{{ $designer->followers()->count() }}</div>
                            <div class="stat-label">Followers</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">{{ $designer->getTotalPoints() }}</div>
                            <div class="stat-label">Points</div>
                        </div>
                    </div>

                    <div class="designer-actions">
                        <a href="{{ route('designer.profile', $designer) }}" class="btn btn-primary">
                            View Profile
                        </a>
                        @if(auth()->check() && auth()->id() !== $designer->id)
                            @if(auth()->user()->following()->where('following_id', $designer->id)->exists())
                                <form action="{{ route('designer.unfollow', $designer) }}" method="POST" style="width: 100%;">
                                    @csrf
                                    <button type="submit" class="btn btn-secondary" style="width: 100%;">
                                        ✓ Following
                                    </button>
                                </form>
                            @else
                                <form action="{{ route('designer.follow', $designer) }}" method="POST" style="width: 100%;">
                                    @csrf
                                    <button type="submit" class="btn btn-secondary" style="width: 100%;">
                                        + Follow
                                    </button>
                                </form>
                            @endif
                        @endif
                    </div>
                </div>
            @endforeach
        </div>

        @if($designers->hasPages())
            <div class="pagination">
                {{ $designers->links() }}
            </div>
        @endif
    @else
        <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); max-width: 1200px; margin: 0 auto;">
            <p style="color: #a0aec0; font-size: 1.1rem;">Not following anyone yet</p>
        </div>
    @endif
</div>
@endsection
