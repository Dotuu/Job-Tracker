export interface JobApplication {
  jobId: number;
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  appliedDate?: string;
  jobSource?: string;
  jobStatus: string;
  notes: string;
}

export interface NewApplicationProps {
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  appliedDate?: string;
  jobSource?: string;
  jobStatus: string;
}
