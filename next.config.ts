import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    domains: ["flowbite.com", "images.unsplash.com"],
  },
};

export default withFlowbiteReact(nextConfig);