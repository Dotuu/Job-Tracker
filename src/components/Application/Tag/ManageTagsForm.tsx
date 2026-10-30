import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { TagForm, type TagFormValues } from "./TagForm";
import type { TagProps } from "./Tags";

interface ManageTagsFormProps {
  tags: TagProps[];
  updateTag: (tag: TagProps) => void | Promise<void>;
  deleteTag: (tagId: number) => void | Promise<void>;
  onDone: () => void;
}

export const ManageTagsForm = ({
  tags,
  updateTag,
  deleteTag,
  onDone,
}: ManageTagsFormProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedTag = tags.find((tag) => tag.id === selectedId) ?? null;

  const selectTag = (tag: TagProps | null) => {
    setSelectedId(tag?.id ?? null);
    setConfirmDelete(false);
  };

  const handleUpdate = async ({ name, colorHex }: TagFormValues) => {
    if (!selectedTag) return;
    if (name !== selectedTag.name || colorHex !== selectedTag.colorHex) {
      await updateTag({ ...selectedTag, name, colorHex });
    }
    onDone();
  };

  const handleDelete = async () => {
    if (!selectedTag) return;
    if (!selectedTag.id) return;

    await deleteTag(selectedTag.id);
    selectTag(null);
  };

  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
        <Tag className="size-8 opacity-50" />
        <p>No tags yet. Create one with “New Tag” first.</p>
      </div>
    );
  }

  const deleteAction = confirmDelete ? (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs text-muted-foreground">Delete?</span>
      <Button
        type={"button"}
        variant="ghost"
        size="xs"
        onClick={() => setConfirmDelete(false)}
      >
        Cancel
      </Button>
      <Button
        type={"button"}
        variant="destructive"
        size="xs"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  ) : (
    <Button
      type={"button"}
      variant="ghost"
      className="text-muted-foreground hover:text-destructive"
      onClick={() => setConfirmDelete(true)}
    >
      <Trash2 />
      Delete Tag
    </Button>
  );

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor={"manage_tag_select"}>Tag to edit</FieldLabel>
        <Combobox
          id={"manage_tag_select"}
          items={tags}
          itemToStringLabel={(tag: TagProps) => tag.name}
          itemToStringValue={(tag: TagProps) => String(tag.id)}
          value={selectedTag}
          onValueChange={(tag: TagProps | null) => selectTag(tag)}
        >
          <ComboboxInput placeholder={"Choose a tag"} />
          <ComboboxContent>
            <ComboboxList>
              {(tag: TagProps) => (
                <ComboboxItem key={tag.id} value={tag}>
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: tag.colorHex }}
                  />
                  {tag.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      {selectedTag && (
        <TagForm
          key={selectedTag.id}
          initialValues={{
            name: selectedTag.name,
            colorHex: selectedTag.colorHex,
          }}
          submitLabel={"Save Changes"}
          onSubmit={handleUpdate}
          existingNames={tags
            .filter((tag) => tag.id !== selectedTag.id)
            .map((tag) => tag.name)}
          secondaryAction={deleteAction}
        />
      )}
    </div>
  );
};
