export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1100px] mx-auto px-2 py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-1">Find Jobs Beyond Borders – From Sri Lanka</h1>
                    <p className="text-gray-600">Discover remote opportunities that let you work for global companies while staying in Sri Lanka.</p>
                </div>
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-black">Loading remote jobs...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
