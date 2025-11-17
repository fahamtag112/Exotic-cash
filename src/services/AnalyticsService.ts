// Analytics Service for tracking user actions and events
interface AnalyticsEvent {
  eventName: string;
  timestamp: number;
  userId?: string | number;
  data?: Record<string, unknown>;
  page?: string;
  userAgent?: string;
}

export class AnalyticsService {
  private static events: AnalyticsEvent[] = [];
  private static readonly MAX_EVENTS = 1000;

  static trackPageView(pageName: string) {
    this.recordEvent({
      eventName: 'page_view',
      page: pageName,
      data: {
        url: window.location.href,
        title: document.title,
      },
    });
  }

  static trackUserAction(action: string, data?: Record<string, unknown>) {
    this.recordEvent({
      eventName: `user_${action}`,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
    });
  }

  static trackLogin(userId: string | number, method: string) {
    this.recordEvent({
      eventName: 'user_login',
      userId,
      data: { method, timestamp: new Date().toISOString() },
    });
  }

  static trackLogout(userId: string | number) {
    this.recordEvent({
      eventName: 'user_logout',
      userId,
      data: { timestamp: new Date().toISOString() },
    });
  }

  static trackTransaction(userId: string | number, type: string, amount: number) {
    this.recordEvent({
      eventName: 'transaction',
      userId,
      data: {
        type,
        amount,
        timestamp: new Date().toISOString(),
      },
    });
  }

  static trackFeatureUsage(feature: string, userId?: string | number) {
    this.recordEvent({
      eventName: `feature_${feature}`,
      userId,
      data: { timestamp: new Date().toISOString() },
    });
  }

  static trackError(error: Error, context?: Record<string, unknown>) {
    this.recordEvent({
      eventName: 'error',
      data: {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private static recordEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'userAgent'>) {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    this.events.push(analyticsEvent);

    // Keep only the latest events
    if (this.events.length > this.MAX_EVENTS) {
      this.events.shift();
    }

    // Save to localStorage
    this.saveToLocalStorage();

    // Log in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', analyticsEvent);
    }
  }

  private static saveToLocalStorage() {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(-100)));
    } catch (error) {
      console.warn('Could not save analytics to localStorage:', error);
    }
  }

  static getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  static getEventsByName(eventName: string): AnalyticsEvent[] {
    return this.events.filter((e) => e.eventName === eventName);
  }

  static getEventsByUser(userId: string | number): AnalyticsEvent[] {
    return this.events.filter((e) => e.userId === userId);
  }

  static exportEvents(): string {
    const data = {
      exportDate: new Date().toISOString(),
      totalEvents: this.events.length,
      events: this.events,
    };
    return JSON.stringify(data, null, 2);
  }

  static clearEvents() {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }

  static generateReport() {
    const report = {
      totalEvents: this.events.length,
      uniqueUsers: new Set(this.events.filter((e) => e.userId).map((e) => e.userId)).size,
      eventBreakdown: this.getEventBreakdown(),
      timeRange: {
        start: this.events.length > 0 ? new Date(this.events[0].timestamp).toISOString() : null,
        end: this.events.length > 0 ? new Date(this.events[this.events.length - 1].timestamp).toISOString() : null,
      },
    };
    return report;
  }

  private static getEventBreakdown() {
    const breakdown: Record<string, number> = {};
    for (const event of this.events) {
      breakdown[event.eventName] = (breakdown[event.eventName] || 0) + 1;
    }
    return breakdown;
  }
}
