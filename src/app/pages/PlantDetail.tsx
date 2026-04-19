import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Flag, Send, Eye, Star } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner"; 



  type Plant = {
  id: string;
  user_id: string;
  nombre_planta: string;
  nombre_cientifico?: string;
  descripcion: string;
  imagenes: string[];
  propiedades: string[];
  enfermedades: string[];
  preparacion: string[];
  likes?: number;
  comments?: any[];

  // 👇 AGREGA ESTO
  perfiles?: {
    nombre?: string;
    region?: string;
  };
};

export default function PlantDetail() {

  
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [miPerfil, setMiPerfil] = useState<any>(null);

  

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
      

    const guardarEdicion = async (id: string) => {
    const { data, error } = await supabase
      .from("comentarios")
      .update({ contenido: textoEditado })
      .eq("id", id)
      .select(); // 👈 IMPORTANTE

    console.log("UPDATE RESULT:", data);
    console.log("UPDATE ERROR:", error);

    if (!error) {
      setEditandoId(null);
      setComentarios(prev =>
      prev.map(c =>
        c.id === id ? { ...c, contenido: textoEditado } : c
      )
    );
    }
  };


    useEffect(() => {
      const fetchPlant = async () => {
        setLoading(true);

        const { data, error } = await supabase
          .from("publicaciones")
          .select(`
            *,
            perfiles (
              nombre,
              region
            )
          `)
          .eq("id", id)
          .single();

          console.log("PLANT DATA:", data);
          console.log("PLANT ERROR:", error);
          console.log(data);
          console.log("DELETE ERROR:", error);

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


    }, [id]);



  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { requireAuth } = useAuth();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [vistas, setVistas] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const { user } = useAuth();
  
  useEffect(() => {
  const fetchPerfil = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error perfil:", error);
      return;
    }

    setMiPerfil(data);
    
    
  };

  fetchPerfil();
}, [user]);

  useEffect(() => {
    if (id) {
      fetchComentarios();
    }
  }, [id]);


    useEffect(() => {
    if (!plant?.id || !user?.id) return;

    registrarVista();
    checkIfLiked();
    fetchLikes();
    fetchRating();
    fetchVistas();
    fetchUserRating();
  }, [plant?.id, user?.id]);

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

      // 🔔 NOTIFICACIÓN DE COMENTARIO
  if (plant.user_id !== user.id) {
    await supabase.from("notificaciones").insert({
      user_id: plant.user_id,
      actor_id: user.id,
      tipo: "comment",
      publicacion_id: plant.id
    });
  }
      
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

