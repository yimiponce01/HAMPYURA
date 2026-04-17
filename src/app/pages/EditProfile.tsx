import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { toast } from "sonner";

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const [miPerfil, setMiPerfil] = useState<any>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    region: '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

      // 🔥 construir objeto dinámico
    const updateData: any = {
      nombre: formData.name,
      bio: formData.bio,
    };

    // ✅ SOLO actualizar región si tiene valor
    if (formData.region && formData.region !== '') {
      updateData.region = formData.region;
    }

    // ✅ SOLO actualizar foto si hay
    if (formData.avatar && formData.avatar !== '') {
      updateData.foto_url = formData.avatar;
    }
    

    const { error } = await supabase
    .from("perfiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error(error);
    toast.error("Error al actualizar perfil ❌");
    return;
  }

    // 🔥 actualiza también el contexto (UI)
    updateProfile(formData);

    toast.success("Perfil actualizado correctamente 🌿", {
      description: "Tu información se guardó correctamente"
    });
    navigate("/profile");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !user) return;

  const fileName = `${user.id}-${Date.now()}`;

  // 🔥 subir al bucket
  const { error: uploadError } = await supabase.storage
    .from("avatars") // 👈 este es el bucket (no tabla)
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    alert("Error al subir imagen");
    return;
  }

  // 🔥 obtener URL pública
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const publicUrl = data.publicUrl;



  // 🔥 actualizar UI
  setFormData((prev) => ({
    ...prev,
    avatar: publicUrl
  }));
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
          <h2>Editar Perfil</h2>
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
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-secondary rounded-full overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {formData.name.charAt(0)}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-3 rounded-full cursor-pointer hover:opacity-90">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2">
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Region */}
          <div>
          <label className="block mb-2 text-sm">Región</label>
          <select
            value={formData.region || ""}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value })
            }
            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border"
          >
            <option value="">Selecciona tu región</option>
            <option value="costa">Costa</option>
            <option value="sierra">Sierra</option>
            <option value="selva">Selva</option>
          </select>
        </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block mb-2">
              Biografía
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          {/* Change Password Link */}
          <div className="p-4 bg-secondary rounded-xl">
            <h4 className="mb-1">Seguridad</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Mantén tu cuenta segura
            </p>
            <button
              type="button"
              onClick={() => alert('Funcionalidad de cambio de contraseña')}
              className="text-primary hover:underline"
            >
              Cambiar Contraseña
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
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity"
              whileTap={{ scale: 0.98 }}
            >
              Guardar Cambios
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
