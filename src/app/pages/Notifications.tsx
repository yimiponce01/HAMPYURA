import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface Notification {
  id: string;
  type: 'comment' | 'like' | 'system';
  message: string;
  plantId?: string;
  createdAt: Date;
  read: boolean;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  getUser();
}, []);

useEffect(() => {
  const fetchNotifications = async () => {
    setLoading(true); // 🔥 inicia carga

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setNotifications(data || []);
    }

    setLoading(false); // 🔥 termina carga
  };

  fetchNotifications();
}, []);



  const markAsRead = async (id: string) => {
  await supabase
    .from("notificaciones")
    .update({ leido: true })
    .eq("id", id);

  setNotifications(prev =>
    prev.map(n => n.id === id ? { ...n, leido: true } : n)
  );
};

  const markAllAsRead = async () => {
  if (!user) return;

  await supabase
    .from("notificaciones")
    .update({ leido: true })
    .eq("user_id", user.id);

  setNotifications(prev =>
    prev.map(n => ({ ...n, leido: true }))
  );
};

  const deleteNotification = async (id: string) => {
  await supabase
    .from("notificaciones")
    .delete()
    .eq("id", id);

  setNotifications(prev => prev.filter(n => n.id !== id));
};

window.dispatchEvent(new Event("notificationsUpdated"));

  const unreadCount = notifications.filter(n => !n.leido).length;

const getMessage = (n: any) => {
  if (n.tipo === "like") return "Alguien dio like a tu publicación";
  if (n.tipo === "comment") return "Comentaron tu publicación";
  if (n.tipo === "rating") return "Calificaron tu planta";
  if (n.tipo === "system") return "Bienvenido a HAMPIYURA. Completa tu perfil";
  return "📌 Nueva notificación";
};

const getNotificationIcon = (tipo: string) => {
  if (tipo === "like") return "❤️";
  if (tipo === "comment") return "💬";
  if (tipo === "rating") return "⭐";
  if (tipo === "system") return "🔔";
  return "📌";
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
        {loading ? (
          <div className="animate-pulse text-center py-16 text-muted-foreground">
            Cargando notificaciones...
          </div>
        ) : notifications.length === 0 ? (
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
                  notification.leido 
                    ? 'bg-card border-border' 
                    : 'bg-secondary border-primary/20'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-2xl">
                    {getNotificationIcon(notification.tipo)}
                  </div>
                  <div className="flex-1">
                    {notification.publicacion_id ? (
                      <Link 
                        to={`/plant/${notification.publicacion_id}`}
                        onClick={() => markAsRead(notification.id)}
                        className="block hover:underline"
                      >
                        <p className={notification.leido ? 'text-muted-foreground' : 'text-foreground'}>
                          {getMessage(notification)}
                        </p>
                      </Link>
                    ) : (
                      <p className={notification.leido ? 'text-muted-foreground' : 'text-foreground'}>
                        {getMessage(notification)}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.leido && (
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
