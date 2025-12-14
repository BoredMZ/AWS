// Live news fetching from NewsAPI
// Documentation: https://newsapi.org/

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo';
const NEWS_API_BASE = 'https://newsapi.org/v2';

export interface LiveNewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: string;
}

// Map regions to Philippine-specific search keywords
const regionKeywords = {
  'Luzon': 'Philippines weather',
  'Visayas': 'Philippines weather',
  'Mindanao': 'Philippines weather',
  'Metro Manila': 'Philippines weather Manila',
  'Calabarzon': 'Philippines agriculture',
  'Central Visayas': 'Philippines weather',
  'Western Visayas': 'Philippines weather',
  'Eastern Visayas': 'Philippines weather',
  'Bicol': 'Philippines weather',
  'Cagayan Valley': 'Philippines weather',
  'Cordillera': 'Philippines weather',
  'Ilocos': 'Philippines weather',
  'Central Luzon': 'Philippines weather',
  'Palawan': 'Philippines weather',
  'Zamboanga': 'Philippines weather',
  'Soccsksargen': 'Philippines weather',
};

// Map audience types to search keywords
const audienceKeywords = {
  students: 'Philippines',
  farmers: 'Philippines agriculture farming',
  government: 'Philippines',
};

export const fetchLivePhilippineNews = async (
  region: string | null,
  audienceType: 'students' | 'farmers' | 'government'
): Promise<LiveNewsItem[]> => {
  if (!region) return [];
  
  // Skip if using demo API key
  if (NEWS_API_KEY === 'demo') {
    console.warn('⚠️  Using demo API key. For live news, set NEXT_PUBLIC_NEWS_API_KEY environment variable');
    return [];
  }

  try {
    // Use simpler, broader search queries that will return results
    const searchQueries = [
      'Philippines weather news',
      'weather forecast Philippines',
      'climate Philippines',
    ];
    
    // Rotate through different search queries to get diverse results
    const searchQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];

    const response = await fetch(
      `${NEWS_API_BASE}/everything?` +
      `q=${encodeURIComponent(searchQuery)}` +
      `&sortBy=publishedAt` +
      `&language=en` +
      `&pageSize=10` +
      `&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return [];
    }

    return data.articles.map((article: any, index: number) => ({
      id: `${region}-${audienceType}-${index}`,
      title: article.title,
      description: article.description || article.content || 'No description available',
      source: article.source.name,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      category: audienceType,
    }));
  } catch (error) {
    console.error('Error fetching live news:', error);
    return [];
  }
};

export const fetchPhilippineHeadlines = async (): Promise<LiveNewsItem[]> => {
  if (NEWS_API_KEY === 'demo') {
    return [];
  }

  try {
    const response = await fetch(
      `${NEWS_API_BASE}/top-headlines?` +
      `country=ph` +
      `&category=weather` +
      `&pageSize=10` +
      `&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles) {
      return [];
    }

    return data.articles.map((article: any, index: number) => ({
      id: `ph-headline-${index}`,
      title: article.title,
      description: article.description || 'Breaking weather news',
      source: article.source.name,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      category: 'news',
    }));
  } catch (error) {
    console.error('Error fetching Philippine headlines:', error);
    return [];
  }
};
