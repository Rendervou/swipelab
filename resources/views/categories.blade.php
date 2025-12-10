<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Kelola Kategori') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <!-- Add New Category -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div class="p-6">
                    <h3 class="text-lg font-bold mb-4">Tambah Kategori Baru</h3>
                    <form id="categoryForm">
                        @csrf
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <input type="text" id="name" name="name" placeholder="Nama Kategori" required
                                class="px-4 py-2 border border-gray-300 rounded-lg">
                            <input type="text" id="slug" name="slug" placeholder="Slug" required
                                class="px-4 py-2 border border-gray-300 rounded-lg">
                            <input type="text" id="description" name="description" placeholder="Deskripsi"
                                class="px-4 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Tambah Kategori
                        </button>
                    </form>
                </div>
            </div>

            <!-- Categories List -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <h3 class="text-lg font-bold mb-4">Daftar Kategori</h3>
                    <div id="categoriesList">
                        <!-- Loaded via JavaScript -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        async function loadCategories() {
            try {
                const response = await fetch('/api/categories');
                const categories = await response.json();
                
                let html = '<div class="space-y-3">';
                categories.forEach(cat => {
                    html += `
                        <div class="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                                <h4 class="font-bold">${cat.name}</h4>
                                <p class="text-sm text-gray-600">${cat.description || ''}</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="editCategory(${cat.id})" class="bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                                <button onclick="deleteCategory(${cat.id})" class="bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                document.getElementById('categoriesList').innerHTML = html;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        document.getElementById('categoryForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById('name').value,
                slug: document.getElementById('slug').value,
                description: document.getElementById('description').value,
            };

            try {
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Category added successfully!');
                    document.getElementById('categoryForm').reset();
                    loadCategories();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });

        async function deleteCategory(id) {
            if (!confirm('Apakah Anda yakin?')) return;

            try {
                const response = await fetch(`/api/categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                });

                if (response.ok) {
                    alert('Category deleted!');
                    loadCategories();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Load categories on page load
        loadCategories();
    </script>
</x-app-layout>
