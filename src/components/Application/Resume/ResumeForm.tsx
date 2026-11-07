import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FileTextIcon } from "lucide-react";
import { useState } from "react";

interface ResumeFormProps {
  submitResume: (file: File, title: string) => Promise<void>;
}

// Mirrors the backend limits (app.storage.max-file-size, PDF only). These checks are
// for a friendlier UX only; the backend re-validates every upload.
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MISSING_FILE_ERROR = "Please select a resume file before uploading.";

const validateFile = (file: File): string | null => {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "Only PDF files are allowed.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "File must be 5 MB or smaller.";
  }
  return null;
};

export const ResumeForm = ({ submitResume }: ResumeFormProps) => {
  const [title, setTitle] = useState("");
  const [fileExists, setFileExists] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResumeSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!fileExists) {
      setFileError(MISSING_FILE_ERROR);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const file = formData.get("resume_file");

    if (!(file instanceof File) || file.size === 0) {
      setFileError(MISSING_FILE_ERROR);
      return;
    }

    const invalidReason = validateFile(file);
    if (invalidReason) {
      setFileError(invalidReason);
      return;
    }

    let resumeTitle = String(formData.get("resume_title") ?? "");
    const fileName = file.name;

    if (resumeTitle.trim() === "") {
      resumeTitle = fileName.replace(/\.[^/.]+$/, "");
    }

    setIsSubmitting(true);
    try {
      await submitResume(file, resumeTitle);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFileExists(false);
      setFileError(MISSING_FILE_ERROR);
      return;
    }

    setFileExists(true);
    setFileError(validateFile(file));

    if (title.trim() === "") {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  return (
    <form onSubmit={handleResumeSubmit}>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="resume_title">Resume Title</FieldLabel>
          <Input
            value={title}
            id={"resume_title"}
            name={"resume_title"}
            placeholder={"Enter title of resume"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field data-invalid={fileError !== null}>
          <FieldLabel htmlFor="resume_file">Upload Resume - PDF</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <FileTextIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="resume_file"
              name="resume_file"
              type="file"
              accept=".pdf,application/pdf"
              className="cursor-pointer py-0 leading-9 text-muted-foreground file:hidden"
              aria-invalid={fileError !== null}
              onChange={handleFileChange}
            />
          </InputGroup>
          {fileError && <FieldError>{fileError}</FieldError>}
        </Field>
        <Field>
          <Button type={"submit"} disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Resume"}
          </Button>
        </Field>
      </FieldSet>
    </form>
  );
};
