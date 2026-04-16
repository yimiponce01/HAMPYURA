import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Flag, Send } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner"; 

  type Plant = {
  id: string;
  nombre_planta: string;
  nombre_cientifico?: string;
  descripcion: string;
  imagen_url: string;
  propiedades: string[];
  enfermedades: string[];
  preparacion: string[];
  likes?: number;
  comments?: any[];
};

export default function PlantDetail() {
  const { id } = useParams();
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPlant = async () => {
        setLoading(true); // 👈 AGREGAR

        const { data, error } = await supabase
          .from("publicaciones")
          .select("*")
          .eq("id", id)
          .single();

        if (!error) setPlant(data);

        setLoading(false); // 👈 AGREGAR
      };

      if (id) fetchPlant();
    }, [id]);

  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { requireAuth } = useAuth();

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Cargando...</p>
    </div>
  );
}

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Planta no encontrada</h2>
          <Link to="/" className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleRate = (rating: number) => {
    if (requireAuth()) {
      setUserRating(rating);
      alert(`Has valorado esta planta con ${rating} estrellas`);
    } else {
      toast.error("Acceso requerido 🔒", {
        description: "Debes iniciar sesión para dar estrellas⭐",
      });
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireAuth()) {
      if (comment.trim()) {
        alert('Comentario publicado');
        setComment('');
      }
    } else {
        if (!requireAuth()) {
          toast.error("Debes iniciar sesión para comentar 💬", {
            description: "Accede a tu cuenta para dejar tu opinión 🌿",
          });
          return;
        }
    }
  };

  const handleLike = () => {
    if (requireAuth()) {
      setIsLiked(!isLiked);
    } else {
      toast.error("Acceso requerido 🔒", {
          description: "Debes iniciar sesión para dar like",
        });
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
          <div className="flex gap-2">
            <motion.button
              onClick={handleLike}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowReportModal(true)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-6">
            <img
              src={plant.imagen_url || "https://via.placeholder.com/400x300"}
              className="w-full h-64 md:h-80 object-cover rounded-2xl"
            />
          </div>
            

        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <h1 className="mb-1">{plant.nombre_planta  }</h1>
            <p className="text-muted-foreground italic">{plant.nombre_cientifico || "Sin nombre científico"}</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <StarRating 
              rating={userRating || 0}
              totalRatings={0}
              onRate={handleRate}
            />
            <span className="text-muted-foreground">
              {plant.likes || 0} me gusta
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2">Descripción</h3>
            <p className="text-muted-foreground">{plant.descripcion}</p>
          </div>

          {/* Properties */}
          <div className="mb-6">
            <h3 className="mb-3">Propiedades Medicinales</h3>
            <div className="flex flex-wrap gap-2">
              {(plant.propiedades || []).map((p: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm rounded-full 
                  bg-green-200 text-green-700 
                  dark:bg-green-700 dark:text-white"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Diseases */}
          <div className="mb-6">
            <h3 className="mb-3">Trata estas Enfermedades</h3>
            <div className="flex flex-wrap gap-2">
              {(plant.enfermedades || []).map((d: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full 
                    bg-green-300 text-green-800 
                    dark:bg-green-600 dark:text-white"
                  >
                    {d}
                  </span>
                ))}
            </div>
          </div>

          {/* Preparations */}
          <div className="mb-6">
            <h3 className="mb-3">Formas de Preparación</h3>
            <div className="space-y-3">
              {(plant.preparacion || []).map((prep: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                    {i + 1}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {prep}
                  </p>

                </div>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="mb-6 p-4 bg-secondary rounded-xl">
            <p className="text-sm text-muted-foreground">
              Publicado recientemente🌿
              </p>
          </div>

          {/* Comments Section */}
          <div className="border-t border-border pt-6">
            <h3 className="mb-4">Comentarios ({(plant.comments || []).length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="flex-1 px-4 py-3 bg-input-background rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <motion.button
                  type="submit"
                  className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {(plant.comments || []).map((comment: any) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex-shrink-0 overflow-hidden">
                    {comment.userAvatar && (
                      <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary rounded-2xl p-4">
                      <p className="text-sm mb-1">{comment.userName}</p>
                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-4">
                      {comment.createdAt.toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}

              {(plant.comments || []).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Sé el primero en comentar
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowReportModal(false)}
        >
          <motion.div 
            className="bg-card rounded-2xl p-6 max-w-sm w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4">Reportar Contenido</h3>
            <p className="text-muted-foreground mb-4">
              ¿Por qué deseas reportar esta publicación?
            </p>
            <div className="space-y-2 mb-6">
              {['Información incorrecta', 'Contenido inapropiado', 'Spam', 'Otro'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    alert(`Reporte enviado: ${reason}`);
                    setShowReportModal(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-secondary hover:bg-accent rounded-lg transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full py-2 text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
