import type { NewApplicationProps } from "@/lib/types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../../ui/combobox";
import { Button } from "../../ui/button";
import {
  ArrowRightLeft,
  BuildingComplex,
  CalendarIcon,
  House,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

interface ApplicationFormProps {
  initialValues?: NewApplicationProps;
  submitLabel: string;
  onSubmit: (data: NewApplicationProps) => Promise<void>;
}

export const ApplicationForm = ({
  initialValues,
  submitLabel,
  onSubmit,
}: ApplicationFormProps) => {
  const jobSource: string[] = ["Linkedin", "Referral", "Google", "Indeed"];
  const jobStatus: string[] = [
    "Applied",
    "Phone Screen",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
  ];

  const [errors, setErrors] = useState({
    status: false,
    companyName: false,
    roleTitle: false,
    locationType: false,
  });

  const convertToEnumValue = (str: string): string => {
    return str.toUpperCase().replace(" ", "_");
  };

  const convertFromEnumValue = (str: string): string => {
    return str
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [date, setDate] = useState<Date | undefined>(
    initialValues?.dateApplied
      ? parseISO(initialValues.dateApplied)
      : undefined,
  );
  const [jobSourceValue, setJobSourceValue] = useState(
    initialValues?.source ?? "",
  );
  const [jobStatusValue, setJobStatusValue] = useState(
    initialValues?.status ? convertFromEnumValue(initialValues.status) : "",
  );

  const [hideLocation, setHideLocation] = useState(
    !initialValues?.locationType || initialValues.locationType === "REMOTE",
  );

  const locationCardClass = errors.locationType
    ? "border-destructive"
    : undefined;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const applicationData: NewApplicationProps = {
      companyName: String(formData.get("company_name") ?? ""),
      roleTitle: String(formData.get("role_title") ?? ""),
      jobUrl: String(formData.get("job_url") ?? ""),
      dateApplied: date ? format(date, "yyyy-MM-dd") : "",
      source: jobSourceValue,
      status: convertToEnumValue(jobStatusValue),
      location: String(formData.get("job_location") ?? ""),
      locationType: convertToEnumValue(
        String(formData.get("job_location_radio") ?? ""),
      ),
    };

    try {
      if (validateForm(applicationData)) {
        await onSubmit(applicationData);
      }
    } catch (error) {
      throw new Error("Failed to submit application");
    }
  };

  const validateForm = (data: NewApplicationProps): boolean => {
    let validate: boolean = true;

    if (data.dateApplied == "" || data.dateApplied == null) {
      data.dateApplied = format(Date.now(), "yyyy-MM-dd");
    }

    if (data.roleTitle == "" || data.roleTitle == null) {
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

    if (data.locationType == "" || data.locationType == null) {
      setErrors((prev) => ({
        ...prev,
        locationType: true,
      }));

      validate = false;
    } else {
      setErrors((prev) => ({
        ...prev,
        locationType: false,
      }));
    }

    return validate;
  };

  const onLocationSelect = (val: string) => {
    updateError("locationType", val);
    if (val === "REMOTE") {
      setHideLocation(true);
      return;
    }
    setHideLocation(false);
  };

  const updateError = (field: keyof typeof errors, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: value.trim() === "" }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <Field data-invalid={errors.companyName}>
          <FieldLabel htmlFor={"company_name"}>Company Name</FieldLabel>
          <Input
            id={"company_name"}
            name={"company_name"}
            placeholder={"Enter Company Name"}
            defaultValue={initialValues?.companyName}
            aria-invalid={errors.companyName}
            onChange={(e) => updateError("companyName", e.target.value)}
          />
        </Field>

        <Field data-invalid={errors.roleTitle}>
          <FieldLabel htmlFor={"role_title"}>Role Title</FieldLabel>
          <Input
            id={"role_title"}
            name={"role_title"}
            placeholder={"Enter Role Title"}
            defaultValue={initialValues?.roleTitle}
            aria-invalid={errors.roleTitle}
            onChange={(e) => updateError("roleTitle", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={"job_url"}>Company Website</FieldLabel>
          <Input
            id={"job_url"}
            name={"job_url"}
            placeholder={"Enter a link to the companies website"}
            defaultValue={initialValues?.jobUrl}
          />
        </Field>
        <Label
          htmlFor={"job_location_radio"}
          className={errors.locationType ? "text-destructive" : undefined}
        >
          Job Location
        </Label>
        <RadioGroup
          id={"job_location_radio"}
          name={"job_location_radio"}
          defaultValue={initialValues?.locationType}
          onValueChange={onLocationSelect}
        >
          <FieldLabel htmlFor={"remote"} className={locationCardClass}>
            <Field orientation={"horizontal"}>
              <FieldContent>
                <FieldTitle>Remote {<House />}</FieldTitle>
                <FieldDescription>Job that is fully remote.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="REMOTE" id="remote" />
            </Field>
          </FieldLabel>

          <FieldLabel htmlFor={"hybrid"} className={locationCardClass}>
            <Field orientation={"horizontal"}>
              <FieldContent>
                <FieldTitle>Hybrid {<ArrowRightLeft />}</FieldTitle>
                <FieldDescription>
                  Job that is a mix of remote & on-site.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="HYBRID" id="hybrid" />
            </Field>
          </FieldLabel>

          <FieldLabel htmlFor={"on_site"} className={locationCardClass}>
            <Field orientation={"horizontal"}>
              <FieldContent>
                <FieldTitle>On-Site {<BuildingComplex />}</FieldTitle>
                <FieldDescription>Job that is fully on-site.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="ON_SITE" id="on_site" />
            </Field>
          </FieldLabel>
        </RadioGroup>

        <Field hidden={hideLocation}>
          <Input
            id={"job_location"}
            name={"job_location"}
            placeholder={"Enter job location"}
            defaultValue={initialValues?.location}
          />
        </Field>
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
              <Calendar mode={"single"} selected={date} onSelect={setDate} />
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
            defaultValue={jobSourceValue || null}
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
            defaultValue={jobStatusValue || null}
            onValueChange={(value: string | null) => {
              setJobStatusValue(value ?? "");
              updateError("status", value ?? "");
            }}
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
          <Button type={"submit"}>{submitLabel}</Button>
        </Field>
      </FieldSet>
    </form>
  );
};
