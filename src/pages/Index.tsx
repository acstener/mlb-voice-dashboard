import HeaderCard from "@/components/HeaderCard"
import { AppSidebar } from "@/components/AppSidebar"

const Index = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-mlb-navy/95">
      <AppSidebar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <HeaderCard />
      </div>
    </div>
  );
};

export default Index