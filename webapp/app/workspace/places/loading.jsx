export default function Loading() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Find the Perfect Desk, Anywhere You Go</h1>
                <p className="text-gray-600 mt-1">Compare and choose co-working spaces that make working away from home effortless.</p>
            </div>
            <div className="flex items-center justify-center min-h-72">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-black">Loading places...</p>
                </div>
            </div>
        </div>
    )
}
