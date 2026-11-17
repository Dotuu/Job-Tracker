import "./ApplicationSearch.scss";
import { Info } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ApplicationSearchProps {
  onSearchChange: (query: string) => void;
}

export const ApplicationSearch = ({
  onSearchChange,
}: ApplicationSearchProps) => {
  return (
    <div className="application_search_wrapper">
      <InputGroup id={"application_search"}>
        <InputGroupInput
          placeholder={"Search Applications..."}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <Popover>
            <PopoverTrigger
              openOnHover
              delay={200}
              render={
                <InputGroupButton size="icon-xs" aria-label="Search Info" />
              }
            >
              <Info />
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              className="w-auto max-w-[min(15rem,calc(100vw-2rem))] items-start gap-1 px-2.5 py-2 text-[11px] leading-snug"
            >
              <p>Search by company, role, date, or location.</p>
              <p>
                Use <code className="search_hint_code">#</code> to filter by
                status, location type, or source, e.g.{" "}
                <code className="search_hint_code">#remote</code>
              </p>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
