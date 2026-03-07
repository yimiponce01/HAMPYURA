import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Users, FileText, Flag, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { mockPlants } from '../data/mockData';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-6">
            No tienes permisos para acceder a esta sección
          </p>
          <Link to="/" className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: 342,
    totalPlants: mockPlants.length,
    totalReports: 5,
    activeUsers: 89
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-4 hover:opacity-80"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="mb-2">Panel de Administrador</h1>
          <p className="text-primary-foreground/80">
            Gestiona la plataforma HAMPIYURA
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className="bg-card border border-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-2xl">{stats.totalUsers}</span>
            </div>
            <h4 className="text-muted-foreground">Usuarios Totales</h4>
          </motion.div>

          <motion.div 
            className="bg-card border border-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-primary" />
              <span className="text-2xl">{stats.totalPlants}</span>
            </div>
            <h4 className="text-muted-foreground">Plantas Publicadas</h4>
          </motion.div>

          <motion.div 
            className="bg-card border border-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Flag className="w-8 h-8 text-destructive" />
              <span className="text-2xl">{stats.totalReports}</span>
            </div>
            <h4 className="text-muted-foreground">Reportes Pendientes</h4>
          </motion.div>

          <motion.div 
            className="bg-card border border-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <span className="text-2xl">{stats.activeUsers}</span>
            </div>
            <h4 className="text-muted-foreground">Usuarios Activos</h4>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="mb-2">Gestión de Usuarios</h3>
              <p className="text-muted-foreground mb-4">
                Administra usuarios, roles y permisos de la plataforma
              </p>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-opacity">
                Ver Usuarios
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="mb-2">Moderación de Contenido</h3>
              <p className="text-muted-foreground mb-4">
                Revisa y modera las publicaciones de plantas medicinales
              </p>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-opacity">
                Moderar Contenido
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
              <Flag className="w-10 h-10 text-destructive mb-4" />
              <h3 className="mb-2">Gestión de Reportes</h3>
              <p className="text-muted-foreground mb-4">
                Revisa y resuelve reportes de contenido inapropiado
              </p>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-opacity">
                Ver Reportes
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="mt-8 bg-card border border-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {[
              { user: 'María González', action: 'publicó una nueva planta', time: 'Hace 2 horas' },
              { user: 'Carlos Ruiz', action: 'reportó contenido', time: 'Hace 4 horas' },
              { user: 'Ana Torres', action: 'se registró en la plataforma', time: 'Hace 6 horas' },
              { user: 'Dr. Pedro Sánchez', action: 'publicó un artículo', time: 'Hace 1 día' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm">
                    <span className="text-foreground">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
