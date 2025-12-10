<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Upload Design') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <form id="uploadForm" enctype="multipart/form-data">
                        @csrf
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Judul</label>
                            <input type="text" id="title" name="title" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Deskripsi</label>
                            <textarea id="description" name="description" rows="4" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"></textarea>
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Kategori</label>
                            <select id="category_id" name="category_id" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="">Pilih Kategori</option>
                                <option value="1">UI/UX Design</option>
                                <option value="2">Poster</option>
                                <option value="3">Logo</option>
                                <option value="4">Art</option>
                                <option value="5">Web Design</option>
                                <option value="6">Motion Graphics</option>
                            </select>
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Gambar (JPG/PNG, max 10MB)</label>
                            <input type="file" id="image" name="image" accept="image/jpeg,image/png" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            <p class="text-sm text-gray-500 mt-2">Max 10MB, Format: JPG atau PNG</p>
                        </div>

                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            Upload Design
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('title', document.getElementById('title').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('category_id', document.getElementById('category_id').value);
            formData.append('image', document.getElementById('image').files[0]);

            try {
                const response = await fetch('/api/designs', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: formData
                });

                if (response.ok) {
                    alert('Design uploaded successfully!');
                    window.location.href = '/dashboard';
                } else {
                    alert('Error uploading design');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error uploading design');
            }
        });
    </script>
</x-app-layout>
