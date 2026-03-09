// "use client";

// import React from "react";
// import { Sidebar } from "@/components/share/Sidebar";
// // import Header from "@/components/share/Header";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Right Section */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         {/* <Header
//           title="Dashboard"
//           subtitle="Welcome back 👋"
//         /> */}

//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/share/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {  status } = useSession(); // NextAuth session

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  // Authenticated content
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {/* <Header title={`Welcome, ${session.user.name}`} /> */}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
          {children}
        </main>
      </div>
    </div>
  );
}