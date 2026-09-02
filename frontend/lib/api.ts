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

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Next.js cache settings
      next: { revalidate: 60 },
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

export const api = {
  // Generators
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
        // Never cache generation POST requests
        cache: "no-store",
      }
    );
    return res.data;
  },

  // Articles & Knowledge Hub
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

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetchApi<Category[]>("/categories");
    return res.data;
  },
};
