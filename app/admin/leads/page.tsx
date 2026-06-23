import type { Metadata } from "next";
import { AdminLeadsDashboard } from "@/components/AdminLeadsDashboard";

export const metadata: Metadata = {
  title: "Bathroom leads admin",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function AdminLeadsPage() {
  return <AdminLeadsDashboard />;
}
