import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface Reporte {
    id: string;
    motivo: string;
    publicacion_id: string;
    created_at: string;
    usuario: { nombre: string };
    planta: { nombre_planta: string };
}

    export default function AdminModeration() {
    const navigate = useNavigate();
    const [reportes, setReportes] = useState<Reporte[]>([]);

    // 🔥 cargar publicaciones pendientes
    const fetchPosts = async () => {
        const { data, error } = await supabase
        .from("reportes")
        .select(`
        id,
        motivo,
        created_at,
        publicacion_id,
        usuario:usuario_id (nombre),
        planta:publicacion_id (nombre_planta)
        `)
        .order("created_at", { ascending: false });

        if (!error && data) {
        setReportes(data.map((r: any) => ({
            id: r.id,
            motivo: r.motivo,
            publicacion_id: r.publicacion_id,
            created_at: r.created_at,
            usuario: r.usuario || { nombre: "Usuario" },
            planta: r.planta || { nombre_planta: "Planta" }
        })));
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const marcarLeido = async (id: string) => {
    setReportes(prev => prev.filter(r => r.id !== id));
    };

    const eliminar = async (id: string) => {
    await supabase.from("reportes").delete().eq("id", id);
    setReportes(prev => prev.filter(r => r.id !== id));
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
            Reportes de contenido
            </h1>

        </div>
        </div>

        {/* GRID */}
        <div className="p-4 max-w-5xl mx-auto">

        {reportes.length === 0 ? (

            <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
            <p className="text-lg font-semibold">
                No hay reportes
            </p>
            <p className="text-sm mt-1">
                Todo está al día 🎉
            </p>
            </div>

        ) : (

            <div className="grid grid-cols-2 gap-4">
            {reportes.map((reporte) => (
                <div
                key={reporte.id}
                onClick={() => navigate(`/plant/${reporte.publicacion_id}`)}
                className="bg-white rounded-xl shadow overflow-hidden relative cursor-pointer hover:scale-[1.02] transition active:scale-[0.98]"
                >

                {/* BOTONES */}
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        marcarLeido(reporte.id);
                    }}
                    className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center"
                    >
                    ✓
                    </button>

                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        eliminar(reporte.id);
                    }}
                    className="bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center"
                    >
                    ✕
                    </button>
                </div>

                {/* TEXTO */}
                <div className="p-3 bg-green-800">
                    <h3 className="font-bold text-sm text-black">
                    {reporte.usuario?.nombre} reportó
                    </h3>

                    <p className="text-xs text-gray-500">
                    {reporte.planta?.nombre_planta}
                    </p>

                    <p className="text-xs text-red-400">
                    Motivo: {reporte.motivo}
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