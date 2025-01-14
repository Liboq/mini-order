  /** @type {import('next').NextConfig} */
  const nextConfig = {
    output: 'standalone',
    rewrites: async () => {
      return [
        {
          source: '/api/:path*',  // 前端访问路径
          destination: 'http://127.0.0.1:6666/api/:path*', // 目标服务器地址
        }]
      },
      images: {
        domains: [,'github.com'], // 在这里添加你的图片域名
      },
  };

  export default nextConfig;
