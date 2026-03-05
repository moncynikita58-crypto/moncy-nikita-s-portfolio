import { useState } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const navItems = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about", hasDropdown: true },
  { label: "Services", href: "#services", hasDropdown: true },
  { label: "Partners", href: "#partners" },
  { label: "Clients", href: "#clients" },
  { label: "Blog", href: "#blog", hasDropdown: true },
  { label: "Social", href: "#social" },
  { label: "Contacts", href: "#contacts", hasDropdown: true },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Hero Banner */}
      <div className="relative w-full h-24 md:h-28 overflow-hidden">
        <img
          src={heroBanner}
          alt="We Know Africa - Infinite Insight"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <div className="absolute inset-0 rounded-full border-[3px] border-primary" />
              <div
                className="absolute top-0 right-0 w-1/2 h-1/2 rounded-tr-full border-t-[3px] border-r-[3px]"
                style={{ borderColor: "hsl(0, 75%, 45%)" }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-primary-foreground text-lg md:text-xl font-heading font-bold tracking-wide">
                Inf<span className="text-accent">i</span>nite
              </span>
              <span className="text-primary-foreground text-lg md:text-xl font-heading font-bold tracking-wide ml-4">
                <span className="text-accent">I</span>nsight
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-nav-bg border-b border-nav-border">
        <div className="container mx-auto flex items-center justify-between py-2">
          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1 mx-auto">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-body text-foreground hover:text-link-hover transition-colors"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </a>
              </li>
            ))}
            <li>
              <button className="p-2 text-foreground hover:text-link-hover transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-nav-border bg-nav-bg">
            <ul className="flex flex-col py-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="flex items-center justify-between px-6 py-3 text-sm font-body text-foreground hover:text-link-hover"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default SiteHeader;
