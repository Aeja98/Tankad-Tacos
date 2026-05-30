const { defineConfig } = require("vite");
const { resolve } = require("path");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        menu: resolve(__dirname, "menu.html"),
        reviews: resolve(__dirname, "reviews.html"),
        contact: resolve(__dirname, "contact.html")
      }
    }
  }
});