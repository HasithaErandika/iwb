"use client";
import { WorkspaceWidgets } from "@/components/workspace-widgets";
import { withProtectedRoute } from "@/components/with-protected-component";

const Page = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-h-screen" style={{ backgroundColor: '#fcfcf9' }}>
      <WorkspaceWidgets />
    </div>
  );
};

export default withProtectedRoute(Page);
