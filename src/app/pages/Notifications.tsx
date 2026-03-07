import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'comment' | 'like' | 'system';
  message: string;
  plantId?: string;
  createdAt: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'comment',
    message: 'Carlos Ruiz comentó en tu publicación de Manzanilla',
    plantId: '1',
    createdAt: new Date('2026-03-06'),
    read: false
  },
  {
    id: '2',
    type: 'like',
    message: '15 personas dieron like a tu planta Eucalipto',
    plantId: '2',
    createdAt: new Date('2026-03-05'),
    read: false
  },
  {
    id: '3',
    type: 'system',
    message: 'Bienvenido a HAMPIYURA. Completa tu perfil para obtener más visibilidad',
    createdAt: new Date('2026-03-04'),
    read: true
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment': return '💬';
      case 'like': return '❤️';
      case 'system': return '🔔';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Notificaciones {unreadCount > 0 && `(${unreadCount})`}</h2>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary hover:underline"
            >
              Marcar todas
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="mb-2">No tienes notificaciones</h3>
            <p className="text-muted-foreground">
              Te notificaremos cuando haya nueva actividad
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-colors ${
                  notification.read 
                    ? 'bg-card border-border' 
                    : 'bg-secondary border-primary/20'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    {notification.plantId ? (
                      <Link 
                        to={`/plant/${notification.plantId}`}
                        className="block hover:underline"
                      >
                        <p className={notification.read ? 'text-muted-foreground' : 'text-foreground'}>
                          {notification.message}
                        </p>
                      </Link>
                    ) : (
                      <p className={notification.read ? 'text-muted-foreground' : 'text-foreground'}>
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.createdAt.toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                        title="Marcar como leída"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-destructive"
                      title="Eliminar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
