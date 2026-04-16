import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Share2 } from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { motion } from 'motion/react';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Artículo no encontrado</h2>
          <Link to="/articles" className="text-primary hover:underline">
            Volver a artículos
          </Link>
        </div>
      </div>
    );
  }

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
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.article 
        className="max-w-4xl mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Featured Image */}
        <div className="h-64 md:h-96 rounded-2xl overflow-hidden bg-secondary mb-6">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} min de lectura</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{article.authorName}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4">{article.title}</h1>

        {/* Summary */}
        <p className="text-lg text-muted-foreground mb-6 pb-6 border-b border-border">
          {article.summary}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-foreground leading-relaxed mb-4">
            {article.content}
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Las plantas medicinales han acompañado a la humanidad desde sus inicios. Cada civilización ha desarrollado un profundo conocimiento sobre las propiedades curativas de las especies vegetales de su entorno, transmitiendo este saber de generación en generación.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            En la actualidad, la ciencia moderna ha comenzado a validar muchos de estos conocimientos ancestrales, descubriendo los compuestos químicos responsables de las propiedades medicinales de las plantas.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Es importante recordar que, aunque las plantas medicinales son naturales, no están exentas de efectos secundarios. Siempre es recomendable consultar con un profesional de la salud antes de comenzar cualquier tratamiento con plantas medicinales, especialmente si se están tomando otros medicamentos.
          </p>
        </div>

        {/* Author Info */}
        <div className="mt-8 p-6 bg-secondary rounded-2xl">
          <h3 className="mb-2">Acerca del Autor</h3>
          <p className="text-muted-foreground">
            <span className="text-foreground">{article.authorName}</span> es un experto en medicina natural y plantas medicinales. Comparte sus conocimientos para ayudar a más personas a beneficiarse del poder curativo de la naturaleza.
          </p>
        </div>

        {/* Related Articles */}
        <div className="mt-8">
          <h3 className="mb-4">Artículos Relacionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockArticles
              .filter(a => a.id !== article.id && a.category === article.category)
              .slice(0, 2)
              .map((relatedArticle) => (
                <Link 
                  key={relatedArticle.id}
                  to={`/article/${relatedArticle.id}`}
                  className="block bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow"
                >
                  <div className="h-32 overflow-hidden bg-secondary">
                    <img 
                      src={relatedArticle.image} 
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 line-clamp-2">{relatedArticle.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedArticle.summary}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
