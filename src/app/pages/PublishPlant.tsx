
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from "sonner";

export default function PublishPlant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { requireAuth, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    properties: '',
    diseases: '',
    preparations: ''
  });
  const [images, setImages] = useState<File[]>([]);

  // Verificar autenticación
  if (!requireAuth()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="mb-4">Acceso Restringido</h2>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para publicar plantas
          </p>
          <Link 
            to="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true); // 🔥 AQUÍ

  let imageUrl = "";

  if (images.length > 0) {
    const file = images[0];

    console.log("ARCHIVO:", file); // 👈 IMPORTANTE

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("plantas")
        .upload(fileName, file);

      if (uploadError) {
        console.error("ERROR SUBIENDO:", uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("plantas")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;

        console.log("URL GENERADA:", imageUrl); // 👈 CLAVE

        if (!imageUrl) {
          alert("La imagen no se pudo subir correctamente");
          setLoading(false);
          return;
        }
      }
    }
  }

  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("rol")
    .eq("email", user.email)
    .maybeSingle();

  const estadoPublicacion =
    profile?.rol === "admin" ? "aprobado" : "pendiente";

  const { error } = await supabase.from("publicaciones").insert({
    user_id: user.id,
    nombre_planta: formData.name,
    nombre_cientifico: formData.scientificName,
    descripcion: formData.description,
    propiedades: formData.properties.split(",").map(p => p.trim()),
    enfermedades: formData.diseases.split(",").map(e => e.trim()),
    preparacion: formData.preparations.split("\n"),
    imagen_url: imageUrl,
    estado: estadoPublicacion
  });

  setLoading(false); // 🔥 AQUÍ

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  toast.success("Publicación creada correctamente 🌿");
  navigate("/");
};

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files) {
    setImages(Array.from(files));
  }
};

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
          <h2>Publicar Planta</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Images Upload */}
          <div>
            <label className="block mb-3">
              Imágenes de la Planta
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                  <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Imagen ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Subir</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Sube hasta 4 imágenes de la planta
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2">
              Nombre de la Planta *
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Manzanilla"
            />
          </div>

          {/* Scientific Name */}
          <div>
            <label htmlFor="scientificName" className="block mb-2">
              Nombre Científico
            </label>
            <input
              id="scientificName"
              type="text"
              value={formData.scientificName}
              onChange={(e) => setFormData({...formData, scientificName: e.target.value})}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Matricaria chamomilla"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe la planta, sus características y usos generales"
            />
          </div>

          {/* Properties */}
          <div>
            <label htmlFor="properties" className="block mb-2">
              Propiedades Medicinales *
            </label>
            <textarea
              id="properties"
              required
              value={formData.properties}
              onChange={(e) => setFormData({...formData, properties: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Ej: Antiinflamatoria, Sedante, Digestiva (separar por comas)"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Separa cada propiedad con una coma
            </p>
          </div>

          {/* Diseases */}
          <div>
            <label htmlFor="diseases" className="block mb-2">
              Enfermedades que Trata *
            </label>
            <textarea
              id="diseases"
              required
              value={formData.diseases}
              onChange={(e) => setFormData({...formData, diseases: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Ej: insomnio, ansiedad, dolor de estómago (separar por comas)"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Separa cada enfermedad con una coma
            </p>
          </div>

          {/* Preparations */}
          <div>
            <label htmlFor="preparations" className="block mb-2">
              Formas de Preparación *
            </label>
            <textarea
              id="preparations"
              required
              value={formData.preparations}
              onChange={(e) => setFormData({...formData, preparations: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe cómo preparar y utilizar esta planta medicinal. Puedes incluir múltiples métodos."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity"
              whileTap={{ scale: 0.98 }}
            >
              Publicar Planta
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );

}
