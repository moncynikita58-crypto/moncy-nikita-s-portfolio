import { Link } from "react-router-dom";
import { Briefcase, Users, UsersRound, Mic, Newspaper, TrendingUp } from "lucide-react";

const helpItems = [
  { icon: Briefcase, label: "About Us", href: "/about" },
  { icon: Users, label: "Partners", href: "/partners" },
  { icon: UsersRound, label: "Clients", href: "/clients" },
  { icon: Mic, label: "Services", href: "/services" },
  { icon: Newspaper, label: "News", href: "/blog" },
  { icon: TrendingUp, label: "Research Reports", href: "/blog" },
];

const HelpSection = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto max-w-5xl px-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-10">
          How can we help you?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
          {helpItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-4 group"
            >
              <item.icon className="w-16 h-16 text-primary" strokeWidth={1.5} />
              <span className="text-sm font-semibold font-body text-primary underline underline-offset-4 group-hover:text-accent transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
