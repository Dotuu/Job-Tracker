import "./ApplicationSearch.scss";
import { Info } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ApplicationSearchProps {
  onSearchChange: (query: string) => void;
}

export const ApplicationSearch = ({
  onSearchChange,
}: ApplicationSearchProps) => {
  return (
    <div className="applicaion_search_wrapper">
      <InputGroup id={"appliation_search"}>
        <InputGroupInput
          placeholder={"Search Applications..."}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <InputGroupButton size="icon-xs" aria-label="Search Info" />
              }
            >
              <Info />
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-60 flex-col items-start gap-1 bg-zinc-900 px-2.5 py-2 text-[11px] leading-snug text-zinc-100 **:data-side:bg-zinc-900 **:data-side:fill-zinc-900"
            >
              <p>Search by company, role, date, or location.</p>
              <p>
                Use{" "}
                <code className="rounded bg-white/10 px-1 font-mono">#</code> to
                filter by status, location type, or source, e.g.{" "}
                <code className="rounded bg-white/10 px-1 font-mono">
                  #remote
                </code>
              </p>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
