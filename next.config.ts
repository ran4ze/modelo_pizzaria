import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As imagens locais já estão otimizadas em WebP. Servi-las diretamente
  // mantém o projeto portátil e evita depender do serviço de transformação
  // de imagens do ambiente de hospedagem durante o desenvolvimento local.
  images: { unoptimized: true },
};

export default nextConfig;
