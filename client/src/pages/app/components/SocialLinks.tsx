import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Globe,
  Twitter,
  Youtube,
  SquareStack,
  RssIcon as Reddit,
  FileCode2,
  Codepen,
  DogIcon as Mastodon,
  AtSign,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Social {
  url: any;
  icon: any;
  label: any;
}

interface SocialLinksProps {
  github?: string;
  linkedin?: string;
  website?: string;
  x?: string;
  youtube?: string;
  stack_overflow?: string;
  reddit?: string;
  roadmap_sh?: string;
  codepen?: string;
  mastodon?: string;
  threads?: string;
}

export function SocialLinks({
  github,
  linkedin,
  website,
  x,
  youtube,
  stack_overflow,
  reddit,
  roadmap_sh,
  codepen,
  mastodon,
  threads,
}: SocialLinksProps) {
  const socialLinks: Social[] = [
    { url: github, icon: <Github className="h-4 w-4" />, label: "GitHub" },
    {
      url: linkedin,
      icon: <Linkedin className="h-4 w-4" />,
      label: "LinkedIn",
    },
    { url: website, icon: <Globe className="h-4 w-4" />, label: "Website" },
    { url: x, icon: <Twitter className="h-4 w-4" />, label: "X" },
    { url: youtube, icon: <Youtube className="h-4 w-4" />, label: "YouTube" },
    {
      url: stack_overflow,
      icon: <SquareStack className="h-4 w-4" />,
      label: "Stack Overflow",
    },
    { url: reddit, icon: <Reddit className="h-4 w-4" />, label: "Reddit" },
    {
      url: roadmap_sh,
      icon: <FileCode2 className="h-4 w-4" />,
      label: "Roadmap.sh",
    },
    { url: codepen, icon: <Codepen className="h-4 w-4" />, label: "CodePen" },
    {
      url: mastodon,
      icon: <Mastodon className="h-4 w-4" />,
      label: "Mastodon",
    },
    { url: threads, icon: <AtSign className="h-4 w-4" />, label: "Threads" },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {socialLinks.map((link, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          asChild
          className="h-9 px-3 rounded-xl border border-border/60 bg-card/40 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all duration-200 group flex items-center gap-2 select-none"
        >
          <Link to={link.url} target="_blank" rel="noopener noreferrer">
            <span className="transition-transform duration-200 group-hover:scale-110 text-muted-foreground/80 group-hover:text-indigo-500">
              {link.icon}
            </span>
            <span className="text-xs font-medium tracking-tight truncate max-w-[120px]">
              {link.label}
            </span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
