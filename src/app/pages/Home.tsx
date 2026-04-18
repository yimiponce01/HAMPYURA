import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Bell, User } from 'lucide-react';
import { PlantCard } from '../components/PlantCard';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("publicaciones")
        .select(`
          *,
          likes(count),
          vistas(count),
          ratings(rating)
        `)
        .eq("estado", "aprobado")
        .order("created_at", { ascending: false });

      const plantsWithStats = (data || []).map((plant: any) => {
  const likes = plant.likes?.[0]?.count || 0;
  const vistas = plant.vistas?.[0]?.count || 0;
      const ratingsArray = Array.isArray(plant.ratings) ? plant.ratings : [];
      const promedio =
        ratingsArray.length > 0
          ? ratingsArray.reduce((acc: number, r: any) => acc + r.rating, 0) /
            ratingsArray.length
          : 0;


      return {
        ...plant,
        likesCount: likes,
        vistasCount: vistas,
        ratingPromedio: promedio,
      };
    });

    setPlants(plantsWithStats);
      setLoading(false);
    };

    fetchPlants();


  }, []);


  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'plant' | 'disease'>('plant');
  const { isAuthenticated } = useAuth();

  


  const filteredPlants = plants.filter(plant => {
    const query = searchQuery.toLowerCase();

    if (searchType === 'plant') {
      return plant.nombre_planta?.toLowerCase().includes(query) ||
        plant.nombre_cientifico?.toLowerCase().includes(query);
    } else {
      return plant.enfermedades?.some((d: string) =>
        d.toLowerCase().includes(query)
      );
    }
  });

  if (loading) {
    return <p className="text-center mt-10">Cargando plantas...</p>;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <motion.header
        className="bg-card border-b border-border sticky top-0 z-30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
              <h1 className="text-xl">HAMPIYURA</h1>
            </div>
            <div className="flex items-center gap-4">

              {/* 👤 USUARIO */}
              <button
                className="hidden md:block"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/profile");
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <User className="w-5 h-5" />
              </button>

              {/* 🔔 SOLO SI LOGEADO */}
              {isAuthenticated && (
                <Link
                  to="/notifications"
                  className="p-2 hover:bg-secondary rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
              )}

              {/* 📄 ARTÍCULOS */}
              <Link
                to="/articles"
                className="text-sm text-primary hover:underline"
              >
                Artículos
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchType === 'plant' ? 'Buscar plantas...' : 'Buscar por enfermedad...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-background text-foreground placeholder:text-muted-foreground rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Search Type Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setSearchType('plant')}
                className={`flex-1 py-2 px-4 rounded-full transition-colors ${searchType === 'plant'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
              >
                Por Planta
              </button>
              <button
                onClick={() => setSearchType('disease')}
                className={`flex-1 py-2 px-4 rounded-full transition-colors ${searchType === 'disease'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
              >
                Por Enfermedad
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="mb-2">
            {searchQuery ? 'Resultados de búsqueda' : 'Plantas Medicinales'}
          </h2>
          <p className="text-muted-foreground">
            {searchQuery
              ? `${filteredPlants.length} planta${filteredPlants.length !== 1 ? 's' : ''} encontrada${filteredPlants.length !== 1 ? 's' : ''}`
              : 'Descubre el poder curativo de la naturaleza'
            }
          </p>
        </div>

        {filteredPlants.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="mb-2">No se encontraron resultados</h3>
            <p className="text-muted-foreground">
              Intenta con otra búsqueda
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {(filteredPlants as any[]).map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlantCard
                  plant={{
                    id: plant.id,
                    nombre_planta: plant.nombre_planta,
                    nombre_cientifico: plant.nombre_cientifico,
                    descripcion: plant.descripcion,
                    imagenes: plant.imagenes,
                    enfermedades: plant.enfermedades || [],
                    propiedades: plant.propiedades || [],
                    preparacion: plant.preparacion || [],
                    likesCount: plant.likesCount,
                    vistasCount: plant.vistasCount,
                    ratingPromedio: plant.ratingPromedio,
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}