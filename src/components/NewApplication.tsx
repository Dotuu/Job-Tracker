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
import { submitApplication } from "@/lib/api";

export interface NewApplicationProps {
  clerkId: string;
  companyName?: FormDataEntryValue;
  roleTitle?: FormDataEntryValue;
  jobUrl?: FormDataEntryValue;
  appliedDate?: Date;
  jobSource?: FormDataEntryValue;
}

export const NewApplication = () => {
  const jobSource: string[] = ["Linkedin", "Referral", "Google", "Indeed"];

  const [date, setDate] = useState<Date>();
  const [jobSourceValue, setJobSourceValue] = useState("");
  const { user } = useUser();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    if (!user) {
      throw new Error("User is not authenticated!");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const applicationData: NewApplicationProps = {
      clerkId: user.id,
      companyName: formData.get("company_name"),
      roleTitle: formData.get("role_title"),
      jobUrl: formData.get("job_url"),
      appliedDate: date,
      jobSource: jobSourceValue,
    };

    try {
      await submitApplication(applicationData);
    } catch (error) {
      throw new Error(error);
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
              <Input id={"company_name"} placeholder={"Enter Company Name"} />
            </Field>

            <Field>
              <FieldLabel htmlFor={"role_title"}>Role Title</FieldLabel>
              <Input id={"role_title"} placeholder={"Enter Role Title"} />
            </Field>

            <Field>
              <FieldLabel htmlFor={"job_url"}>Company Website</FieldLabel>
              <Input
                id={"job_url"}
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
                  onValueChange={setJobSourceValue}
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
                <Button type={"submit"}>Create Application</Button>
              </Field>
            </div>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};
