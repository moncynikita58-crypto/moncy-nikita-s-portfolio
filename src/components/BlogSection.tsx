import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import blogRwanda from "@/assets/blog-rwanda.jpg";
import blogConference from "@/assets/blog-conference.jpg";
import blogUganda from "@/assets/blog-uganda.jpg";
import blogWebinar from "@/assets/blog-webinar.jpg";
import blogData from "@/assets/blog-data.jpg";
import blogNimra from "@/assets/blog-nimra.jpg";

const blogPosts = [
  {
    slug: "esomar-2026-conference-nairobi",
    image: blogConference,
    title: "Update from ESOMAR 2026 Conference in Nairobi",
    excerpt: "This message was sent by our MSRA Secretariat: 📌 Africa 2026 was a powerful moment for our industry — and …",
  },
  {
    slug: "yemi-oniyitan-nimra-fellow",
    image: blogNimra,
    title: "Yemi Oniyitan Named a NiMRA Fellow",
    excerpt: "It is with great pleasure that the Infinite Insight family reports about an amazing accomplishment from one of our original …",
  },
  {
    slug: "msra-ethics-webinar",
    image: blogWebinar,
    title: "Upcoming MSRA Ethics Webinar",
    excerpt: "This post is a reminder for all Infinite Insight staff as well as our field interviewers who are registered MSRA …",
  },
  {
    slug: "conducting-social-research-in-rwanda",
    image: blogRwanda,
    title: "Conducting Social Research in Rwanda",
    excerpt: "Rwanda is a beautiful country, known for its rolling hills. Its cities and rural family homesteads are well kept and …",
  },
  {
    slug: "quantitative-field-work-uganda",
    image: blogUganda,
    title: "Performing Quantitative Field Work in Uganda",
    excerpt: 'Greetings from Uganda — also known as the "Pearl of Africa". As one of the top destinations in the East …',
  },
  {
    slug: "data-analysis-training-whatsapp",
    image: blogData,
    title: "Data Analysis & Analytics Training via WhatsApp",
    excerpt: "This valuable training info was posted to our private group chat by Naftali, our Research Director (Quant) …",
  },
];

const BlogSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-10">
          News from our Blog
        </h2>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {blogPosts.map((post) => (
                <div key={post.slug} className="flex-[0_0_33.333%] min-w-0 px-3">
                  <Link to={`/blog/${post.slug}`} className="group">
                    <article>
                      <div className="overflow-hidden rounded mb-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-base font-heading font-bold text-primary underline group-hover:text-accent transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.excerpt}{" "}
                        <span className="text-primary underline group-hover:text-accent transition-colors">
                          Read more
                        </span>
                      </p>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-24 -translate-x-4 bg-muted/80 hover:bg-muted rounded-full p-1.5 text-foreground"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-24 translate-x-4 bg-muted/80 hover:bg-muted rounded-full p-1.5 text-foreground"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {blogPosts.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === selectedIndex ? "bg-foreground" : "bg-muted-foreground/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
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
