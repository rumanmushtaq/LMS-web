

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden">
      <img
        src="/images/hero-banner.jpg"
        alt="Varona Academy Shop Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl mb-2 sm:text-5xl font-display text-white font-extrabold  mb-3 tracking-tight">
          Shop
        </h1>
        <p className="text-hero-foreground/80 text-base sm:text-lg font-body max-w-md">
          Grab official Varona Academy merchandise.
        </p>
        <p className="text-hero-foreground/60 text-sm mt-2 font-body">
          Unlock Your Potential. Explore Our Collection.
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
