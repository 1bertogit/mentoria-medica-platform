import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { libraryOperations, isDynamoDBConfigured } from '@/lib/aws/dynamodb-client';
import { libraryResources } from '@/lib/mock-data/library';

export async function GET(request: NextRequest) {
  try {
    // Check if DynamoDB is configured
    if (!isDynamoDBConfigured()) {
      // Return mock data if DynamoDB is not configured
      return NextResponse.json({
        source: 'mock',
        items: libraryResources,
      });
    }

    // Get category from query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Fetch from DynamoDB
    let items;
    if (category) {
      items = await libraryOperations.getItemsByCategory(category);
    } else {
      items = await libraryOperations.getAllItems();
    }

    // If no items found in DynamoDB, return mock data
    if (!items || items.length === 0) {
      return NextResponse.json({
        source: 'mock',
        message: 'No items in DynamoDB, returning mock data',
        items: libraryResources,
      });
    }

    return NextResponse.json({
      source: 'dynamodb',
      items,
    });
  } catch (error) {
    logger.error('Error in library API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch library items',
        source: 'mock',
        items: libraryResources,
      },
      { status: 200 } // Return 200 with mock data instead of error
    );
  }
}