import HeroBanner from "@/components/molecules/shop/hero-section";
import DashboardSidebar from "@/components/organisms/Auth/landingPAge/DashboardSidebar";
import EarningsContent from "@/components/organisms/Auth/landingPAge/EarningsContent";
import InstructorProfile from "@/components/organisms/Auth/landingPAge/instructor-Profile";

export default function Home() {
  return (

        <div className="min-h-screen bg-background">
   
  
      <HeroBanner
        // title="Earnings"
        // breadcrumbs={[
        //   { label: "Home" },
        //   { label: "Earnings", active: true },
        // ]}
      />
      <InstructorProfile />
      <DashboardSidebar />
      <EarningsContent />
    </div>
  );
}
