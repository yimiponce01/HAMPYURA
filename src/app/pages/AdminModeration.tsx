import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Post {
    id: string;
    nombre_planta: string;
    descripcion: string;
    imagen_url: string;
    }

    export default function AdminModeration() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);

    // 🔥 cargar publicaciones pendientes
    const fetchPosts = async () => {
        const { data, error } = await supabase
        .from("publicaciones")
        .select("*")
        .eq("estado", "pendiente");

        if (!error) setPosts(data || []);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // ✅ aprobar
    const aprobar = async (id: string) => {
    const { error } = await supabase
        .from("publicaciones")
        .update({ estado: "aprobado" })
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("No tienes permisos para aprobar");
        return;
    }

    // 🔥 UI inmediata (sin recargar)
    setPosts(prev => prev.filter(p => p.id !== id));
    };

    // ❌ eliminar
    const eliminar = async (id: string) => {
    const { error } = await supabase
        .from("publicaciones")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("No tienes permisos para eliminar");
        return;
    }

    // 🔥 UI inmediata
    setPosts(prev => prev.filter(p => p.id !== id));
    };

return (
    <div>

        {/* HEADER */}
        <div className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 py-6">

            <button
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:opacity-80 text-sm mb-2"
            >
            ← Volver
            </button>

            <h1 className="text-3xl font-bold">
            Moderación de contenido
            </h1>

        </div>
        </div>

        {/* GRID */}
        <div className="p-4 max-w-5xl mx-auto">

            {posts.length === 0 ? (
                
                <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
                <p className="text-lg font-semibold">
                    No hay nuevas publicaciones
                </p>
                <p className="text-sm mt-1">
                    Todo está al día 🎉
                </p>
                </div>

            ) : (

                <div className="grid grid-cols-2 gap-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => navigate(`/plant/${post.id}`)}
                        className="bg-white rounded-xl shadow overflow-hidden relative cursor-pointer hover:scale-[1.02] transition active:scale-[0.98]"
                        >

                    {/* BOTONES */}
                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <button
                        onClick={() => aprobar(post.id)}
                        className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center"
                        >
                        ✓
                        </button>

                        <button
                        onClick={() => eliminar(post.id)}
                        className="bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center"
                        >
                        ✕
                        </button>
                    </div>

                    {/* IMAGEN */}
                    <div className="h-32 overflow-hidden">
                        <img
                        src={post.imagen_url}
                        className="w-full h-full object-cover"
                        />
                    </div>

                    {/* TEXTO */}
                    <div className="p-3">
                        <h3 className="font-bold text-sm">{post.nombre_planta}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">
                        {post.descripcion}
                        </p>
                    </div>

                    </div>
                ))}
                </div>

            )}

            </div>
        

    </div>
    );
}