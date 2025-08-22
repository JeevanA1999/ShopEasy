export class StorageHelper {
  static storage = new Map();

  static setItem(key, value) {
    try {
      const data = { value, timestamp: Date.now() };
      this.storage.set(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  static getItem(key) {
    try {
      const item = this.storage.get(key);
      if (!item) return null;
      const data = JSON.parse(item);
      return data.value;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      this.storage.delete(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
}