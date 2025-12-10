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

    .feedback-item {
        background: #f7fafc;
        border-left: 4px solid linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .feedback-item:hover {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .feedback-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 1rem;
    }

    .feedback-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        flex-shrink: 0;
    }

    .author-name {
        font-weight: 700;
        color: #1a202c;
    }

    .feedback-design {
        font-size: 0.9rem;
        color: #718096;
        margin-top: 0.25rem;
    }

    .feedback-date {
        font-size: 0.85rem;
        color: #718096;
    }

    .feedback-text {
        color: #2d3748;
        line-height: 1.6;
        margin-bottom: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 6px;
        border-left: 3px solid #667eea;
    }

    .feedback-actions {
        display: flex;
        gap: 0.5rem;
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

    .rating {
        display: inline-block;
        margin-top: 0.5rem;
    }

    .star {
        color: #f5576c;
        margin-right: 0.25rem;
    }

    @media (max-width: 768px) {
        .admin-container {
            padding: 1rem;
        }

        .page-title {
            font-size: 1.5rem;
        }

        .feedback-header {
            flex-direction: column;
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
        <h1 class="page-title">💬 Manage Feedback</h1>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="section">
        @if($feedback->count() > 0)
            <div>
                @foreach($feedback as $item)
                    <div class="feedback-item">
                        <div class="feedback-header">
                            <div class="feedback-author">
                                <div class="avatar">
                                    {{ strtoupper(substr($item->user->name, 0, 1)) }}
                                </div>
                                <div>
                                    <div class="author-name">{{ $item->user->name }}</div>
                                    <div class="feedback-design">
                                        💬 On: "{{ substr($item->design->title, 0, 30) }}"
                                    </div>
                                    <div class="feedback-date">
                                        {{ $item->created_at->format('M d, Y - h:i A') }}
                                    </div>
                                </div>
                            </div>
                            <form action="{{ route('admin.feedback.delete', $item) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger" onclick="return confirm('Delete this feedback?')">
                                    Delete
                                </button>
                            </form>
                        </div>

                        <div class="feedback-text">
                            {{ $item->content }}
                        </div>

                        @if($item->rating)
                            <div class="rating">
                                @for($i = 0; $i < $item->rating; $i++)
                                    <span class="star">⭐</span>
                                @endfor
                                <span style="color: #718096; font-size: 0.85rem; margin-left: 0.5rem;">{{ $item->rating }}/5</span>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>

            @if($feedback->hasPages())
                <div class="pagination">
                    {{ $feedback->links() }}
                </div>
            @endif
        @else
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <p>No feedback has been submitted yet</p>
            </div>
        @endif
    </div>
</div>
@endsection
