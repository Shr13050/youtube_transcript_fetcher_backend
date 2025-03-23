// apiKeyManager.js
export default class ApiKeyManager {
    constructor(keys) {
      if (!Array.isArray(keys) || keys.length === 0) {
        throw new Error("API keys must be provided as a non-empty array.");
      }
      this.keys = keys;
      this.currentIndex = 0;
    }
  
    getNextKey() {
      const key = this.keys[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      return key;
    }
  }
  