/** Static export for GitHub Pages. Set NEXT_PUBLIC_BASE_PATH="" when using a custom domain. */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Alfonzo-Louw-Portfolio';
export default {
  output: 'export',
  trailingSlash: true,
  basePath: base || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: base },
};
