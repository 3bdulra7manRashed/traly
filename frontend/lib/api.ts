import {
  ApiResponse,
  Article,
  Category,
  PromptGenerationResult,
  PromptGenerator,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("traly_admin_token");
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const token = getAuthToken();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "حدث خطأ أثناء معالجة الطلب",
        response.status,
        data.errors
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "فشل الاتصال بالخادم",
      500
    );
  }
}

export interface AdminStats {
  total_articles: number;
  published_articles: number;
  total_generators: number;
  active_generators: number;
  total_generations: number;
  total_categories: number;
  recent_generations: Array<{
    id: number;
    generator_title: string;
    generator_slug: string;
    generator_icon?: string;
    user_name: string;
    inputs_preview: Record<string, any>;
    created_at: string;
  }>;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export const api = {
  // Public Generators
  async getGenerators(): Promise<PromptGenerator[]> {
    const res = await fetchApi<PromptGenerator[]>("/generators");
    return res.data;
  },

  async getGenerator(slug: string): Promise<PromptGenerator> {
    const res = await fetchApi<PromptGenerator>(`/generators/${slug}`);
    return res.data;
  },

  async generatePrompt(
    slug: string,
    inputs: Record<string, any>
  ): Promise<PromptGenerationResult> {
    const res = await fetchApi<PromptGenerationResult>(
      `/generators/${slug}/generate`,
      {
        method: "POST",
        body: JSON.stringify({ inputs }),
        cache: "no-store",
      }
    );
    return res.data;
  },

  // Public Articles
  async getArticles(params?: {
    category?: string;
    search?: string;
    page?: number;
  }): Promise<ApiResponse<Article[]>> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", params.page.toString());

    const qs = query.toString();
    const endpoint = `/articles${qs ? `?${qs}` : ""}`;
    return fetchApi<Article[]>(endpoint);
  },

  async getArticle(slug: string): Promise<Article> {
    const res = await fetchApi<Article>(`/articles/${slug}`);
    return res.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetchApi<Category[]>("/categories");
    return res.data;
  },

  // ================= ADMIN & AUTH API =================
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetchApi<{ token: string; user: AdminUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },

  async logout(): Promise<void> {
    await fetchApi<void>("/auth/logout", {
      method: "POST",
    });
  },

  async getMe(): Promise<AdminUser> {
    const res = await fetchApi<AdminUser>("/auth/me");
    return res.data;
  },

  // Admin Stats
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetchApi<AdminStats>("/admin/stats");
    return res.data;
  },

  // Admin Articles
  async getAdminArticles(params?: {
    search?: string;
    category_id?: number;
    is_published?: boolean;
    page?: number;
  }): Promise<ApiResponse<Article[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.category_id) query.append("category_id", params.category_id.toString());
    if (params?.is_published !== undefined) query.append("is_published", params.is_published.toString());
    if (params?.page) query.append("page", params.page.toString());

    const qs = query.toString();
    return fetchApi<Article[]>(`/admin/articles${qs ? `?${qs}` : ""}`);
  },

  async getAdminArticle(id: number): Promise<Article> {
    const res = await fetchApi<Article>(`/admin/articles/${id}`);
    return res.data;
  },

  async createArticle(data: Partial<Article>): Promise<Article> {
    const res = await fetchApi<Article>("/admin/articles", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateArticle(id: number, data: Partial<Article>): Promise<Article> {
    const res = await fetchApi<Article>(`/admin/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async togglePublishArticle(id: number): Promise<{ id: number; is_published: boolean }> {
    const res = await fetchApi<{ id: number; is_published: boolean }>(
      `/admin/articles/${id}/toggle-publish`,
      {
        method: "PATCH",
      }
    );
    return res.data;
  },

  async deleteArticle(id: number): Promise<void> {
    await fetchApi<void>(`/admin/articles/${id}`, {
      method: "DELETE",
    });
  },

  // Admin Generators
  async getAdminGenerators(params?: {
    search?: string;
    is_active?: boolean;
  }): Promise<PromptGenerator[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.is_active !== undefined) query.append("is_active", params.is_active.toString());

    const qs = query.toString();
    const res = await fetchApi<PromptGenerator[]>(`/admin/generators${qs ? `?${qs}` : ""}`);
    return res.data;
  },

  async getAdminGenerator(id: number): Promise<PromptGenerator> {
    const res = await fetchApi<PromptGenerator>(`/admin/generators/${id}`);
    return res.data;
  },

  async createGenerator(data: Partial<PromptGenerator>): Promise<PromptGenerator> {
    const res = await fetchApi<PromptGenerator>("/admin/generators", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateGenerator(id: number, data: Partial<PromptGenerator>): Promise<PromptGenerator> {
    const res = await fetchApi<PromptGenerator>(`/admin/generators/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async toggleActiveGenerator(id: number): Promise<{ id: number; is_active: boolean }> {
    const res = await fetchApi<{ id: number; is_active: boolean }>(
      `/admin/generators/${id}/toggle-active`,
      {
        method: "PATCH",
      }
    );
    return res.data;
  },

  async deleteGenerator(id: number): Promise<void> {
    await fetchApi<void>(`/admin/generators/${id}`, {
      method: "DELETE",
    });
  },
};
