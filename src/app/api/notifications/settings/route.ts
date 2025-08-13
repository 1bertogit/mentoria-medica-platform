import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { defaultNotificationSettings, type NotificationSettings } from '@/lib/mock-data/notifications';

// In-memory storage for demo purposes
// In production, this would be stored in a database
const userSettings: Record<string, NotificationSettings> = {
  '1': defaultNotificationSettings
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';

    const settings = userSettings[userId] || defaultNotificationSettings;

    return NextResponse.json({ settings });
  } catch (error) {
    logger.error('Get notification settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId || !settings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate settings structure
    const requiredFields = ['emailNotifications', 'pushNotifications', 'inAppNotifications'];
    for (const field of requiredFields) {
      if (!settings[field] || typeof settings[field] !== 'object') {
        return NextResponse.json(
          { error: `Invalid settings structure: missing ${field}` },
          { status: 400 }
        );
      }
    }

    // Store settings
    userSettings[userId] = {
      userId,
      ...settings
    };

    return NextResponse.json({ 
      success: true, 
      settings: userSettings[userId] 
    });
  } catch (error) {
    logger.error('Update notification settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    // Reset to default settings
    userSettings[userId] = {
      ...defaultNotificationSettings,
      userId
    };

    return NextResponse.json({ 
      success: true, 
      settings: userSettings[userId] 
    });
  } catch (error) {
    logger.error('Reset notification settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}