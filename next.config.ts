import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    basePath: "/WizDesigner",
    images: { unoptimized: true },
    trailingSlash: true,
};

export default nextConfig;