const eliminarPublicacion = async (id: string) => {
  if (!id) return;

  console.log("Intentando eliminar:", id);

  // 🔥 eliminar dependencias
  await supabase.from("vistas").delete().eq("publicacion_id", id);
  await supabase.from("comentarios").delete().eq("publicacion_id", id);
  await supabase.from("likes").delete().eq("publicacion_id", id);
  await supabase.from("ratings").delete().eq("publicacion_id", id); // 👈 ESTE FALTABA

  // 🔥 ahora sí eliminar publicación
  const { data, error } = await supabase
    .from("publicaciones")
    .delete()
    .eq("id", id)
    .select();

  console.log("DELETE DATA:", data);
  console.log("DELETE ERROR:", error);

  if (error) {
    console.error("Error eliminando:", error.message);
    return;
  }

  console.log("Eliminado correctamente ✅");

  navigate("/");
};


    const confirmarEliminacion = async () => {
      console.log("USER:", user?.id);
      console.log("ROL:", miPerfil);
      console.log("PLANT:", plant);

      if (!plant) 
        return;

      await eliminarPublicacion(plant.id);

      toast.success("Publicación eliminada 🗑️");
      navigate("/");
    };

  const eliminarComentario = async (id: string) => {
    const { error } = await supabase
      .from("comentarios")
      .delete()
      .eq("id", id);

    if (!error) fetchComentarios();
  };


    //LIKE
    const handleLike = async () => {
      if (!requireAuth()) return;
      if (!user?.id || !plant?.id) return;

      // 🔥 1. CAMBIO INMEDIATO EN UI
      const nuevoEstado = !isLiked;
      setIsLiked(nuevoEstado);

      // opcional: también actualizar contador sin esperar
      setLikesCount(prev => nuevoEstado ? prev + 1 : prev - 1);

      try {
        if (nuevoEstado) {
          await supabase.from("likes").insert({
            user_id: user.id,
            publicacion_id: plant.id
          });

          await supabase.from("notificaciones").insert({
            user_id: plant.user_id,
            actor_id: user.id,
            tipo: "like",
            publicacion_id: plant.id
          });

        } else {
          await supabase
            .from("likes")
            .delete()
            .eq("user_id", user.id)
            .eq("publicacion_id", plant.id);
        }

        // 🔥 sincroniza con Home
        window.dispatchEvent(new Event("likeUpdated"));

      } catch (error) {
        console.error("Error like:", error);

        // ❌ rollback si falla
        setIsLiked(!nuevoEstado);
        setLikesCount(prev => nuevoEstado ? prev - 1 : prev + 1);
      }
    };

    //SABER SI YA DIO LIKE
    const checkIfLiked = async () => {
    if (!user?.id || !plant?.id) return;

    const { data } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("publicacion_id", plant.id)
      .maybeSingle();

    setIsLiked(!!data);
    console.log("LIKED:", !!data);
  };

    //CONTAR LIKES
    const fetchLikes = async () => {
    if (!plant) return;

    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("publicacion_id", plant.id);

    setLikesCount(count || 0);
  };

    //REGISTRAR VISTA
    const registrarVista = async () => {
    if (!user || !plant) return;

    await supabase
      .from("vistas")
      .upsert({
        user_id: user.id,
        publicacion_id: plant.id
      }, { onConflict: "user_id,publicacion_id" });
  };

    //CONTAR VISTAS
    const fetchVistas = async () => {
    if (!plant) return;

    const { count } = await supabase
      .from("vistas")
      .select("*", { count: "exact", head: true })
      .eq("publicacion_id", plant.id);

    setVistas(count || 0);
  };

    //RATING
const handleRate = async (rating: number) => {

  // 🔥 VALIDACIÓN (AQUÍ VA)
  if (!user) {
    toast.warning("Debes iniciar sesión ⭐", {
      description: "Inicia sesión para calificar esta planta"
    });

    // opcional (pro)
    // navigate("/login");

    return;
  }

  if (!plant) return;

  const { error } = await supabase
    .from("ratings")
    .upsert(
      {
        user_id: user.id,
        publicacion_id: plant.id,
        rating
      },
      {
        onConflict: "user_id,publicacion_id"
      }
    );

  if (error) {
    console.error("Error al guardar rating:", error);
    toast.error("Error al guardar calificación ❌");
    return;
  }

  // 🔥 UI inmediata
  setUserRating(rating);

  // 🔔 notificación
  await supabase.from("notificaciones").insert({
    user_id: plant.user_id,
    actor_id: user.id,
    tipo: "rating",
    publicacion_id: plant.id
  });

  // 🔄 recalcular promedio
  fetchRating();

  // ✅ feedback bonito
  toast.success("Calificación enviada ⭐");
};

  const fetchUserRating = async () => {
  if (!user || !plant) return;

  const { data } = await supabase
    .from("ratings")
    .select("rating")
    .eq("user_id", user.id)
    .eq("publicacion_id", plant.id)
    .maybeSingle();

  if (data) {
    setUserRating(data.rating);
  }
};

  //PROMEDIO

    const fetchRating = async () => {
    if (!plant) return;

    const { data } = await supabase
      .from("ratings")
      .select("rating")
      .eq("publicacion_id", plant.id);

    if (!data || data.length === 0) {
      setAverageRating(0);
      return;
    }

    const suma = data.reduce((acc, r) => acc + r.rating, 0);
    const promedio = suma / data.length;

    setAverageRating(promedio);
  };



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

