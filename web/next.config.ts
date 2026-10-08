import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (the local-development database) ships WebAssembly that must not be bundled.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
