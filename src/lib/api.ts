import type {
  JobApplication,
  NewApplicationProps,
  NewTagData,
  Resume,
  StatusHistory,
  Tag,
} from "./types";

// Set VITE_API_URL (e.g. https://api.yourdomain.com) for production builds.
// The localhost fallback only applies to `npm run dev`.
const API_URL: string | undefined =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:8080" : undefined);

if (!API_URL) {
  throw new Error("VITE_API_URL must be set for production builds");
}

const BASE_URL = `${API_URL}/api`;

const authFetch = async (
  path: string,
  token: string,
  init: RequestInit = {},
) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed ${response.status}`);
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  return response.json();
};

export const postApplication = (
  token: string,
  data: NewApplicationProps,
): Promise<JobApplication> => {
  return authFetch("/applications", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const postTag = (token: string, tag: NewTagData): Promise<Tag> => {
  return authFetch("/tags", token, {
    method: "POST",
    body: JSON.stringify(tag),
  });
};

export const updateTag = (token: string, tag: Tag): Promise<Tag> => {
  return authFetch(`/tags/${tag.id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ name: tag.name, colorHex: tag.colorHex }),
  });
};

export const deleteTag = (token: string, tagId: number) => {
  return authFetch(`/tags/${tagId}`, token, {
    method: "DELETE",
  });
};

export const updateNotes = (
  token: string,
  applicationId: number,
  notes: string,
): Promise<JobApplication> => {
  return authFetch(`/applications/${applicationId}/notes`, token, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });
};

export const getApplications = (token: string): Promise<JobApplication[]> => {
  return authFetch("/applications", token);
};

export const getTags = (token: string): Promise<Tag[]> => {
  return authFetch("/tags", token);
};

export const postResume = (
  token: string,
  file: File,
  title: string,
): Promise<Resume> => {
  const body = new FormData();
  body.append("file", file);
  body.append("title", title);

  return authFetch("/resumes", token, {
    method: "POST",
    body,
  });
};

export const getResumes = (token: string): Promise<Resume[]> => {
  return authFetch("/resumes", token);
};

export const getAllStats = (token: string): Promise<StatusHistory[]> => {
  return authFetch("/stats", token);
};

export const renameResume = (
  token: string,
  resumeId: number,
  fileName: string,
): Promise<Resume> => {
  return authFetch(`/resumes/${resumeId}`, token, {
    method: "PATCH",
    body: JSON.stringify({ fileName }),
  });
};

export const setDefaultResume = (
  token: string,
  resumeId: number,
): Promise<Resume> => {
  return authFetch(`/resumes/${resumeId}/default`, token, {
    method: "PATCH",
  });
};

export const deleteResume = (token: string, resumeId: number) => {
  return authFetch(`/resumes/${resumeId}`, token, {
    method: "DELETE",
  });
};

export const updateApplication = (
  token: string,
  applicationId: number,
  data: NewApplicationProps,
): Promise<JobApplication> => {
  return authFetch(`/applications/${applicationId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateApplicationResume = (
  token: string,
  applicationId: number,
  resumeId: number | null,
): Promise<JobApplication> => {
  return authFetch(`/applications/${applicationId}/resume`, token, {
    method: "PATCH",
    body: JSON.stringify({ resumeId }),
  });
};

export const updateApplicationTags = (
  token: string,
  applicationId: number,
  tagIds: number[],
): Promise<JobApplication> => {
  return authFetch(`/applications/${applicationId}/tags`, token, {
    method: "PUT",
    body: JSON.stringify({ tagIds }),
  });
};

export const deleteApplication = (token: string, applicationId: number) => {
  return authFetch(`/applications/${applicationId}`, token, {
    method: "DELETE",
  });
};

export const searchApplication = (token: string, params: string) => {
  return authFetch(
    `/applications/search?value=${encodeURIComponent(params)}`,
    token,
    {
      method: "GET",
    },
  );
};
