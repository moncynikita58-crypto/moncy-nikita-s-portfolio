import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ListingsManager from "@/components/admin/ListingsManager";
import ApplicationsManager from "@/components/admin/ApplicationsManager";
import BlogManager from "@/components/admin/BlogManager";
import ContactMessages from "@/components/admin/ContactMessages";

type Tab = "listings" | "applications" | "blog" | "messages";

const tabs: { key: Tab; label: string }[] = [
  { key: "listings", label: "Career Listings" },
  { key: "applications", label: "Applications" },
  { key: "blog", label: "Blog Posts" },
  { key: "messages", label: "Messages" },
];

const AdminPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("listings");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, authLoading]);

  if (authLoading) return <div className="min-h-screen bg-muted flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-foreground text-background py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Infinite Insight — Admin Panel</h1>
        <a href="/" className="text-sm text-primary-foreground hover:underline">← Back to Site</a>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex gap-4 mb-6 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "listings" && <ListingsManager />}
        {activeTab === "applications" && <ApplicationsManager />}
        {activeTab === "blog" && <BlogManager />}
        {activeTab === "messages" && <ContactMessages />}
      </main>
    </div>
  );
};

export default AdminPage;
