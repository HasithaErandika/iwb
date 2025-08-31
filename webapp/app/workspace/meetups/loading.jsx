export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold tracking-tight text-black">Connect With Nomads & Locals in Sri Lanka 🏝️</h1>
                    <p className="text-gray-600 mt-1">Whether you’re in the city or by the beach, find fun meetups that help you connect, share, and explore.</p>
                </div>
                <div className="flex items-center justify-center min-h-72">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-black">Loading meetups...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


