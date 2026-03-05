import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import logo from "@/assets/logo.png";
import membershipLogos from "@/assets/membership-logos.png";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us", href: "/about", dropdown: [
      { label: "Our Expertise", href: "/about" },
      { label: "Directors", href: "/about" },
      { label: "Senior Management", href: "/about" },
      { label: "Coverage Map", href: "/about" },
      { label: "Data Privacy", href: "/about" },
      { label: "GDPR Compliance", href: "/about" },
    ]
  },
  {
    label: "Services", href: "/services", dropdown: [
      { label: "Quantitative Research", href: "/services" },
      { label: "Qualitative Research", href: "/services" },
      { label: "Data Analytics", href: "/services" },
      { label: "Training", href: "/services" },
    ]
  },
  { label: "Partners", href: "/partners" },
  { label: "Clients", href: "/clients" },
  {
    label: "Blog", href: "/blog", dropdown: [
      { label: "News", href: "/blog" },
      { label: "Reports", href: "/blog" },
    ]
  },
  { label: "Social", href: "/social" },
  {
    label: "Contacts", href: "/contacts", dropdown: [
      { label: "Contact Us", href: "/contacts" },
      { label: "Careers", href: "/contacts" },
    ]
  },
];

const DropdownMenu = ({ items, onClose }: { items: DropdownItem[]; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute top-full left-0 mt-0 bg-background border border-border shadow-lg rounded-sm min-w-[200px] z-50 py-1">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          onClick={onClose}
          className="block px-4 py-2 text-sm text-foreground hover:bg-secondary underline underline-offset-2 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

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
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Infinite Insight Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-nav-bg border-b border-nav-border">
        <div className="container mx-auto flex items-center justify-between py-2">
          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1 mx-auto">
            {navItems.map((item) => (
              <li key={item.label} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-body text-foreground hover:text-link-hover underline underline-offset-4 transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {openDropdown === item.label && (
                      <DropdownMenu items={item.dropdown} onClose={() => setOpenDropdown(null)} />
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-body text-foreground hover:text-link-hover underline underline-offset-4 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
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
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-6 py-3 text-sm font-body text-foreground hover:text-link-hover"
                      >
                        {item.label}
                        <ChevronDown className={`w-3 h-3 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {mobileExpanded === item.label && (
                        <ul className="bg-secondary">
                          {item.dropdown.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                to={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-10 py-2 text-sm text-foreground hover:text-link-hover"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center justify-between px-6 py-3 text-sm font-body text-foreground hover:text-link-hover"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Membership Logos */}
      <div className="w-full bg-background py-4 border-b border-border">
        <div className="container mx-auto px-6">
          <img
            src={membershipLogos}
            alt="ESOMAR, MSRA, PAMRO, AMRA, NiMRA, SAMRA, WAPOR, GBA membership logos"
            className="w-full max-h-16 object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
