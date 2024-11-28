const fs = require('fs');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs', 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'server.crt')),
    },
  },
}

module.exports = nextConfig
