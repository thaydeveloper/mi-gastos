/**
 * @fileoverview Container for the settings page.
 * Manages push notification subscription and offline sync.
 */

'use client';

import { useState, useEffect } from 'react';
import { useOfflineSync } from '@/lib/hooks/useOfflineSync';
import { SettingsView } from '../presentation/SettingsView';

/** Container managing settings logic */
export function SettingsContainer() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineSync();

  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setNotificationsSupported(supported);
    if (supported) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidKey) {
      console.error('VAPID public key not configured');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    const subJson = subscription.toJSON();
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        keys: subJson.keys,
      }),
    });

    setNotificationsEnabled(true);
  };

  const handleDisableNotifications = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
    setNotificationsEnabled(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gerencie notificações e sincronização
        </p>
      </div>

      <SettingsView
        notificationsEnabled={notificationsEnabled}
        notificationsSupported={notificationsSupported}
        isOnline={isOnline}
        pendingSyncCount={pendingCount}
        isSyncing={isSyncing}
        onEnableNotifications={handleEnableNotifications}
        onDisableNotifications={handleDisableNotifications}
        onSyncNow={syncNow}
      />
    </div>
  );
}

/**
 * Converts a URL-safe base64 string to a Uint8Array for VAPID key.
 * @param base64String - URL-safe base64 encoded string
 * @returns Uint8Array for use as applicationServerKey
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
