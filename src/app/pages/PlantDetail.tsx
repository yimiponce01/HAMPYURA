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
  imagenes: string[];
  propiedades: string[];
  enfermedades: string[];
  preparacion: string[];
  likes?: number;
  comments?: any[];
};

export default function PlantDetail() {

  
  const { id } = useParams();
  const [loading, setLoading] = useState(true);


  const fetchComentarios = async () => {
        const { data, error } = await supabase
          .from("comentarios")
          .select(`
            *,
            perfiles (
              nombre,
              foto_url,
              region,
              rol
            )
          `)
          .eq("publicacion_id", id)
          .order("created_at", { ascending: false });

        if (!error) setComentarios(data || []);
      };


    useEffect(() => {
      const fetchPlant = async () => {
        setLoading(true);

        const { data, error } = await supabase
          .from("publicaciones")
          .select("*")
          .eq("id", id)
          .single();

          console.log("PLANT DATA:", data);
          console.log("PLANT ERROR:", error);

          if (!error && data) {
            setPlant(data);
          } else {
            console.error("Error al traer planta:", error);
          }

        setLoading(false);
      };
      

      if (id) {
        fetchPlant();
        fetchComentarios();
      }

      const getUser = async () => {
      const { data } = await supabase.auth.getUser();
        setUser(data.user);
      };

    getUser();

    }, [id]);


  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { requireAuth } = useAuth();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <p>No se encontró la planta</p>
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

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      toast.error("Debes iniciar sesión 💬");
      return;
    }

    if (!comment.trim()) return;

    const { error } = await supabase.from("comentarios").insert({
      publicacion_id: id,
      user_id: user.id,
      contenido: comment
    });

    if (!error) {
      setComment('');
      
      // recargar comentarios
      const { data } = await supabase
        .from("comentarios")
        .select(`
          *,
          perfiles (
            nombre,
            foto_url,
            region,
            rol
          )
        `)
        .eq("publicacion_id", id)
        .order("created_at", { ascending: false });

        console.log(data);
      setComentarios(data || []);
    }
  };

  const eliminarComentario = async (id: string) => {
    const { error } = await supabase
      .from("comentarios")
      .delete()
      .eq("id", id);

    if (!error) fetchComentarios();
  };

  const handleLike = () => {
    if (requireAuth()) {
      setIsLiked(!isLiked);
    } else {
      toast.error("Acceso requerido 🔒", {
          description: "Debes iniciar sesión para dar like",
        });
    }
  }

  console.log(plant.imagenes);

  
  const visibleCount = window.innerWidth >= 768 ? 4 : 2;

  const next = () => {
    if (currentIndex < plant.imagenes.length - visibleCount) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
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
        <div className="flex gap-4 justify-center md:justify-start w-full">
          <div className="w-full max-w-7xl mx-auto px-6 py-6">

            <div className="relative w-full overflow-hidden">
              {/* BOTÓN IZQUIERDA */}
              {currentIndex > 0 && (
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-3 py-2 rounded-full"
                >
                  ❮
                </button>
              )}

              {/* CARRUSEL */}
              <div
                className="flex gap-4 transition-transform duration-300"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`
                }}
              >
                {Array.isArray(plant?.imagenes) &&
                  plant.imagenes.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      className="min-w-[40%] md:min-w-[30%] lg:min-w-[25%] h-72 object-cover rounded-2xl flex-shrink-0"
                    />
                  ))}
              </div>

              {/* BOTÓN DERECHA */}
              {plant?.imagenes &&
                currentIndex < plant.imagenes.length - visibleCount && (
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-3 py-2 rounded-full"
                  >
                    ❯
                  </button>
                )}
            </div>

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
            <h3 className="mb-4">Comentarios ({comentarios.length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-6">
              {/* LISTA DE COMENTARIOS */}
              <div className="mt-4">
                {comentarios.map((comentario: any) => {
                    const esPropio = user?.id === comentario.user_id;
                    const esAdmin = comentario.perfiles?.rol === "admin";

                    return (
                      <div key={comentario.id} className="flex gap-3 mb-4">

                        {comentario.perfiles?.foto_url ? (
                          <img
                            src={comentario.perfiles.foto_url}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                            {comentario.perfiles?.nombre?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2">

                            <span className="font-semibold text-sm">
                              {comentario.perfiles?.nombre || "Usuario"}
                            </span>

                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-white">
                              {comentario.perfiles?.region || "sin región"}
                            </span>

                            {comentario.perfiles?.rol === "admin" && (
                              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                                admin
                              </span>
                            )}
                          </div>

                          <p className="text-sm mt-1">
                            {comentario.contenido}
                          </p>

                          {(esPropio || esAdmin) && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate(`/edit/${plant.id}`);
                                }}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() => eliminarComentario(comentario.id)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}

              </div>
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
                className="w-full py-2 text-left hover:bg-accent rounded-md px-2"
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
  
