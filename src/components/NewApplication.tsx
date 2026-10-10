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

  const [date, setDate] = useState<Date>();
  const [jobSourceValue, setJobSourceValue] = useState("");
  const [jobStatusValue, setJobStatusValue] = useState("Applied");
  const { user } = useUser();
  const getAuthToken = useAuthToken();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      throw new Error("User is not authenticated!");
      return;
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
      postApplication(token, applicationData);
    } catch (error) {
      throw new Error("Failed to submit application");
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button>New Application</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor={"company_name"}>Company Name</FieldLabel>
              <Input
                id={"company_name"}
                name={"company_name"}
                placeholder={"Enter Company Name"}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={"role_title"}>Role Title</FieldLabel>
              <Input
                id={"role_title"}
                name={"role_title"}
                placeholder={"Enter Role Title"}
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

              <Field>
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
                  <ComboboxInput placeholder={"Current job status"} />
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
