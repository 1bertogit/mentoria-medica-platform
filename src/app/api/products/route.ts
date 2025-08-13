import { NextRequest, NextResponse } from 'next/server';
import { productDb, initializeSampleData } from '@/lib/db/local-storage';

// Initialize sample data on first run
initializeSampleData();

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    
    let products = productDb.getAll();
    
    // Filter by search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: any) => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by category if provided
    if (category) {
      products = products.filter((p: any) => p.category === category);
    }
    
    // Filter by status if provided
    if (status) {
      products = products.filter((p: any) => p.status === status);
    }
    
    // Filter by featured if provided
    if (featured !== null) {
      const isFeatured = featured === 'true';
      products = products.filter((p: any) => p.featured === isFeatured);
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      category, 
      type, 
      features,
      status = 'active' 
    } = body;
    
    // Validate required fields
    if (!name || !price || !category || !type) {
      return NextResponse.json(
        { error: 'Name, price, category and type are required' },
        { status: 400 }
      );
    }
    
    // Create product
    const newProduct = productDb.create({
      name,
      description,
      price: parseFloat(price),
      category,
      type,
      features: features || [],
      status,
      featured: false,
      sales: 0,
      revenue: 0,
      image: '/images/products/default.jpg'
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}