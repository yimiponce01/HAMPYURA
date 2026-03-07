export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  shortDescription: string;
  properties: string[];
  diseases: string[];
  preparations: string[];
  images: string[];
  rating: number;
  totalRatings: number;
  likes: number;
  authorId: string;
  authorName: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  readTime: number;
}

export interface Notification {
  id: string;
  type: 'comment' | 'like' | 'system';
  message: string;
  plantId?: string;
  createdAt: Date;
  read: boolean;
}

export const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Manzanilla',
    scientificName: 'Matricaria chamomilla',
    description: 'La manzanilla es una planta herbácea anual de la familia de las asteráceas. Es ampliamente conocida por sus propiedades medicinales y se utiliza tradicionalmente para tratar diversos problemas de salud.',
    shortDescription: 'Planta medicinal con propiedades calmantes y antiinflamatorias',
    properties: ['Antiinflamatoria', 'Sedante', 'Digestiva', 'Antiespasmódica'],
    diseases: ['insomnio', 'ansiedad', 'dolor de estómago', 'gastritis', 'cólicos', 'inflamación'],
    preparations: [
      'Infusión: 1 cucharada de flores secas por taza de agua caliente, dejar reposar 5-10 minutos',
      'Compresas: aplicar infusión tibia sobre la zona afectada',
      'Baños: agregar infusión concentrada al agua del baño'
    ],
    images: [
      'https://images.unsplash.com/photo-1631037958943-f6c220c4703a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512069593782-e4ed9e79be66?w=800&h=600&fit=crop'
    ],
    rating: 4.5,
    totalRatings: 128,
    likes: 245,
    authorId: '1',
    authorName: 'María González',
    createdAt: new Date('2026-02-15'),
    comments: [
      {
        id: '1',
        userId: '2',
        userName: 'Carlos Ruiz',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        content: 'Excelente información, la manzanilla me ha ayudado mucho con el insomnio.',
        createdAt: new Date('2026-02-20')
      }
    ]
  },
  {
    id: '2',
    name: 'Eucalipto',
    scientificName: 'Eucalyptus globulus',
    description: 'El eucalipto es un árbol de gran tamaño originario de Australia. Sus hojas contienen aceites esenciales con propiedades medicinales, especialmente beneficiosas para el sistema respiratorio.',
    shortDescription: 'Árbol medicinal ideal para problemas respiratorios',
    properties: ['Expectorante', 'Descongestionante', 'Antiséptico', 'Antibacteriano'],
    diseases: ['tos', 'gripe', 'resfriado', 'bronquitis', 'sinusitis', 'congestión nasal'],
    preparations: [
      'Vaporizaciones: hervir hojas en agua y respirar el vapor',
      'Infusión: 2-3 hojas por taza de agua caliente',
      'Aceite esencial: aplicar diluido en el pecho y espalda'
    ],
    images: [
      'https://images.unsplash.com/photo-1627278631921-874a70b5f973?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&h=600&fit=crop'
    ],
    rating: 4.8,
    totalRatings: 96,
    likes: 189,
    authorId: '2',
    authorName: 'Dr. Pedro Sánchez',
    createdAt: new Date('2026-02-10'),
    comments: []
  },
  {
    id: '3',
    name: 'Jengibre',
    scientificName: 'Zingiber officinale',
    description: 'El jengibre es una raíz con múltiples propiedades medicinales. Se utiliza tanto en la cocina como en la medicina tradicional para tratar diversas dolencias.',
    shortDescription: 'Raíz poderosa con propiedades antiinflamatorias',
    properties: ['Antiinflamatorio', 'Digestivo', 'Analgésico', 'Antioxidante'],
    diseases: ['náuseas', 'mareos', 'dolor muscular', 'artritis', 'migraña', 'indigestión'],
    preparations: [
      'Té de jengibre: rallar 1 cucharada de raíz fresca en agua caliente',
      'Infusión: cortar rodajas finas y hervir 10 minutos',
      'Crudo: masticar pequeños trozos para náuseas'
    ],
    images: [
      'https://images.unsplash.com/photo-1717769071502-e9b5d06c5fc2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1577443289937-8c3c5d64c86c?w=800&h=600&fit=crop'
    ],
    rating: 4.7,
    totalRatings: 154,
    likes: 312,
    authorId: '1',
    authorName: 'María González',
    createdAt: new Date('2026-02-05'),
    comments: []
  },
  {
    id: '4',
    name: 'Menta',
    scientificName: 'Mentha piperita',
    description: 'La menta es una planta aromática con hojas refrescantes y propiedades medicinales. Es especialmente útil para problemas digestivos y dolores de cabeza.',
    shortDescription: 'Planta refrescante para digestión y dolores',
    properties: ['Digestiva', 'Analgésica', 'Refrescante', 'Antiespasmódica'],
    diseases: ['dolor de cabeza', 'indigestión', 'náuseas', 'gases', 'síndrome intestino irritable'],
    preparations: [
      'Infusión: 5-6 hojas frescas por taza de agua caliente',
      'Aceite esencial: aplicar en sienes para dolor de cabeza',
      'Masticar hojas frescas para mal aliento'
    ],
    images: [
      'https://images.unsplash.com/photo-1679061583335-c8be1c6209f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1628557044797-f21657419321?w=800&h=600&fit=crop'
    ],
    rating: 4.6,
    totalRatings: 87,
    likes: 167,
    authorId: '3',
    authorName: 'Ana Torres',
    createdAt: new Date('2026-02-01'),
    comments: []
  },
  {
    id: '5',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis',
    description: 'El aloe vera es una planta suculenta conocida por sus propiedades curativas, especialmente para la piel. El gel de sus hojas tiene múltiples aplicaciones medicinales y cosméticas.',
    shortDescription: 'Planta suculenta ideal para la piel y cicatrización',
    properties: ['Cicatrizante', 'Hidratante', 'Antiinflamatorio', 'Regenerador'],
    diseases: ['quemaduras', 'heridas', 'piel seca', 'acné', 'psoriasis', 'estreñimiento'],
    preparations: [
      'Gel tópico: extraer el gel de las hojas y aplicar directamente',
      'Jugo: licuar el gel con agua para consumo interno',
      'Mascarillas: mezclar gel con miel para tratamientos faciales'
    ],
    images: [
      'https://images.unsplash.com/photo-1643717101835-ea24088aef16?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&h=600&fit=crop'
    ],
    rating: 4.9,
    totalRatings: 203,
    likes: 445,
    authorId: '2',
    authorName: 'Dr. Pedro Sánchez',
    createdAt: new Date('2026-01-25'),
    comments: []
  },
  {
    id: '6',
    name: 'Lavanda',
    scientificName: 'Lavandula angustifolia',
    description: 'La lavanda es una planta aromática con flores moradas conocida por sus propiedades relajantes y aromáticas. Se utiliza ampliamente en aromaterapia y medicina natural.',
    shortDescription: 'Flor aromática con propiedades calmantes',
    properties: ['Relajante', 'Antiséptico', 'Analgésico', 'Cicatrizante'],
    diseases: ['ansiedad', 'insomnio', 'estrés', 'dolores de cabeza', 'quemaduras leves'],
    preparations: [
      'Infusión: 1 cucharada de flores secas por taza',
      'Aceite esencial: aplicar en almohada o difusor',
      'Baños relajantes: agregar flores o aceite al agua'
    ],
    images: [
      'https://images.unsplash.com/photo-1644409496856-a92543edbc64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595110715848-2d43c4b0c3e7?w=800&h=600&fit=crop'
    ],
    rating: 4.7,
    totalRatings: 142,
    likes: 289,
    authorId: '1',
    authorName: 'María González',
    createdAt: new Date('2026-01-20'),
    comments: []
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Introducción a las Plantas Medicinales',
    summary: 'Descubre el fascinante mundo de las plantas medicinales y cómo han sido utilizadas durante siglos para tratar diversas dolencias.',
    content: 'Las plantas medicinales han sido utilizadas por la humanidad desde tiempos ancestrales. Cada cultura ha desarrollado su propio conocimiento sobre las propiedades curativas de las plantas de su región...',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&h=400&fit=crop',
    category: 'Introducción',
    authorId: '1',
    authorName: 'María González',
    createdAt: new Date('2026-02-01'),
    readTime: 8
  },
  {
    id: '2',
    title: 'Cómo Preparar Infusiones Correctamente',
    summary: 'Aprende las técnicas adecuadas para preparar infusiones y extraer al máximo las propiedades de las plantas medicinales.',
    content: 'La preparación correcta de infusiones es fundamental para obtener los mejores resultados. La temperatura del agua, el tiempo de reposo y la cantidad de planta utilizada son factores clave...',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=400&fit=crop',
    category: 'Preparación',
    authorId: '2',
    authorName: 'Dr. Pedro Sánchez',
    createdAt: new Date('2026-02-10'),
    readTime: 6
  },
  {
    id: '3',
    title: 'Plantas para la Salud Digestiva',
    summary: 'Conoce las mejores plantas medicinales para mantener tu sistema digestivo saludable y tratar problemas comunes.',
    content: 'El sistema digestivo es fundamental para nuestra salud general. Muchas plantas medicinales pueden ayudar a mantenerlo en óptimas condiciones...',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=400&fit=crop',
    category: 'Salud Digestiva',
    authorId: '3',
    authorName: 'Ana Torres',
    createdAt: new Date('2026-02-15'),
    readTime: 10
  },
  {
    id: '4',
    title: 'Remedios Naturales para el Estrés',
    summary: 'Descubre cómo las plantas medicinales pueden ayudarte a manejar el estrés y la ansiedad de forma natural.',
    content: 'El estrés es uno de los problemas más comunes en la sociedad moderna. Afortunadamente, la naturaleza nos ofrece soluciones efectivas...',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
    category: 'Bienestar Mental',
    authorId: '1',
    authorName: 'María González',
    createdAt: new Date('2026-02-20'),
    readTime: 7
  }
];