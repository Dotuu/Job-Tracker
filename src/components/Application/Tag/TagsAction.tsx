import { ManageTags } from "./ManageTags";
import { NewTag } from "./NewTag";
import type { NewTagData, Tag } from "@/lib/types";

interface TagsActionProps {
  tags: Tag[];
  newTag: (tag: NewTagData) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (tagId: number) => void;
}

export const TagsAction = ({
  tags,
  newTag,
  updateTag,
  deleteTag,
}: TagsActionProps) => {
  return (
    <>
      <NewTag newTag={newTag} tags={tags} />
      <ManageTags updateTag={updateTag} deleteTag={deleteTag} tags={tags} />
    </>
  );
};
