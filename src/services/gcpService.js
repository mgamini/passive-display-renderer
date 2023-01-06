const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

const gcpService = {};

gcpService.Bucket = class Bucket {
  constructor(name) {
    this.name = name;

    this._bucket = storage.bucket(name);
  }

  async init() {
    try {
      const exists = await this._bucket.exists();

      if (!exists) {
        await this.create();
      }

      await this.get();
    } catch (e) {
      console.error(`Error initializing bucket ${this.name}`, e);
    }
  }

  async create() {
    await this._bucket.create();
    await this._bucket.makePrivate({ includeFiles: true });
  }

  async get() {
    return await this._bucket.get();
  }

  async createFile(fileName, data) {
    const file = this._bucket.file(fileName);
    await file.save(data);

    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 1 * 60 * 1000, // 1 minute
    };

    // Get a v4 signed URL for reading the file
    const [url] = await this._bucket.file(fileName).getSignedUrl(options);

    return url;
  }
};

// gcpService.getBucket = async (bucketName) => {
//   console.log("Render bucket - getting");
//   const bucket = storage.bucket(bucketName);

//   return await bucket.get();
// };

// gcpService.createBucket = async (bucketName) => {
//   console.log("Render bucket - creating");
//   const bucket = storage.bucket(bucketName);

//   await bucket.create();
//   await bucket.makePrivate({ includeFiles: true });

//   return bucket;
// };

// gcpService.createFile = async (bucket, fileName, data) => {
//   const file = bucket.file(fileName);
//   return await file.save(data);
// };

module.exports = gcpService;
