
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
  const [images, setImages] = useState<File[]>([]);
  const [nombre_planta, setNombrePlanta] = useState("");
  const [nombre_cientifico, setNombreCientifico] = useState("");
  const [descripcion, setDescripcion] = useState("");
  

  // 🔥 NUEVO SISTEMA DINÁMICO
  const [propiedades, setPropiedades] = useState<string[]>([]);
  const [propInput, setPropInput] = useState("");
  const [enfermedades, setEnfermedades] = useState<string[]>([]);
  const [enfInput, setEnfInput] = useState("");
  const [preparacion, setPreparacion] = useState<string[]>([]);
  const [imagenes, setImagenes] = useState<string[]>([]);


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
    setLoading(true);

    let imageUrls: string[] = [];

    // 🔥 SUBIR TODAS LAS IMÁGENES
    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("plantas")
        .upload(fileName, file);

      if (uploadError) {
        console.error("ERROR SUBIENDO:", uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("plantas")
        .getPublicUrl(fileName);

      const url = publicUrlData.publicUrl;

      if (url) {
        imageUrls.push(url);
      }
    }

    console.log("IMAGENES SUBIDAS:", imageUrls);

    // 🚨 VALIDACIÓN
    if (imageUrls.length === 0) {
      alert("No se subió ninguna imagen");
      setLoading(false);
      return;
    }

      if (!user) {
    alert("Debes iniciar sesión");
    setLoading(false);
    return;
  }

  if (!nombre_planta || !descripcion) {
    toast.error("Completa los campos obligatorios");
    setLoading(false);
    return;
  }

  

    // 🔥 GUARDAR EN BD
      const { data: nuevaPlanta, error } = await supabase
    .from("publicaciones")
    .insert({
      nombre_planta,
      nombre_cientifico,
      descripcion,
      propiedades,
      enfermedades,
      preparacion,
      imagenes: imageUrls,
      estado: "pendiente",
      user_id: user.id
    })
    .select()
    .single();

      if (!error && nuevaPlanta && user) {
      await supabase.from("notificaciones").insert({
        actor_id: user.id,
        tipo: "publicacion",
        publicacion_id: nuevaPlanta.id
      });
    }


    if (error) {
    console.error(error);
    toast.error("Error al publicar ❌");
  } else {
    toast.success("🌿 Publicación enviada", {
      description: "El admin la revisará pronto",
    });
    navigate("/profile");
  }

    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files) {
    setImages((prev) => [...prev, ...Array.from(files)]);
  }
};

  const removeImage = (index: number) => {
  setImages((prev) => prev.filter((_, i) => i !== index));
};

  // PROPIEDADES
const addPropiedad = () => {
  if (!propInput.trim()) return;
  setPropiedades([...propiedades, propInput]);
  setPropInput("");
};

const removePropiedad = (i: number) => {
  setPropiedades(propiedades.filter((_, index) => index !== i));
};

// ENFERMEDADES
const addEnfermedad = () => {
  if (!enfInput.trim()) return;
  setEnfermedades([...enfermedades, enfInput]);
  setEnfInput("");
};

const removeEnfermedad = (i: number) => {
  setEnfermedades(enfermedades.filter((_, index) => index !== i));
};

// PREPARACIÓN
const addPaso = () => {
  setPreparacion([...preparacion, ""]);
};

const updatePaso = (i: number, value: string) => {
  const nuevos = [...preparacion];
  nuevos[i] = value;
  setPreparacion(nuevos);
};

const removePaso = (i: number) => {
  setPreparacion(preparacion.filter((_, index) => index !== i));
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
    
    {/* PREVIEW DE IMÁGENES */}
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
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
        >
          ✕
        </button>
      </div>
    ))}

    {/* BOTÓN SUBIR */}
    <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors">
      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
      <span className="text-sm text-muted-foreground">Subir</span>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (!e.target.files) return;

          const files = Array.from(e.target.files);

          // 🔥 IMPORTANTE: ACUMULA, NO REEMPLAZA
          setImages((prev) => [...prev, ...files]);
        }}
        className="hidden"
      />
    </label>

  </div>

  <p className="text-sm text-muted-foreground">
    Puedes subir varias imágenes (máx recomendado: 4)
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
              value={nombre_planta}
              onChange={(e) => setNombrePlanta(e.target.value)}
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
              value={nombre_cientifico}
              onChange={(e) => setNombreCientifico(e.target.value)}
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
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe la planta, sus características y usos generales"
            />
          </div>
          
          {/* PROPIEDADES (BURBUJAS) */}
          <div>
          <label className="block mb-2">Propiedades Medicinales</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {propiedades.map((p, i) => (
              <div key={i} className="bg-green-100 dark:bg-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                {p}
                <button type="button" onClick={() => removePropiedad(i)}>✕</button>
              </div>
            ))}

            <button type="button" onClick={addPropiedad} className="bg-green-200 dark:bg-green-700 px-3 rounded-full">
              +
            </button>
          </div>

          <input
            value={propInput}
            onChange={(e) => setPropInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPropiedad();
                }
              }}
            className="w-full px-4 py-2 border rounded-xl"
            placeholder="Presiona ENTER o + para agregar"
          />
        </div>

        {/* ENFERMEDADES (BURBUJAS) */}
        <div>
          <label className="block mb-2">Enfermedades</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {enfermedades.map((e, i) => (
              <div key={i} className="bg-green-100 dark:bg-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                {e}
                <button type="button" onClick={() => removeEnfermedad(i)}>✕</button>
              </div>
            ))}

            <button type="button" onClick={addEnfermedad} className="bg-green-200 dark:bg-green-700 px-3 rounded-full">
              +
            </button>
          </div>

          <input
            value={enfInput}
            onChange={(e) => setEnfInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addEnfermedad();
                }
              }}
            className="w-full px-4 py-2 border rounded-xl"
            placeholder="Presiona ENTER o + para agregar"
          />
        </div>

        {/* PREPARACIÓN (LISTA) */}
        <div>
          <label className="block mb-2">Preparación</label>

          {preparacion.map((paso, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span className="bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded-full">
                {i + 1}
              </span>

              <input
                value={paso}
                onChange={(e) => updatePaso(i, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-xl"
              />

              <button type="button" onClick={() => removePaso(i)}>✕</button>
            </div>
          ))}

          <button type="button" onClick={addPaso} className="bg-green-200 dark:bg-green-700 px-3 py-1 rounded">
            + Añadir paso
          </button>
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
