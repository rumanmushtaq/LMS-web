import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Type-checking runs as its own step (`npm run typecheck`), which the
  // pre-commit hook runs *before* the build.
  //
  // It is not skipped — it is moved, so a type error surfaces in seconds
  // instead of part-way through a build, and the build does not repeat work the
  // hook has already done.
  //
  // (Next 16 dropped the `eslint` build option along with `next lint`, so
  // linting is only a separate step here.)
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
