const router = require('./src/routes').default;
const Sitemap = require('react-router-sitemap').default;

function generateSitemap() {
  return (
    new Sitemap(router)
      .build('https://meli-flow.app')
      .save('./public/sitemap.xml')
  );
}

generateSitemap();
