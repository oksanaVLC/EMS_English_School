export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LessonType =
  | 'grammar'
  | 'vocabulary'
  | 'reading'
  | 'listening'
  | 'pronunciation'
  | 'writing'
  | 'speaking';

export type LessonStatus = 'draft' | 'published';

export interface LessonModel {
  id: number;

  // IDENTIDAD
  title: string;
  slug: string;

  // NIVEL Y TIPO
  level: LessonLevel;
  type: LessonType;

  // CONTENIDO
  explanation: string;

  // MEDIA
  video_url?: string;
  pdf_url?: string;
  cover_url?: string;

  // TAGS
  tags?: string[];

  // UI
  order: number;

  // ESTADO CMS
  status: LessonStatus;
}
