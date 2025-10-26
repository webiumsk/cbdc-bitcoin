// generate-sitemap.js
// Automatic sitemap generator for cbdc.icu
// Languages: EN (default), SK, ES, HU

import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = "https://cbdc.icu";
const currentDate = new Date().toISOString().split("T")[0];
const languages = ["en", "sk", "es", "hu"];
const defaultLang = "en";

// Import CBDC data
let cbdcData;
try {
  const dataPath = join(__dirname, "src/data/cbdc-data.json");
  cbdcData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
} catch (err) {
  console.warn("⚠️  CBDC data not found, generating basic sitemap");
  cbdcData = { countries: [] };
}

function getUrlForLang(path, lang) {
  if (lang === defaultLang) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${lang}${path}`;
}

function generateLanguageAlternates(basePath) {
  let alternates = "";

  languages.forEach((lang) => {
    const url = getUrlForLang(basePath, lang);
    alternates += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>\n`;
  });

  // Add x-default (points to default language)
  const defaultUrl = getUrlForLang(basePath, defaultLang);
  alternates += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>\n`;

  return alternates;
}

function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';

  // Homepage in all languages
  languages.forEach((lang) => {
    const url = getUrlForLang("/", lang);

    xml += "  <url>\n";
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>1.0</priority>\n";
    xml += generateLanguageAlternates("/");
    xml += "  </url>\n\n";
  });

  // Country detail pages (if they exist)
  if (cbdcData.countries && cbdcData.countries.length > 0) {
    cbdcData.countries.forEach((country) => {
      languages.forEach((lang) => {
        const path = `/country/${country.id}`;
        const url = getUrlForLang(path, lang);

        xml += "  <url>\n";
        xml += `    <loc>${url}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += "    <changefreq>monthly</changefreq>\n";
        xml += "    <priority>0.8</priority>\n";
        xml += generateLanguageAlternates(path);
        xml += "  </url>\n\n";
      });
    });
  }

  // Static pages (optional)
  const staticPages = [
    { path: "/about", priority: "0.6", changefreq: "monthly" },
    { path: "/resources", priority: "0.7", changefreq: "weekly" },
  ];

  staticPages.forEach((page) => {
    languages.forEach((lang) => {
      const url = getUrlForLang(page.path, lang);

      xml += "  <url>\n";
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += generateLanguageAlternates(page.path);
      xml += "  </url>\n\n";
    });
  });

  xml += "</urlset>";
  return xml;
}

// Generate and save
try {
  const sitemap = generateSitemap();
  const outputPath = join(__dirname, "public/sitemap.xml");

  // Create public directory if it doesn't exist
  const publicDir = join(__dirname, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemap);

  const countriesCount = cbdcData.countries?.length || 0;
  const totalUrls = languages.length * (1 + countriesCount + 2); // homepage + countries + 2 static pages

  console.log("✅ Sitemap generated successfully!");
  console.log(`📄 Total URLs: ${totalUrls}`);
  console.log(`🌍 Languages: ${languages.join(", ")}`);
  console.log(`🏠 Default language: ${defaultLang}`);
  console.log(`🗺️  Countries: ${countriesCount}`);
  console.log(`📍 Output: ${outputPath}`);
  console.log(`📅 Last modified: ${currentDate}`);
} catch (err) {
  console.error("❌ Error generating sitemap:", err.message);
  process.exit(1);
}