const handleReportar = async (motivo: string) => {
  if (!user || !plant) return;

  const { error } = await supabase.from("reportes").insert({
    publicacion_id: plant.id,
    usuario_id: user.id,
    motivo,
    estado: "pendiente"
  });

  if (error) {
    console.error(error);
    return;
  }

  // 🔥 dueño de la planta
  const { data: plantaOwner } = await supabase
    .from("publicaciones")
    .select("user_id")
    .eq("id", plant.id)
    .single();

  if (plantaOwner) {
    await supabase.from("notificaciones").insert({
      actor_id: user.id,
      user_id: plantaOwner.user_id,
      tipo: "reporte",
      publicacion_id: plant.id
    });
  }

  // 🔥 MENSAJE
  toast.success("Reporte enviado correctamente ✅", {
  description: "Gracias por ayudarnos a mantener la comunidad segura 🌿"
});

  // 🔥 cerrar modal
  setShowReportModal(false);
};

  const esAdmin = miPerfil?.rol === "admin";

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
            onClick={() => {
              if (!requireAuth()) {
                toast.error("Acceso requerido 🔒", {
                  description: "Debes iniciar sesión para dar like ❤️",
                });
                return;
              }

              handleLike();
            }}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </motion.button>



          {/* 🚩 REPORT */}
          <button 
            onClick={() => {
              if (!user) {
                toast.error("Debes iniciar sesión para reportar 🚫");
                navigate("/login");
                return;
              }

              setShowReportModal(true);
            }}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
              <Flag className="w-5 h-5" />
                </button>

                {/* 🗑️ ADMIN */}
                {miPerfil?.rol === "admin" && (
                  <button
                    onClick={() => confirmarEliminacion()}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    🗑️
                  </button>
              )}
            
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

          <div className="flex gap-6 items-center mt-4">

          {/* ❤️ LIKE *
          <button onClick={handleLike} className="flex items-center gap-1">
            <Heart
              className={`w-5 h-5 ${
                isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
              }`}
            />
            <span>{likesCount}</span>
          </button>/}

          {/* 👁️ VISTAS 
          <div className="flex items-center gap-1">
            <Eye className="w-5 h-5 text-gray-400" />
            <span>{vistas}</span>
          </div>*/}

          {/* ⭐ ESTRELLAS */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => handleRate(star)}
                className={`w-5 h-5 cursor-pointer ${
                  star <= userRating 
                  ? "text-yellow-400 fill-yellow-400 scale-110"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

<br></br>

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
              🌿 Publicado por{" "}
              <span className="font-semibold text-foreground">
                {plant.perfiles?.nombre || "Usuario"}
              </span>{" "}
              desde la {" "}
              <span className="font-semibold text-foreground">
                {plant.perfiles?.region || "desconocido"}
              </span> 🌿
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
const esAdmin = miPerfil?.rol === "admin";


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
                              {comentario.perfiles?.region ? comentario.perfiles.region : "Sin región"}
                            </span>

                            {comentario.perfiles?.rol === "admin" && (
                              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                                admin
                              </span>
                            )}
                          </div>

                          {editandoId === comentario.id ? (
                          <div className="mt-2">
                            <input
                              value={textoEditado}
                              onChange={(e) => setTextoEditado(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-input-background border border-border"
                            />

                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => guardarEdicion(comentario.id)}
                                className="text-xs text-green-600"
                              >
                                Guardar
                              </button>

                              <button
                                onClick={() => setEditandoId(null)}
                                className="text-xs text-gray-500"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm mt-1">
                            {comentario.contenido}
                          </p>
                        )}

                          {(esPropio || esAdmin) && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  setEditandoId(comentario.id);
                                  setTextoEditado(comentario.contenido);
                                }}
                                className="text-xs text-green-600 hover:underline"
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

      {showDeleteModal && (
      <div className="modal">
        <p>¿Eliminar publicación?</p>

        <button onClick={confirmarEliminacion}>
          Sí, eliminar
        </button>

        <button onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </button>
      </div>
    )}

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
            <div className="flex flex-col mt-4">

              {[
                "Información incorrecta",
                "Contenido inapropiado",
                "Spam",
                "Otro"
              ].map((motivo, index, array) => (
                <button
                  key={motivo}
                  onClick={() => handleReportar(motivo)}
                  className={`text-left py-3 px-2 transition hover:text-primary 
                    ${index !== array.length - 1 ? "border-b border-border" : ""}
                  `}
                >
                  {motivo}
                </button>
              ))}

            </div>
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
  
