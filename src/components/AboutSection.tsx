import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import aboutPanel1 from "@/assets/about-panel1.jpg";
import aboutPanel2 from "@/assets/about-panel2.jpg";
import aboutPanel3 from "@/assets/about-panel3.jpg";
import aboutPanel4 from "@/assets/about-panel4.jpg";
import aboutPanel5 from "@/assets/about-panel5.jpg";

const carouselImages = [
  { src: aboutPanel1, alt: "Infinite Insight field research" },
  { src: aboutPanel2, alt: "Market research in Africa" },
  { src: aboutPanel3, alt: "Research team at work" },
  { src: aboutPanel4, alt: "Data collection fieldwork" },
  { src: aboutPanel5, alt: "Nairobi research operations" },
];

const AboutSection = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-4xl px-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">
          We Know Africa
        </h1>

        <p className="text-base leading-relaxed text-foreground mb-4">
          <strong>Infinite Insight</strong> is a full-service market research agency established in
          2010. From our hub in Nairobi, we offer qualitative and quantitative research services
          across Sub-Saharan Africa. To date, we have carried out professional projects in 30
          African markets in East, West, and Southern Africa.
        </p>

        <p className="text-base leading-relaxed text-foreground mb-8">
          We have put together a team of young, dynamic professionals, who are committed to
          delivering high quality results.
        </p>

        {/* Image carousel */}
        <div className="mb-8 overflow-hidden rounded" ref={emblaRef}>
          <div className="flex">
            {carouselImages.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-base leading-relaxed text-foreground mb-4">
          Capacity building is an ongoing process, to which we are thoroughly committed. In addition
          to project-specific briefings, we regularly organise training sessions on specific topics,
          both in qualitative and quantitative techniques and methodologies.
        </p>

        <p className="text-base leading-relaxed text-foreground">
          We adhere to the <em className="font-semibold">ICC/ESOMAR Code of Practice</em>, the{" "}
          <em className="font-semibold">MSRA Code of Ethics</em>, and the European Union's{" "}
          <em className="font-semibold">General Data Protection Regulation</em>, which is being
          embraced by an increasing number of African countries.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
