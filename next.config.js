const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // For Google profile images
  },
};

module.exports = withNextIntl(nextConfig);
