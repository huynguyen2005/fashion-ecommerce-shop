const { cloudinary } = require("../configs/cloudinary.config");

class CloudinaryService {
  static uploadAvatar(buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "fashion-ecommerce/avatars",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(buffer);
    });
  }
}

module.exports = CloudinaryService;
