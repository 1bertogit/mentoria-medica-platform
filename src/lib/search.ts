import { initialMedicalCases, type MedicalCase } from '@/lib/mock-data/cases';
import { initialArchiveItems, type ArchiveItem } from '@/lib/mock-data/archive';
import { articlesData, type Article } from '@/lib/mock-data/library';
import { featuredCourse, courseSections } from '@/lib/mock-data/academy';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'case' | 'article' | 'course' | 'archive';
  url: string;
  imageUrl?: string;
  metadata?: {
    author?: string;
    specialty?: string;
    category?: string;
    tags?: string[];
    createdAt?: string;
    views?: number;
    rating?: number;
  };
  relevanceScore: number;
}

export interface SearchFilters {
  type?: string[];
  specialty?: string[];
  category?: string[];
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}

function calculateRelevanceScore(item: Record<string, unknown>, query: string, type: string): number {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  let score = 0;
  
  // Title match (highest weight)
  const title = item.title.toLowerCase();
  searchTerms.forEach(term => {
    if (title.includes(term)) {
      score += title === term ? 100 : title.startsWith(term) ? 80 : 60;
    }
  });
  
  // Description/content match
  const description = (item.description || item.analysis || item.summary || '').toLowerCase();
  searchTerms.forEach(term => {
    if (description.includes(term)) {
      score += 30;
    }
  });
  
  // Author/source match
  const author = (item.author || item.submittedBy || item.source || '').toLowerCase();
  searchTerms.forEach(term => {
    if (author.includes(term)) {
      score += 25;
    }
  });
  
  // Specialty/category match
  const specialty = (item.specialty || item.category || '').toLowerCase();
  searchTerms.forEach(term => {
    if (specialty.includes(term)) {
      score += 40;
    }
  });
  
  // Tags match (for archive items)
  if (item.tags) {
    item.tags.forEach((tag: string) => {
      searchTerms.forEach(term => {
        if (tag.toLowerCase().includes(term)) {
          score += 20;
        }
      });
    });
  }
  
  // Boost popular items
  if (item.views) {
    score += Math.min(item.views / 100, 10);
  }
  
  if (item.rating) {
    score += item.rating * 2;
  }
  
  return score;
}

function applyFilters(results: SearchResult[], filters?: SearchFilters): SearchResult[] {
  if (!filters) return results;
  
  return results.filter(result => {
    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(result.type)) return false;
    }
    
    // Specialty filter
    if (filters.specialty && filters.specialty.length > 0) {
      if (!result.metadata?.specialty || !filters.specialty.includes(result.metadata.specialty)) {
        return false;
      }
    }
    
    // Category filter  
    if (filters.category && filters.category.length > 0) {
      if (!result.metadata?.category || !filters.category.includes(result.metadata.category)) {
        return false;
      }
    }
    
    return true;
  });
}

export async function searchAll(options: SearchOptions): Promise<{ results: SearchResult[], total: number }> {
  const { query, filters, limit = 20, offset = 0 } = options;
  
  if (!query.trim()) {
    return { results: [], total: 0 };
  }
  
  let allResults: SearchResult[] = [];
  
  // Search cases
  initialMedicalCases.forEach(case_ => {
    const score = calculateRelevanceScore(case_, query, 'case');
    if (score > 0) {
      allResults.push({
        id: case_.id,
        title: case_.title,
        description: case_.analysis || `Caso de ${case_.specialty} submetido por ${case_.submittedBy}`,
        type: 'case',
        url: `/cases/${case_.id}`,
        imageUrl: case_.imageUrl,
        metadata: {
          author: case_.submittedBy,
          specialty: case_.specialty,
          createdAt: case_.createdAt,
        },
        relevanceScore: score
      });
    }
  });
  
  // Search articles
  articlesData.forEach(article => {
    const score = calculateRelevanceScore(article, query, 'article');
    if (score > 0) {
      allResults.push({
        id: article.id.toString(),
        title: article.title,
        description: article.summary || article.abstract,
        type: 'article',
        url: `/library/${article.id}`,
        imageUrl: article.imageUrl,
        metadata: {
          author: article.author || article.authors,
          specialty: article.specialty,
          createdAt: article.publishedAt || `${article.year}`,
        },
        relevanceScore: score
      });
    }
  });
  
  // Search courses (featured course)
  const featuredScore = calculateRelevanceScore(featuredCourse, query, 'course');
  if (featuredScore > 0) {
    allResults.push({
      id: featuredCourse.id.toString(),
      title: featuredCourse.title,
      description: featuredCourse.description || `Curso de ${featuredCourse.category}`,
      type: 'course',
      url: `/academy/${featuredCourse.id}`,
      imageUrl: featuredCourse.imageUrl,
      metadata: {
        author: featuredCourse.instructor,
        category: featuredCourse.category,
        rating: featuredCourse.rating,
      },
      relevanceScore: featuredScore
    });
  }
  
  // Search courses in sections
  courseSections.forEach(section => {
    section.courses.forEach(course => {
      const score = calculateRelevanceScore(course, query, 'course');
      if (score > 0) {
        allResults.push({
          id: course.id.toString(),
          title: course.title,
          description: course.description || `Curso de ${course.category || section.title}`,
          type: 'course',
          url: `/academy/${course.id}`,
          imageUrl: course.imageUrl,
          metadata: {
            category: course.category || section.title,
          },
          relevanceScore: score
        });
      }
    });
  });
  
  // Search archive
  initialArchiveItems.forEach(item => {
    const score = calculateRelevanceScore(item, query, 'archive');
    if (score > 0) {
      allResults.push({
        id: item.id.toString(),
        title: item.title,
        description: item.description.split('\n')[0],
        type: 'archive',
        url: `/archive/${item.id}`,
        metadata: {
          category: item.category,
          tags: item.tags,
          createdAt: item.createdAt,
          views: item.views,
        },
        relevanceScore: score
      });
    }
  });
  
  // Apply filters
  allResults = applyFilters(allResults, filters);
  
  // Sort by relevance score
  allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Apply pagination
  const total = allResults.length;
  const paginatedResults = allResults.slice(offset, offset + limit);
  
  return { results: paginatedResults, total };
}

export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }
  
  const suggestions = new Set<string>();
  const searchTerm = query.toLowerCase();
  
  // Get suggestions from titles
  [...initialMedicalCases, ...articlesData, ...initialArchiveItems].forEach(item => {
    const title = item.title.toLowerCase();
    if (title.includes(searchTerm) && suggestions.size < limit) {
      suggestions.add(item.title);
    }
  });
  
  // Get suggestions from specialties
  const specialties = [
    'Rinoplastia', 'Mamoplastia', 'Blefaroplastia', 'Lifting',
    'Cirurgia Plástica', 'Dermatologia', 'Medicina Estética'
  ];
  
  specialties.forEach(specialty => {
    if (specialty.toLowerCase().includes(searchTerm) && suggestions.size < limit) {
      suggestions.add(specialty);
    }
  });
  
  return Array.from(suggestions).slice(0, limit);
}