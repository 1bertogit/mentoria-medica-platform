import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { 
  getNotificationsByUser, 
  addNotification,
  markNotificationAsRead,
  deleteNotification,
  getNotificationStats
} from '@/lib/mock-data/notifications';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    let notifications = getNotificationsByUser(userId);

    // Filter by category
    if (category && category !== 'all') {
      notifications = notifications.filter(n => n.category === category);
    }

    // Filter unread only
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.isRead);
    }

    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const total = notifications.length;
    const paginatedNotifications = notifications.slice(offset, offset + limit);

    // Get stats
    const stats = getNotificationStats(userId);

    return NextResponse.json({
      notifications: paginatedNotifications,
      total,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    logger.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, resourceType, resourceId, resourceTitle, actionUrl, priority, category, metadata } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification = addNotification({
      userId,
      type,
      title,
      message,
      resourceType,
      resourceId,
      resourceTitle,
      actionUrl,
      isRead: false,
      priority: priority || 'medium',
      category: category || 'system',
      metadata
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    logger.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'mark_read':
        markNotificationAsRead(id);
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error('Update notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing notification ID' },
        { status: 400 }
      );
    }

    deleteNotification(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Delete notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}