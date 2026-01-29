const CardAPI = require("./cardApi");
const config = require("./config");

module.exports = {
  CardAPI,
  config,

  // Default export - tạo instance từ config
  default: new CardAPI(),
};

// Hoặc có thể export như này:
// module.exports = CardAPI;
