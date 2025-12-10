<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Swipe Design') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <!-- Design Card -->
                    <div id="designCard" class="mb-6">
                        <img id="designImage" src="" alt="" class="w-full h-96 object-cover rounded-lg mb-4">
                        <h2 id="designTitle" class="text-2xl font-bold mb-2"></h2>
                        <p id="designCategory" class="text-gray-600 mb-4"></p>
                        <p id="designDescription" class="text-gray-700 mb-6"></p>
                        
                        <div class="flex justify-between mb-4 text-sm text-gray-500">
                            <span>👁️ <span id="views">0</span> views</span>
                            <span>❤️ <span id="likes">0</span> likes</span>
                        </div>

                        <div class="bg-gray-100 p-4 rounded-lg mb-6">
                            <p class="font-semibold mb-2">Creator: <span id="creatorName"></span></p>
                        </div>
                    </div>

                    <!-- Swipe Buttons -->
                    <div class="flex gap-4 justify-center mb-6">
                        <button onclick="swipeLeft()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg">
                            👎 Swipe Left
                        </button>
                        <button onclick="swipeRight()" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg">
                            👍 Swipe Right
                        </button>
                    </div>

                    <!-- Feedback Section -->
                    <div id="feedbackSection" class="border-t pt-6">
                        <h3 class="text-xl font-bold mb-4">Berikan Feedback</h3>
                        <form id="feedbackForm">
                            @csrf
                            <input type="hidden" id="design_id" name="design_id">
                            
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Rating (1-5)</label>
                                <div class="flex gap-2">
                                    <input type="radio" name="rating" value="1"> ⭐
                                    <input type="radio" name="rating" value="2"> ⭐⭐
                                    <input type="radio" name="rating" value="3"> ⭐⭐⭐
                                    <input type="radio" name="rating" value="4"> ⭐⭐⭐⭐
                                    <input type="radio" name="rating" value="5"> ⭐⭐⭐⭐⭐
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Komentar</label>
                                <textarea id="comment" name="comment" rows="3" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    placeholder="Berikan feedback konstruktif..."></textarea>
                            </div>

                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                Kirim Feedback
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentDesign = null;

        async function loadRandomDesign() {
            try {
                const response = await fetch('/api/swipe/random', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                });

                if (response.ok) {
                    currentDesign = await response.json();
                    displayDesign(currentDesign);
                } else if (response.status === 404) {
                    document.getElementById('designCard').innerHTML = '<p class="text-center text-gray-500">No more designs to swipe</p>';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function displayDesign(design) {
            document.getElementById('designImage').src = design.image_url;
            document.getElementById('designImage').alt = design.title;
            document.getElementById('designTitle').textContent = design.title;
            document.getElementById('designCategory').textContent = design.category.name;
            document.getElementById('designDescription').textContent = design.description;
            document.getElementById('views').textContent = design.views;
            document.getElementById('likes').textContent = design.likes;
            document.getElementById('creatorName').textContent = design.user.name;
            document.getElementById('design_id').value = design.id;
        }

        async function swipeLeft() {
            if (!currentDesign) return;

            try {
                const response = await fetch('/api/swipe/left', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify({ design_id: currentDesign.id })
                });

                if (response.ok) {
                    loadRandomDesign();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function swipeRight() {
            if (!currentDesign) return;

            try {
                const response = await fetch('/api/swipe/right', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify({ design_id: currentDesign.id })
                });

                if (response.ok) {
                    loadRandomDesign();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Load initial design
        loadRandomDesign();

        // Handle feedback submission
        document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                design_id: parseInt(document.getElementById('design_id').value),
                rating: parseInt(document.querySelector('input[name="rating"]:checked').value),
                comment: document.getElementById('comment').value
            };

            try {
                const response = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Feedback submitted!');
                    document.getElementById('feedbackForm').reset();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    </script>
</x-app-layout>
