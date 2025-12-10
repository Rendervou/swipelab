<nav x-data="{ open: false }" class="bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-900">
    <!-- Primary Navigation Menu -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <!-- Logo -->
                <div class="shrink-0 flex items-center">
                    <a href="{{ route('dashboard') }}" class="flex items-center space-x-2">
                        <span class="text-2xl font-bold text-white">🔄</span>
                        <span class="text-xl font-bold text-white hidden sm:block">SwipeLab</span>
                    </a>
                </div>

                <!-- Navigation Links -->
                <div class="hidden space-x-1 sm:-my-px sm:ms-10 sm:flex">
                    <x-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                        📊 Dashboard
                    </x-nav-link>
                    <x-nav-link href="{{ url('/swipe') }}" :active="request()->is('swipe')" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                        👆 Swipe Designs
                    </x-nav-link>
                    <x-nav-link href="{{ url('/designs/create') }}" :active="request()->is('designs/create')" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                        📤 Upload Design
                    </x-nav-link>
                    <x-nav-link href="{{ url('/categories') }}" :active="request()->is('categories')" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                        🏷️ Categories
                    </x-nav-link>
                </div>
            </div>

            <!-- Settings Dropdown -->
            <div class="hidden sm:flex sm:items-center sm:ms-6">
                <x-dropdown align="right" width="48">
                    <x-slot name="trigger">
                        <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none transition ease-in-out duration-150">
                            <div>{{ Auth::user()->name }}</div>

                            <div class="ms-1">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </button>
                    </x-slot>

                    <x-slot name="content">
                        <div class="px-4 py-2 text-sm text-gray-700 border-b">
                            {{ Auth::user()->email }}
                        </div>
                    <x-dropdown-link :href="route('profile.edit')">
                        👤 {{ __('Profile') }}
                    </x-dropdown-link>

                    @if(Auth::user()->isAdmin())
                        <x-dropdown-link :href="route('admin.dashboard')">
                            🎛️ {{ __('Admin Panel') }}
                        </x-dropdown-link>
                    @endif

                        <!-- Authentication -->
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf

                            <x-dropdown-link :href="route('logout')"
                                    onclick="event.preventDefault();
                                                this.closest('form').submit();">
                                🚪 {{ __('Log Out') }}
                            </x-dropdown-link>
                        </form>
                    </x-slot>
                </x-dropdown>
            </div>

            <!-- Hamburger -->
            <div class="-me-2 flex items-center sm:hidden">
                <button @click="open = ! open" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div :class="{'block': open, 'hidden': ! open}" class="hidden sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
            <x-responsive-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')" class="text-white hover:bg-blue-700">
                📊 {{ __('Dashboard') }}
            </x-responsive-nav-link>
            <x-responsive-nav-link href="{{ url('/swipe') }}" :active="request()->is('swipe')" class="text-white hover:bg-blue-700">
                👆 {{ __('Swipe Designs') }}
            </x-responsive-nav-link>
            <x-responsive-nav-link href="{{ url('/designs/create') }}" :active="request()->is('designs/create')" class="text-white hover:bg-blue-700">
                📤 {{ __('Upload Design') }}
            </x-responsive-nav-link>
            <x-responsive-nav-link href="{{ url('/categories') }}" :active="request()->is('categories')" class="text-white hover:bg-blue-700">
                🏷️ {{ __('Categories') }}
            </x-responsive-nav-link>
        </div>

        <!-- Responsive Settings Options -->
        <div class="pt-4 pb-1 border-t border-blue-700">
            <div class="px-4">
                <div class="font-medium text-base text-white">{{ Auth::user()->name }}</div>
                <div class="font-medium text-sm text-blue-200">{{ Auth::user()->email }}</div>
            </div>

            <div class="mt-3 space-y-1">
                <x-responsive-nav-link :href="route('profile.edit')" class="text-white hover:bg-blue-700">
                    👤 {{ __('Profile') }}
                </x-responsive-nav-link>

                @if(Auth::user()->isAdmin())
                    <x-responsive-nav-link :href="route('admin.dashboard')" class="text-white hover:bg-blue-700">
                        🎛️ {{ __('Admin Panel') }}
                    </x-responsive-nav-link>
                @endif

                <!-- Authentication -->
                <form method="POST" action="{{ route('logout') }}">
                    @csrf

                    <x-responsive-nav-link :href="route('logout')"
                            onclick="event.preventDefault();
                                        this.closest('form').submit();" class="text-white hover:bg-blue-700">
                        🚪 {{ __('Log Out') }}
                    </x-responsive-nav-link>
                </form>
            </div>
        </div>
    </div>
</nav>
