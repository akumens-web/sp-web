import createNextIntlPlugin from "next-intl/plugin";
const staticExport = process.env.STATIC_EXPORT === "1";
export default createNextIntlPlugin("./src/i18n/request.ts")({
  output: staticExport ? "export" : "standalone",
  ...(staticExport
    ? {
        outputFileTracingRoot: process.cwd(),
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
});
