const SiteFooter = () => {
  return (
    <footer className="bg-primary py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm text-primary-foreground opacity-80">
          © {new Date().getFullYear()} Infinite Insight. All rights reserved.
        </p>
        <p className="text-xs text-primary-foreground opacity-60 mt-2">
          Market Research Agency — Nairobi, Kenya
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
