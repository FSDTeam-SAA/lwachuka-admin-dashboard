import React from "react";
import OverviewCard from "./_components/OverviewCard";
import RecentActivity from "./_components/Recentactivity";
import UserManagement from "./_components/Usermanagement";
import QuickLinks from "./_components/Quicklinks";

function page() {
  return (
    <div>
      <OverviewCard />
      <div className="flex items-stretch gap-5 my-5">
        <RecentActivity />
        <UserManagement />
      </div>
      <QuickLinks />
    </div>
  );
}

export default page;
