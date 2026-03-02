/**
 * @fileoverview Presentation component for settings page.
 */

'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, BellOff, Wifi, WifiOff, RefreshCw } from 'lucide-react';

/** Props for SettingsView */
interface SettingsViewProps {
  notificationsEnabled: boolean;
  notificationsSupported: boolean;
  isOnline: boolean;
  pendingSyncCount: number;
  isSyncing: boolean;
  onEnableNotifications: () => void;
  onDisableNotifications: () => void;
  onSyncNow: () => void;
}

/** Renders the settings page UI */
export function SettingsView({
  notificationsEnabled,
  notificationsSupported,
  isOnline,
  pendingSyncCount,
  isSyncing,
  onEnableNotifications,
  onDisableNotifications,
  onSyncNow,
}: SettingsViewProps) {
  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações Push</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Receba lembretes de despesas recorrentes direto no seu dispositivo.
          </p>

          {!notificationsSupported ? (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Notificações push não são suportadas neste navegador.
            </p>
          ) : notificationsEnabled ? (
            <div className="flex items-center gap-3">
              <Bell className="text-green-500" size={20} />
              <span className="text-sm text-green-600 dark:text-green-400">
                Notificações ativadas
              </span>
              <Button variant="ghost" size="sm" onClick={onDisableNotifications}>
                <BellOff size={14} />
                Desativar
              </Button>
            </div>
          ) : (
            <Button onClick={onEnableNotifications}>
              <Bell size={16} />
              Ativar Notificações
            </Button>
          )}
        </div>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Sincronização</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <>
                <Wifi className="text-green-500" size={20} />
                <span className="text-sm text-green-600 dark:text-green-400">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="text-red-500" size={20} />
                <span className="text-sm text-red-600 dark:text-red-400">Offline</span>
              </>
            )}
          </div>

          {pendingSyncCount > 0 && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {pendingSyncCount} operação(ões) pendente(s)
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={onSyncNow}
                disabled={!isOnline || isSyncing}
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
            </div>
          )}

          {pendingSyncCount === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Tudo sincronizado!</p>
          )}
        </div>
      </Card>
    </div>
  );
}
