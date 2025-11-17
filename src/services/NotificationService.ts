// Notification Service for browser push notifications
export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }

    return false;
  }

  static sendNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options,
      });
    }
  }

  static notifyLogin(userName: string) {
    this.sendNotification('Welcome!', {
      body: `Welcome back, ${userName}! You've successfully logged in.`,
      tag: 'login-notification',
    });
  }

  static notifyTransaction(type: string, amount: string) {
    this.sendNotification('Transaction Update', {
      body: `${type} of ${amount} completed successfully.`,
      tag: 'transaction-notification',
    });
  }

  static notifyAlert(title: string, message: string) {
    this.sendNotification(title, {
      body: message,
      tag: 'alert-notification',
    });
  }

  static notifyDataUpdate(dataType: string) {
    this.sendNotification('Data Updated', {
      body: `${dataType} has been updated.`,
      tag: 'data-update-notification',
    });
  }
}
