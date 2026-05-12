export interface PostModel {
  id: number;
  slug: string;
  status: 'draft' | 'published';

  title: string;
  content: string;

  title_en?: string;
  content_en?: string;

  short_description?: string;
  short_description_en?: string;

  cover_url?: string | null;

  created_at?: string;

  is_favorited?: boolean;

  user?: {
    id: number;
    name: string;
    surname: string;
  };
}
