"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      handleUnselect(item);
    } else {
      onChange([...selected, item]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-10 h-auto",
              !selected.length && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 max-w-full">
              {selected.length > 0 ? (
                selected.map((item) => {
                  const option = options.find((opt) => opt.value === item);
                  return (
                    <Badge variant="secondary" key={item} className="mr-1 mb-1">
                      {option?.label}
                      <span
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(item);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(item);
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Remove ${option?.label}`}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </Badge>
                  );
                })
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="flex flex-col">
            <div className="p-2">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No items found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
