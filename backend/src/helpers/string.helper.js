const slugify = require("slugify");

module.exports = {
  /**
   * Sinh URL slug từ một chuỗi (Hỗ trợ tiếng Việt cho dự án hiện tại).
   * Ví dụ: "Áo Thun Nam" -> "ao-thun-nam"
   */
  generateSlug: (text) => {
    return slugify(text, { lower: true, strict: true, locale: "vi" });
  },
};
