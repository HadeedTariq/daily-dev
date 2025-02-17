import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
type SortOption = "upvotes" | "views";

type SortingElementsProps = {
  activeSort: SortOption;
  setActiveSort: (sort: SortOption) => void;
};

export default function SortingElements({
  activeSort,
  setActiveSort,
}: SortingElementsProps) {
  return (
    <div className="flex space-x-4">
      <Button
        variant="ghost"
        className={cn(
          "relative px-2",
          activeSort === "upvotes" && "font-bold text-primary"
        )}
        onClick={() => setActiveSort("upvotes")}
      >
        By Upvotes
        {activeSort === "upvotes" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "relative px-2",
          activeSort === "views" && "font-bold text-primary"
        )}
        onClick={() => setActiveSort("views")}
      >
        Popular
        {activeSort === "views" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </Button>
    </div>
  );
}
