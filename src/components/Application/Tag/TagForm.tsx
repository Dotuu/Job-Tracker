import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

export interface TagFormValues {
  name: string;
  colorHex: string;
}

interface TagFormProps {
  initialValues?: TagFormValues;
  submitLabel: string;
  onSubmit: (values: TagFormValues) => void | Promise<void>;
  existingNames: string[];
  secondaryAction?: ReactNode;
}

export const PRESET_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

const HEX_PATTERN = /^#[0-9A-F]{6}$/i;
const MAX_NAME_LENGTH = 50;
const FALLBACK_COLOR = "#737373";

export const TagPill = ({
  name,
  colorHex,
}: {
  name: string;
  colorHex: string;
}) => {
  const color = HEX_PATTERN.test(colorHex) ? colorHex : FALLBACK_COLOR;
  const style: CSSProperties = {
    color,
    backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
    borderColor: `color-mix(in oklch, ${color} 35%, transparent)`,
  };

  return (
    <span
      className="inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-0.5 text-xs font-medium"
      style={style}
    >
      {name || "Tag name"}
    </span>
  );
};

export const TagForm = ({
  initialValues,
  submitLabel,
  onSubmit,
  existingNames,
  secondaryAction,
}: TagFormProps) => {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [colorHex, setColorHex] = useState(
    (initialValues?.colorHex ?? PRESET_COLORS[5]).toUpperCase(),
  );
  const [submitted, setSubmitted] = useState(false);

  const trimmedName = name.trim();
  const isDuplicate = existingNames.some(
    (existing) => existing.toLowerCase() === trimmedName.toLowerCase(),
  );
  const nameError = !trimmedName
    ? "Tag name is required"
    : isDuplicate
      ? "A tag with this name already exists"
      : null;
  const colorError = HEX_PATTERN.test(colorHex)
    ? null
    : "Enter a hex color like #3B82F6";

  const handleHexChange = (value: string) => {
    const next = value.startsWith("#") ? value : `#${value}`;
    setColorHex(next.slice(0, 7).toUpperCase());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || colorError) return;
    await onSubmit({ name: trimmedName, colorHex });
  };

  const showNameError = Boolean(nameError) && (submitted || isDuplicate);

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <Field data-invalid={showNameError}>
          <FieldLabel htmlFor={"tag_name"}>Tag Name</FieldLabel>
          <Input
            id={"tag_name"}
            name={"tag_name"}
            autoFocus
            maxLength={MAX_NAME_LENGTH}
            placeholder={"e.g. Fav company"}
            value={name}
            aria-invalid={showNameError}
            onChange={(e) => setName(e.target.value)}
          />
          {showNameError && <FieldError>{nameError}</FieldError>}
        </Field>

        <Field data-invalid={Boolean(colorError)}>
          <FieldLabel htmlFor={"tag_color"}>Color</FieldLabel>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((color) => {
              const selected = colorHex === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use color ${color}`}
                  aria-pressed={selected}
                  onClick={() => setColorHex(color)}
                  className={`size-6 rounded-full border border-black/10 transition-transform hover:scale-110 ${
                    selected
                      ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}

            <label
              className={`relative size-6 cursor-pointer overflow-hidden rounded-full border bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)] transition-transform hover:scale-110 ${
                !PRESET_COLORS.includes(colorHex) && !colorError
                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                  : ""
              }`}
              title="Custom color"
            >
              <input
                type="color"
                aria-label="Custom color"
                value={colorError ? "#000000" : colorHex}
                onChange={(e) => setColorHex(e.target.value.toUpperCase())}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>

            <Input
              id={"tag_color"}
              name={"tag_color"}
              value={colorHex}
              aria-invalid={Boolean(colorError)}
              onChange={(e) => handleHexChange(e.target.value)}
              className="ml-auto h-8 w-24 font-mono text-xs uppercase"
            />
          </div>
          {colorError ? (
            <FieldError>{colorError}</FieldError>
          ) : (
            <FieldDescription>
              Pick a preset, use the custom picker, or enter a hex code.
            </FieldDescription>
          )}
        </Field>

        <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
          <span>Preview</span>
          <TagPill name={trimmedName} colorHex={colorHex} />
        </div>

        <Field orientation={"horizontal"}>
          {secondaryAction}
          <Button type={"submit"} className="ml-auto">
            {submitLabel}
          </Button>
        </Field>
      </FieldSet>
    </form>
  );
};
