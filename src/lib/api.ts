import type { JobApplication, NewApplicationProps } from "./types";

const BASE_URL = "http://localhost:8080/api";

const authFetch = async (
  path: string,
  token: string,
  init: RequestInit = {},
) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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
