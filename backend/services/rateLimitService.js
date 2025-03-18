import PQueue from 'p-queue';

class RateLimitService {
  constructor() {
    this.queue = new PQueue({ intervalCap: 50, interval: 1000 }); // 50 requests per second
    this.API_URL = 'https://api.themoviedb.org/3';
    this.ACCESS_TOKEN = process.env.TMDB_API_KEY;
    this.MAX_RETRIES = 5;  // Maximum retry attempts on 429
  }

  // Helper function to add delay (used for retry logic)
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchWithRateLimit(endpoint, retries = 0) {
    return this.queue.add(async () => {
      const response = await fetch(`${this.API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 429) {
        // If rate-limited, retry with exponential backoff
        if (retries < this.MAX_RETRIES) {
          const delayTime = Math.pow(2, retries) * 1000;  // Exponential backoff (e.g., 1s, 2s, 4s, etc.)
          console.log(`Rate limit hit. Retrying in ${delayTime / 1000}s...`);
          await this.delay(delayTime);  // Wait for the delay
          return this.fetchWithRateLimit(endpoint, retries + 1);  // Retry the request
        } else {
          throw new Error('Maximum retry attempts reached due to rate-limiting (429).');
        }
      }

      if (!response.ok) {
        throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
      }

      return await response.json();  // Return the parsed JSON data if successful
    });
  }
}

export const rateLimitService = new RateLimitService();
