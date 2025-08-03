import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderFormattedText } from "./chat.js";

/**
 * Search Input Component
 */
export function SearchInput({ 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  placeholder = "Ask anything..." 
}) {
  return (
    <div className="mb-12">
      <div className="relative max-w-2xl">
        <div className="relative border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-16 py-5 text-base border-0 rounded-xl focus:ring-0 focus:border-0 bg-transparent"
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
          />

          {/* Left Icons */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
          </div>

          {/* Right Icons */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Button
              size="sm"
              onClick={onSearch}
              className="w-8 h-8 p-0 bg-black hover:bg-black hover:cursor-pointer text-white rounded-lg"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Chat Sheet Component
 */
export function ChatSheet({
  isOpen,
  onOpenChange,
  searchQuery,
  chatResponse,
  isLoading,
  followUpQuery,
  setFollowUpQuery,
  onFollowUpSearch,
  title = "Travel Assistant",
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[2800px] lg:w-[2800px] overflow-y-auto border-l px-4 py-2 scrollbar-w-1 scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
      >
        <SheetHeader className="border-b pb-4 mb-2">
          <SheetTitle className="flex items-center space-x-2 text-left">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>{title}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-1 space-y-6 pb-8">
          <div className="p-4 bg-orange-200 rounded-lg">
            <p className="text-gray-700 font-semibold">{searchQuery}</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            chatResponse && (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <div className="text-sm">
                    {renderFormattedText(chatResponse)}
                  </div>
                </div>

                {/* Follow-up Question Input */}
                <FollowUpInput
                  followUpQuery={followUpQuery}
                  setFollowUpQuery={setFollowUpQuery}
                  onFollowUpSearch={onFollowUpSearch}
                  isLoading={isLoading}
                />
              </div>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Follow-up Input Component
 */
export function FollowUpInput({
  followUpQuery,
  setFollowUpQuery,
  onFollowUpSearch,
  isLoading,
}) {
  const quickActions = [
    "Tell me more about this",
    "What are the opening hours?",
    "How do I get there?",
    "What's the price range?",
  ];

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 mb-3">
          Ask a follow-up question
        </p>
        <div className="relative">
          <div className="relative border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
            <Input
              placeholder="Ask anything else..."
              value={followUpQuery}
              onChange={(e) => setFollowUpQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 text-sm border-0 rounded-lg focus:ring-0 focus:border-0 bg-transparent"
              onKeyPress={(e) => e.key === "Enter" && onFollowUpSearch()}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                size="sm"
                onClick={onFollowUpSearch}
                disabled={isLoading || !followUpQuery.trim()}
                className="w-7 h-7 p-0 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-md transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => setFollowUpQuery(action)}
            disabled={isLoading}
            className="text-xs px-3 py-1 h-auto border-gray-300 hover:bg-gray-50"
          >
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading Spinner Component
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
    </div>
  );
} 