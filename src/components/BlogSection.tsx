import { Link } from "react-router-dom";
import blogRwanda from "@/assets/blog-rwanda.jpg";
import blogConference from "@/assets/blog-conference.jpg";
import blogUganda from "@/assets/blog-uganda.jpg";
import blogWebinar from "@/assets/blog-webinar.jpg";
import blogData from "@/assets/blog-data.jpg";

const blogPosts = [
  {
    slug: "conducting-social-research-in-rwanda",
    image: blogRwanda,
    title: "Conducting Social Research in Rwanda",
    excerpt: "Rwanda is a beautiful country, known for its rolling hills. Its cities and rural family homesteads are well kept and …",
  },
  {
    slug: "esomar-2026-conference-nairobi",
    image: blogConference,
    title: "Update from ESOMAR 2026 Conference in Nairobi",
    excerpt: "Africa 2026 was a powerful moment for our industry — bringing together researchers from across the continent …",
  },
  {
    slug: "quantitative-field-work-uganda",
    image: blogUganda,
    title: "Performing Quantitative Field Work in Uganda",
    excerpt: 'Greetings from Uganda — also known as the "Pearl of Africa". As one of the top destinations in the East …',
  },
  {
    slug: "msra-ethics-webinar",
    image: blogWebinar,
    title: "Upcoming MSRA Ethics Webinar",
    excerpt: "This post is a reminder for all Infinite Insight staff as well as our field interviewers who are registered MSRA …",
  },
  {
    slug: "data-analysis-training-whatsapp",
    image: blogData,
    title: "Data Analysis & Analytics Training via WhatsApp",
    excerpt: "This valuable training info was posted to our private group chat by Naftali, our Research Director (Quant) …",
  },
];

const BlogSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-10">
          News from our Blog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.slug} className="group">
              <article>
                <div className="overflow-hidden rounded mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-heading font-bold text-primary group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="inline-block mt-2 text-sm text-primary font-semibold group-hover:text-accent transition-colors">
                  Read more →
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/blog" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
