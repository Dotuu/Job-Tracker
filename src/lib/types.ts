export interface JobApplication {
  id: number;
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  status: string;
  dateApplied?: string;
  dateRejected?: string;
  notes: string;
  source?: string;
  location?: string;
  locationType: string;
  resumeId?: number;
  tagIds?: number[];
}

export interface Tag {
  id?: number;
  name: string;
  colorHex: string;
  scope: string;
}

export interface Resume {
  id?: number;
  fileName: string;
  contentType?: string;
  sizeBytes?: number;
  isDefault: boolean;
  uplodedAt?: string;
}

export interface NewApplicationProps {
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  dateApplied?: string;
  source?: string;
  status: string;
  location?: string;
  locationType?: string;
  resumeId?: number;
  tagIds?: number[];
}

export interface DeleteApplicationProps {
  applicationId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onDeleted: (id: number) => void;
}
