@extends('layouts.app')

@section('content')
<style>
    .admin-container {
        padding: 2rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
    }

    .page-header {
        margin-bottom: 2rem;
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
    }

    .section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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

    .design-grid {
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
    }

    .design-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .design-image {
        width: 100%;
        height: 200px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.2rem;
    }

    .design-info {
        padding: 1.5rem;
    }

    .design-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .design-meta {
        font-size: 0.85rem;
        color: #718096;
        margin-bottom: 1rem;
    }

    .design-stats {
        display: flex;
        justify-content: space-around;
        padding: 1rem 0;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 1rem;
    }

    .stat {
        text-align: center;
    }

    .stat-number {
        font-weight: 700;
        color: #1a202c;
        font-size: 1.1rem;
    }

    .stat-label {
        font-size: 0.75rem;
        color: #718096;
        text-transform: uppercase;
        margin-top: 0.25rem;
    }

    .btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.3s ease;
        text-decoration: none;
        width: 100%;
        text-align: center;
    }

    .btn-danger {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }

    .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(245, 87, 108, 0.4);
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
    }

    .pagination a:hover {
        background: #f7fafc;
    }

    .pagination .active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
    }

    .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .back-link:hover {
        color: #764ba2;
    }

    @media (max-width: 768px) {
        .admin-container {
            padding: 1rem;
        }

        .page-title {
            font-size: 1.5rem;
        }

        .design-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
        }

        .section {
            padding: 1rem;
        }
    }
</style>

<div class="admin-container">
    <a href="{{ route('admin.dashboard') }}" class="back-link">← Back to Dashboard</a>

    <div class="page-header">
        <h1 class="page-title">🎨 Manage Designs</h1>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="section">
        @if($designs->count() > 0)
            <div class="design-grid">
                @foreach($designs as $design)
                    <div class="design-card">
                        <div class="design-image">
                            {{ substr($design->title, 0, 2) }}
                        </div>
                        <div class="design-info">
                            <div class="design-title">{{ substr($design->title, 0, 20) }}</div>
                            <div class="design-meta">by {{ $design->user->name }}</div>

                            <div class="design-stats">
                                <div class="stat">
                                    <div class="stat-number">❤️ {{ $design->likes }}</div>
                                    <div class="stat-label">Likes</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">👁️ {{ $design->views }}</div>
                                    <div class="stat-label">Views</div>
                                </div>
                            </div>

                            <form action="{{ route('admin.designs.delete', $design) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger" onclick="return confirm('Delete this design? This action cannot be undone.')">
                                    Delete Design
                                </button>
                            </form>
                        </div>
                    </div>
                @endforeach
            </div>

            @if($designs->hasPages())
                <div class="pagination">
                    {{ $designs->links() }}
                </div>
            @endif
        @else
            <div class="empty-state">
                <div class="empty-state-icon">🎨</div>
                <p>No designs have been uploaded yet</p>
            </div>
        @endif
    </div>
</div>
@endsection
