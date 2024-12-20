import { useState } from "react";

import { Book, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Bookmarks", path: "/bookmarks" },
  { name: "Profile", path: "/profile" },
];

export function ProfileHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { pathname } = useLocation();

  const handleAddReadme = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("README added");
    setIsDialogOpen(false);
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <nav>
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add README
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add README</DialogTitle>
              <DialogDescription>
                Create a README for your project. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddReadme} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  placeholder="Project name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  placeholder="Project description"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  <Book className="mr-2 h-4 w-4" />
                  Save README
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
