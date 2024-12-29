// import  withPWA from 'next-pwa'
// let modWithPWA = withPWA({
//   pwa: {
//     dest: 'public',
//     // disable: process.env.NODE_ENV === 'development',
//   },
// })

// const nextConfig= modWithPWA({
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: '*',
//           port: '',
//         //   pathname: '/account123/**',
//         },
//       ],
//     },
//   })

//   export default nextConfig;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
