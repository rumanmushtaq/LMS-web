const HeroBanner = () => {
  return (
    <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
        alt="Varona Academy Shop Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl mb-2 sm:text-5xl font-display text-white font-extrabold tracking-tight drop-shadow-md">
          Shop
        </h1>
        <p className="text-white/90 text-base sm:text-lg font-body max-w-md font-medium drop-shadow">
          Grab official Varona Academy merchandise.
        </p>
        <p className="text-white/70 text-sm mt-2 font-body font-medium drop-shadow">
          Unlock Your Potential. Explore Our Collection.
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
