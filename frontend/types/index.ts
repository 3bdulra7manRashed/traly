export type FormFieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "multi_checkbox"
  | "boolean"
  | "number";

export interface FormField {
  id?: number;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string | null;
  help_text?: string | null;
  options?: Record<string, string> | string[] | null;
  validation_rules?: string[] | null;
  conditional_rules?: Record<string, any> | null;
  field_order?: number;
}

export interface GeneratorStep {
  id?: number;
  title: string;
  description?: string | null;
  step_order?: number;
  fields?: FormField[];
}

export interface PromptGenerator {
  id: number;
  title: string;
  slug: string;
  icon?: string | null;
  short_description?: string | null;
  prompt_template?: string;
  is_active: boolean;
  order: number;
  steps?: GeneratorStep[];
  created_at?: string;
}

export interface PromptGenerationResult {
  id: number;
  generator_slug: string;
  compiled_prompt: string;
  inputs?: Record<string, any>;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  articles_count?: number;
  created_at?: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  image_url?: string | null;
  excerpt?: string | null;
  content: string;
  keywords?: string[];
  is_published: boolean;
  published_at?: string | null;
  category?: Category;
  author?: Author;
  related_articles?: Article[];
  created_at?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}
