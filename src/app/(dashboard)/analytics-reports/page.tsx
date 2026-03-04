import React from "react";
import AnalyticsReportsCard from "./_components/AnalyticsReportsCard";
import UserGrowthTrend from "./_components/UserGrowthTrend";
import RevenueTrend from "./_components/RevenueTrend";
import PropertyListingsGrowth from "./_components/PropertyListingsGrowth";
import PropertiesbyType from "./_components/PropertiesbyType";
import PropertyListingsGrowthBar from "./_components/PropertyListingsGrowthBar";
import PropertybyTypeBar from "./_components/PropertybyTypeBar";

const Page = () => {
  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <AnalyticsReportsCard />

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col gap-6">
          <UserGrowthTrend />
          <RevenueTrend />
        </div>

        <div className="flex flex-col gap-6">
          <PropertyListingsGrowth />
          <PropertiesbyType />
        </div>
      </div>

      {/* Bottom Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <PropertyListingsGrowthBar />
        <PropertybyTypeBar />
      </div>
    </div>
  );
};

export default Page;