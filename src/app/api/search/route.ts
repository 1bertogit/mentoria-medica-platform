import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { searchAll, getSearchSuggestions } from '@/lib/search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type');
    const specialty = searchParams.get('specialty');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const suggestions = searchParams.get('suggestions') === 'true';

    // Handle suggestions request
    if (suggestions) {
      const suggestionResults = await getSearchSuggestions(query, limit);
      return NextResponse.json({ suggestions: suggestionResults });
    }

    // Handle regular search
    const filters = {
      type: type ? type.split(',') : undefined,
      specialty: specialty ? specialty.split(',') : undefined,
      category: category ? category.split(',') : undefined,
    };

    const searchResults = await searchAll({
      query,
      filters,
      limit,
      offset,
    });

    return NextResponse.json({
      results: searchResults.results,
      total: searchResults.total,
      query,
      filters,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < searchResults.total,
      },
    });
  } catch (error) {
    logger.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}