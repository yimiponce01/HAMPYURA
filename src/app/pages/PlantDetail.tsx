import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Heart, Share2, Flag, Send } from 'lucide-react';
import { mockPlants } from '../data/mockData';
import { StarRating } from '../components/StarRating';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = mockPlants.find(p => p.id === id);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { requireAuth } = useAuth();

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
      alert('Debes iniciar sesión para valorar');
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
      alert('Debes iniciar sesión para comentar');
    }
  };

  const handleLike = () => {
    if (requireAuth()) {
      setIsLiked(!isLiked);
    } else {
      alert('Debes iniciar sesión para dar like');
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
          {plant.images.map((image, index) => (
            <motion.div
              key={index}
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-secondary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={image} 
                alt={`${plant.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <h1 className="mb-1">{plant.name}</h1>
            <p className="text-muted-foreground italic">{plant.scientificName}</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <StarRating 
              rating={userRating || plant.rating}
              totalRatings={plant.totalRatings}
              onRate={handleRate}
            />
            <span className="text-muted-foreground">
              {plant.likes} me gusta
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2">Descripción</h3>
            <p className="text-muted-foreground">{plant.description}</p>
          </div>

          {/* Properties */}
          <div className="mb-6">
            <h3 className="mb-3">Propiedades Medicinales</h3>
            <div className="flex flex-wrap gap-2">
              {plant.properties.map((property, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {property}
                </span>
              ))}
            </div>
          </div>

          {/* Diseases */}
          <div className="mb-6">
            <h3 className="mb-3">Trata estas Enfermedades</h3>
            <div className="flex flex-wrap gap-2">
              {plant.diseases.map((disease, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {disease}
                </span>
              ))}
            </div>
          </div>

          {/* Preparations */}
          <div className="mb-6">
            <h3 className="mb-3">Formas de Preparación</h3>
            <div className="space-y-3">
              {plant.preparations.map((prep, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground flex-1">{prep}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="mb-6 p-4 bg-secondary rounded-xl">
            <p className="text-sm text-muted-foreground">
              Publicado por <span className="text-foreground">{plant.authorName}</span>
              {' • '}
              {plant.createdAt.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Comments Section */}
          <div className="border-t border-border pt-6">
            <h3 className="mb-4">Comentarios ({plant.comments.length})</h3>

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
              {plant.comments.map((comment) => (
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

              {plant.comments.length === 0 && (
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
