import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { Resume } from "@/lib/types";
import { FileTextIcon } from "lucide-react";
import { useState } from "react";

interface ResumeFormProps {
  submitResume: (resume: Resume) => void;
}

export const ResumeForm = ({ submitResume }: ResumeFormProps) => {
  const handleResumeSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fileExists) {
      setFileError(true);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const file = formData.get("resume_file");

    if (!(file instanceof File) || file.size === 0) {
      setFileError(true);
      return;
    }

    let resumeTitle = String(formData.get("resume_title") ?? "");
    const fileName = file.name;

    if (resumeTitle.trim() === "") {
      resumeTitle = fileName.replace(/\.[^/.]+$/, "");
    }

    const resume: Resume = {
      fileName: resumeTitle,
      isDefault: false,
    };

    submitResume(resume);
  };

  const [title, setTitle] = useState("");
  const [fileExists, setFileExists] = useState(false);
  const [fileError, setFileError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFileExists(false);
      setFileError(true);
      return;
    }

    setFileExists(true);
    setFileError(false);

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
        <Field data-invalid={fileError}>
          <FieldLabel htmlFor="resume_file">Upload Resume - PDF</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <FileTextIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="resume_file"
              name="resume_file"
              type="file"
              accept=".pdf,.doc,.docx"
              className="cursor-pointer py-0 leading-9 text-muted-foreground file:hidden"
              aria-invalid={fileError}
              onChange={handleFileChange}
            />
          </InputGroup>
          {fileError && (
            <FieldError>
              Please select a resume file before uploading.
            </FieldError>
          )}
        </Field>
        <Field>
          <Button type={"submit"}>Upload Resume</Button>
        </Field>
      </FieldSet>
    </form>
  );
};
