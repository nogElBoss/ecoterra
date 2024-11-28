/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certificados', 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certificados', 'server.crt')),
    },
  },
}

module.exports = nextConfig
