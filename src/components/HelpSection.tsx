import { Users, Handshake, Building2, Settings, Newspaper, FileText } from "lucide-react";

const helpItems = [
  { icon: Users, label: "About Us", href: "#about" },
  { icon: Handshake, label: "Partners", href: "#partners" },
  { icon: Building2, label: "Clients", href: "#clients" },
  { icon: Settings, label: "Services", href: "#services" },
  { icon: Newspaper, label: "News", href: "#news" },
  { icon: FileText, label: "Research Reports", href: "#reports" },
];

const HelpSection = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto max-w-5xl px-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-10">
          How can we help you?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {helpItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-3 p-6 bg-background rounded border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <item.icon className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
              <span className="text-sm font-semibold font-body text-foreground group-hover:text-primary transition-colors">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
