import { Link } from "react-router-dom";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Company Profile (pdf)", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Partners", href: "/partners" },
  { label: "Clients", href: "/clients" },
  { label: "Industry Memberships", href: "/about" },
  { label: "News", href: "/blog" },
  { label: "Reports", href: "/blog" },
  { label: "Data Privacy", href: "/about" },
  { label: "Contacts", href: "/contacts" },
  { label: "Careers", href: "/contacts" },
];

const newsLinks = [
  { label: "Conducting Social Research in Rwanda", href: "/blog/social-research-rwanda" },
  { label: "Update from ESOMAR 2026 Conference in Nairobi", href: "/blog/esomar-conference" },
  { label: "Yemi Oniyitan Named a NiMRA Fellow", href: "/blog/nimra-fellow" },
  { label: "Upcoming MSRA Ethics Webinar", href: "/blog/msra-ethics-webinar" },
  { label: "Performing Quantitative Field Work in Uganda", href: "/blog/field-work-uganda" },
  { label: "Data Analysis & Analytics Training via WhatsApp", href: "/blog/data-analytics-training" },
  { label: "Getting ready for new research project", href: "/blog/new-research-project" },
];

const esomarLinks = [
  { label: "Events", href: "/blog" },
  { label: "Hot Topics", href: "/blog" },
  { label: "Opinions", href: "/blog" },
  { label: "Brand Stories", href: "/blog" },
  { label: "Podcast", href: "/blog" },
  { label: "Sustainability Library", href: "/blog" },
];

const contactLinks = [
  { label: "Linkedin", href: "https://linkedin.com", external: true },
  { label: "Instagram", href: "https://instagram.com", external: true },
  { label: "YouTube", href: "https://youtube.com", external: true },
  { label: "Contact Us", href: "/contacts", external: false },
];

const SiteFooter = () => {
  return (
    <footer className="bg-black pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Company */}
          <div>
            <h3 className="text-base font-heading font-bold text-primary-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-primary-foreground/80 hover:text-primary underline underline-offset-2 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* News & Reports */}
          <div>
            <h3 className="text-base font-heading font-bold text-primary-foreground mb-4">News & Reports</h3>
            <ul className="space-y-2">
              {newsLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-primary-foreground/80 hover:text-primary underline underline-offset-2 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ESOMAR News */}
          <div>
            <h3 className="text-base font-heading font-bold text-primary-foreground mb-4">ESOMAR News</h3>
            <ul className="space-y-2">
              {esomarLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-primary-foreground/80 hover:text-primary underline underline-offset-2 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-base font-heading font-bold text-primary-foreground mb-4">Contacts</h3>
            <ul className="space-y-2">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/80 hover:text-primary underline underline-offset-2 transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-sm text-primary-foreground/80 hover:text-primary underline underline-offset-2 transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 text-center">
          <p className="text-sm text-primary-foreground/70">
            Copyright © {new Date().getFullYear()} · Infinite Insight Ltd - "We know Africa"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
