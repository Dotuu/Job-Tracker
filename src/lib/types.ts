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
}

export interface NewApplicationProps {
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  dateApplied?: string;
  source?: string;
  status: string;
}

export interface DeleteApplicationProps {
  applicationId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onDeleted: (id: number) => void;
}
