import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    { url: x, icon: <Twitter className="h-4 w-4" />, label: "X (Twitter)" },
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
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {socialLinks?.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              asChild
              className="w-full justify-start gap-2"
            >
              <Link to={link.url} target="_blank" rel="noopener noreferrer">
                {link.icon}
                <span className="truncate">{link.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
