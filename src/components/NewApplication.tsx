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

export const NewApplication = () => {
  const jobStatus: string[] = [
    "Applied",
    "Phone Screen",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
  ];

  const jobSource: string[] = ["Linkedin", "Referral"];

  const [date, setDate] = useState<Date>();

  return (
    <Dialog>
      <DialogTrigger render={<Button>New Application</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Application</DialogTitle>
        </DialogHeader>
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

          <Field>
            <Field>
              <FieldLabel htmlFor={"company_name"}>Company Name</FieldLabel>
              <Input id={"company_name"} placeholder={"Enter Company Name"} />
            </Field>
            <Combobox items={jobStatus}>
              <ComboboxInput placeholder={"Select job status"} />
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

          <div className="application_form_group">
            <Field>
              <Popover>
                <PopoverTrigger render={<Button data-empty={!date} />}>
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
              <Combobox items={jobSource}>
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
          </div>
        </FieldSet>
      </DialogContent>
    </Dialog>
  );
};
