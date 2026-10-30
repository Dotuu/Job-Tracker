import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface TagProps {
  id?: number;
  name: string;
  colorHex: string;
  scope: string;
}

interface TagsProps {
  tags: TagProps[];
  activeTagIds: number[];
  onToggle: (tagId: number) => void;
  onClear: () => void;
}

export const Tags = ({ tags, activeTagIds, onToggle, onClear }: TagsProps) => {
  if (tags.length === 0) {
    return <p className="nav_tags_empty">No tags yet</p>;
  }

  return (
    <>
      <ul className="nav_tags">
        {tags.map((tag) => {
          const active = tag.id != null && activeTagIds.includes(tag.id);
          return (
            <li key={tag.id}>
              <Button
                variant="ghost"
                size="sm"
                className={`nav_tag${active ? " nav_tag_active" : ""}`}
                aria-pressed={active}
                onClick={() => tag.id != null && onToggle(tag.id)}
              >
                <span
                  className="tag_dot"
                  style={{ background: tag.colorHex }}
                />
                <span className="nav_tag_name">{tag.name}</span>
                {active && <Check className="nav_tag_check" />}
              </Button>
            </li>
          );
        })}
      </ul>
      {activeTagIds.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="nav_tags_clear"
          onClick={onClear}
        >
          Clear filters ({activeTagIds.length})
        </Button>
      )}
    </>
  );
};
