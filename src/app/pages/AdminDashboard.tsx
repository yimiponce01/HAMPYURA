import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, FileText, Flag, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";


export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

const [stats, setStats] = useState({
  totalUsers: 0,
  totalPlants: 0,
  totalReports: 0,
  activeUsers: 0
});

useEffect(() => {
  const fetchStats = async () => {

    // usuarios
    const { count: usersCount } = await supabase
      .from("perfiles")
      .select("*", { count: "exact", head: true });

    // publicaciones
    const { count: plantsCount } = await supabase
      .from("publicaciones")
      .select("*", { count: "exact", head: true });

    // reportes
    const { count: reportsCount } = await supabase
      .from("reportes")
      .select("*", { count: "exact", head: true })
      .eq("estado", "pendiente");

    // 🔥 ACTIVOS BIEN CALCULADO
    const { data: notifData } = await supabase
      .from("notificaciones")
      .select("actor_id");

    const uniqueUsers = new Set(notifData?.map(n => n.actor_id));
    const activeUsers = uniqueUsers.size;

    setStats({
      totalUsers: usersCount || 0,
      totalPlants: plantsCount || 0,
      totalReports: reportsCount || 0,
      activeUsers: activeUsers
    });
  };

  fetchStats();
}, []);

const [actividad, setActividad] = useState<any[]>([]);

  useEffect(() => {
  const fetchActividad = async () => {
    const { data, error } = await supabase
      .from("notificaciones")
      .select('*,actor:perfiles!notificaciones_actor_id_fkey(nombre)')
      .in("tipo", ["publicacion", "reporte", "registro"]) // 👈 SOLO ESTOS
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error actividad:", error);
      return;
    }

    console.log("ACTIVIDAD:", data); // 👈 DEBUG
    setActividad(data || []);
  };

  fetchActividad();
}, []);

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
              <button
                onClick={() => navigate("/admin/moderacion")}
                className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
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
              <button
                onClick={() => navigate("/admin/reportes")}
                className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
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
              {actividad.map((a, i) => (
                <div key={i} className="flex justify-between py-2">
                  <p>
                    <b>{a.actor?.nombre || "Usuario"}</b>{ " " }
                    {a.tipo === "publicacion" && "publicó una planta"}
                    {a.tipo === "reporte" && "reportó contenido"}
                    {a.tipo === "registro" && "se registró"}
                  </p>
                  <span>{new Date(a.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
}
