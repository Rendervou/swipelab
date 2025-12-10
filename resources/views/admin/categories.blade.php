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

    .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .category-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 2rem;
        color: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        min-height: 200px;
    }

    .category-card:nth-child(2) {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .category-card:nth-child(3) {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .category-card:nth-child(4) {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .category-card:nth-child(5) {
        background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
    }

    .category-card:nth-child(6) {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    }

    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    .category-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .category-count {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0.5rem 0;
    }

    .category-label {
        font-size: 0.9rem;
        opacity: 0.9;
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

        .category-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
        }

        .section {
            padding: 1rem;
        }

        .category-card {
            min-height: 180px;
            padding: 1.5rem;
        }

        .category-name {
            font-size: 1.1rem;
        }

        .category-count {
            font-size: 2rem;
        }
    }
</style>

<div class="admin-container">
    <a href="{{ route('admin.dashboard') }}" class="back-link">← Back to Dashboard</a>

    <div class="page-header">
        <h1 class="page-title">📂 Manage Categories</h1>
    </div>

    <div class="section">
        @if($categories->count() > 0)
            <div class="category-grid">
                @foreach($categories as $category)
                    <div class="category-card">
                        <div class="category-name">{{ $category->name }}</div>
                        <div class="category-count">{{ $category->designs_count }}</div>
                        <div class="category-label">{{ $category->designs_count === 1 ? 'Design' : 'Designs' }}</div>
                    </div>
                @endforeach
            </div>

            @if($categories->hasPages())
                <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; flex-wrap: wrap;">
                    {{ $categories->links() }}
                </div>
            @endif
        @else
            <div class="empty-state">
                <div class="empty-state-icon">📂</div>
                <p>No categories found</p>
            </div>
        @endif
    </div>
</div>
@endsection
