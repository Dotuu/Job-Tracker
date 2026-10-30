import { ManageTags } from "./ManageTags";
import { NewTag } from "./NewTag";
import type { TagProps } from "./Tags";

interface TagsActionProps {
  tags: TagProps[];
  newTag: (tag: TagProps) => void;
  updateTag: (tag: TagProps) => void;
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
