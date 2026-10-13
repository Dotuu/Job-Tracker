import { useState } from "react";
import { Button } from "./ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useUser } from "@clerk/react";
import type { NewApplicationProps } from "@/lib/types";
import { useAuthToken } from "@/hooks/use-api";
import { postApplication } from "@/lib/api";

export const NewApplication = () => {
  const jobSource: string[] = ["Linkedin", "Referral", "Google", "Indeed"];
  const jobStatus: string[] = [
    "Applied",
    "Phone Screen",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
  ];

  const convertToEnumValue = (str: string): string => {
    return str.toUpperCase().replace(" ", "_");
  };

  const [errors, setErrors] = useState({
    status: false,
    companyName: false,
    roleTitle: false,
  });

  const validateForm = (data: NewApplicationProps): boolean => {
    let validate: boolean = true;

    if (data.dateApplied == "" || data.dateApplied == null) {
      data.dateApplied = format(Date.now(), "yyyy-MM-dd");
    }

    if (data.status == "" || data.status == null) {
      setErrors((prev) => ({
        ...prev,
        roleTitle: true,
      }));

      validate = false;
    } else {
      setErrors((prev) => ({
        ...prev,
        roleTitle: false,
      }));
    }

    if (data.status == "" || data.status == null) {
      setErrors((prev) => ({
        ...prev,
        status: true,
      }));

      validate = false;
    } else {
      setErrors((prev) => ({
        ...prev,
        status: false,
      }));
    }

    if (data.companyName == "" || data.companyName == null) {
      setErrors((prev) => ({
        ...prev,
        companyName: true,
      }));

      validate = false;
    } else {
      setErrors((prev) => ({
        ...prev,
        companyName: false,
      }));
    }

    return validate;
  };

  const [date, setDate] = useState<Date>();
  const [jobSourceValue, setJobSourceValue] = useState("");
  const [jobStatusValue, setJobStatusValue] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const getAuthToken = useAuthToken();

  const resetForm = () => {
    setDate(undefined);
    setJobSourceValue("");
    setJobStatusValue("");
    setErrors({ status: false, companyName: false, roleTitle: false });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      throw new Error("User is not authenticated!");
    }

    const formData = new FormData(e.currentTarget);

    const applicationData: NewApplicationProps = {
      companyName: String(formData.get("company_name") ?? ""),
      roleTitle: String(formData.get("role_title") ?? ""),
      jobUrl: String(formData.get("job_url") ?? ""),
      dateApplied: date ? format(date, "yyyy-MM-dd") : "",
      source: jobSourceValue,
      status: convertToEnumValue(jobStatusValue),
    };

    try {
      const token = await getAuthToken();

      if (validateForm(applicationData)) {
        postApplication(token, applicationData);
        setOpen(false);
      }
    } catch (error) {
      throw new Error("Failed to submit application");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button>New Application</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <Field data-invalid={errors.companyName}>
              <FieldLabel htmlFor={"company_name"}>Company Name</FieldLabel>
              <Input
                id={"company_name"}
                name={"company_name"}
                placeholder={"Enter Company Name"}
                aria-invalid={errors.companyName}
              />
            </Field>

            <Field data-invalid={errors.roleTitle}>
              <FieldLabel htmlFor={"role_title"}>Role Title</FieldLabel>
              <Input
                id={"role_title"}
                name={"role_title"}
                placeholder={"Enter Role Title"}
                aria-invalid={errors.roleTitle}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={"job_url"}>Company Website</FieldLabel>
              <Input
                id={"job_url"}
                name={"job_url"}
                placeholder={"Enter a link to the companies website"}
              />
            </Field>

            <div className="application_form_group">
              <Field>
                <FieldLabel htmlFor={"applied_date"}>
                  Enter date you applied
                </FieldLabel>
                <Popover>
                  <PopoverTrigger
                    id={"applied_date"}
                    render={<Button data-empty={!date} />}
                  >
                    <CalendarIcon />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Select date you applied</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode={"single"}
                      selected={date}
                      onSelect={setDate}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel htmlFor={"job_source"}>
                  Where did you see this job posted?
                </FieldLabel>
                <Combobox
                  id={"job_source"}
                  items={jobSource}
                  onValueChange={(value: string | null) =>
                    setJobSourceValue(value ?? "")
                  }
                >
                  <ComboboxInput placeholder={"Where was this job listed?"} />
                  <ComboboxContent>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field data-invalid={errors.status}>
                <FieldLabel htmlFor={"job_status"}>
                  What is the current job status?
                </FieldLabel>
                <Combobox
                  id={"job_status"}
                  items={jobStatus}
                  onValueChange={(value: string | null) =>
                    setJobStatusValue(value ?? "")
                  }
                >
                  <ComboboxInput
                    placeholder={"Current job status"}
                    aria-invalid={errors.status}
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <Button type={"submit"}>Create Application</Button>
              </Field>
            </div>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};
