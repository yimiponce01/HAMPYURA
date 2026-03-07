import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { PlantCard } from '../components/PlantCard';
import { mockPlants } from '../data/mockData';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'plant' | 'disease'>('plant');
  const { isAuthenticated } = useAuth();

  const filteredPlants = mockPlants.filter(plant => {
    const query = searchQuery.toLowerCase();
    if (searchType === 'plant') {
      return plant.name.toLowerCase().includes(query) || 
             plant.scientificName.toLowerCase().includes(query);
    } else {
      return plant.diseases.some(disease => disease.toLowerCase().includes(query));
    }
  });

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
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Link 
                  to="/notifications"
                  className="p-2 hover:bg-secondary rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </Link>
              )}
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
                className="w-full pl-10 pr-4 py-3 bg-input-background rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Search Type Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setSearchType('plant')}
                className={`flex-1 py-2 px-4 rounded-full transition-colors ${
                  searchType === 'plant' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                Por Planta
              </button>
              <button
                onClick={() => setSearchType('disease')}
                className={`flex-1 py-2 px-4 rounded-full transition-colors ${
                  searchType === 'disease' 
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlantCard plant={plant} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}