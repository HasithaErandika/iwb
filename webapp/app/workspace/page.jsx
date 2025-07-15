"use client";
import { SectionCards } from "@/components/section-cards";
import { withProtectedRoute } from "@/components/with-protected-component";

const Page = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
    </div>
  );
};

export default withProtectedRoute(Page);
