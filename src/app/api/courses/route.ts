import { NextRequest, NextResponse } from 'next/server';
import { courseDb, initializeSampleData } from '@/lib/db/local-storage';

// Initialize sample data on first run
initializeSampleData();

// GET /api/courses - List all courses
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    
    let courses = courseDb.getAll();
    
    // Filter by category if provided
    if (category) {
      courses = courses.filter((c: any) => c.category === category);
    }
    
    // Filter by status if provided
    if (status) {
      courses = courses.filter((c: any) => c.status === status);
    }
    
    // Filter by featured if provided
    if (featured !== null) {
      const isFeatured = featured === 'true';
      courses = courses.filter((c: any) => c.featured === isFeatured);
    }
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, instructor, price, category, level, duration, status = 'draft' } = body;
    
    // Validate required fields
    if (!title || !instructor || !price) {
      return NextResponse.json(
        { error: 'Title, instructor, and price are required' },
        { status: 400 }
      );
    }
    
    // Create course
    const newCourse = courseDb.create({
      title,
      description,
      instructor,
      price: parseFloat(price),
      category,
      level,
      duration,
      status,
      featured: false,
      students: 0,
      rating: 0,
      totalRatings: 0,
      modules: 0,
      lessons: 0,
      thumbnail: '/images/courses/default-thumb.jpg'
    });
    
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}