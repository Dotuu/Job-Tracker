import type { JobApplication, NewApplicationProps, Resume } from "./types";

const BASE_URL = "http://localhost:8080/api";

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
    response.status == 204 ||
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
