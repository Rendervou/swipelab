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

    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
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

    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
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

    .badge {
        display: inline-block;
        padding: 0.4rem 0.8rem;
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
        padding: 0.5rem 1rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.3s ease;
        text-decoration: none;
        margin-right: 0.5rem;
    }

    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-danger {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }

    .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(245, 87, 108, 0.4);
    }

    .actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .form-select {
        padding: 0.5rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-size: 0.9rem;
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

        .table {
            font-size: 0.85rem;
        }

        .table th, .table td {
            padding: 0.75rem 0.5rem;
        }

        .actions {
            flex-direction: column;
        }

        .btn {
            width: 100%;
            text-align: center;
        }
    }
</style>

<div class="admin-container">
    <a href="{{ route('admin.dashboard') }}" class="back-link">← Back to Dashboard</a>

    <div class="page-header">
        <h1 class="page-title">👥 Manage Users</h1>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if(session('error'))
        <div class="alert alert-error">{{ session('error') }}</div>
    @endif

    <div class="section">
        @if($users->count() > 0)
            <table class="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $user)
                        <tr>
                            <td>
                                <div class="user-info">
                                    <div class="avatar">
                                        {{ strtoupper(substr($user->name, 0, 1)) }}
                                    </div>
                                    <strong>{{ $user->name }}</strong>
                                </div>
                            </td>
                            <td>{{ $user->email }}</td>
                            <td>
                                <span class="badge {{ $user->isAdmin() ? 'badge-admin' : 'badge-user' }}">
                                    {{ ucfirst($user->role) }}
                                </span>
                            </td>
                            <td>{{ $user->created_at->format('M d, Y') }}</td>
                            <td>
                                <div class="actions">
                                    @if(!$user->isAdmin() && $user->id !== auth()->id())
                                        <form action="{{ route('admin.users.update-role', $user) }}" method="POST" style="display: inline;">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="role" value="admin">
                                            <button type="submit" class="btn btn-primary" onclick="return confirm('Make this user an admin?')">
                                                Promote
                                            </button>
                                        </form>
                                    @elseif($user->isAdmin() && $user->id !== auth()->id())
                                        <form action="{{ route('admin.users.update-role', $user) }}" method="POST" style="display: inline;">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="role" value="user">
                                            <button type="submit" class="btn btn-primary" onclick="return confirm('Demote this user?')">
                                                Demote
                                            </button>
                                        </form>
                                    @endif

                                    @if($user->id !== auth()->id())
                                        <form action="{{ route('admin.users.delete', $user) }}" method="POST" style="display: inline;">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger" onclick="return confirm('Delete this user? This action cannot be undone.')">
                                                Delete
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            @if($users->hasPages())
                <div class="pagination">
                    {{ $users->links() }}
                </div>
            @endif
        @else
            <p style="color: #718096; text-align: center; padding: 2rem;">No users found</p>
        @endif
    </div>
</div>
@endsection
