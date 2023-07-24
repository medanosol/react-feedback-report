var progress = require("postcss-progress");

module.exports = {
  plugins: [
    progress.start(),
    require("tailwindcss")("./tailwind.config.js"),
    require("autoprefixer"),
    progress.stop(),
  ],
};
