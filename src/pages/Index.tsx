import SiteHeader from "@/components/SiteHeader";
import AboutSection from "@/components/AboutSection";
import HelpSection from "@/components/HelpSection";
import BlogSection from "@/components/BlogSection";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <AboutSection />
        <HelpSection />
        <BlogSection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
