import { useFullApp } from "@/store/hooks/useFullApp";
import ReadmeRendrer from "../../components/ReadmeRendrer";
import ReadingStreak from "../../components/ReadingStreak";

export function UserProfileReadmeHandler() {
  const { currentUserProfile: profile } = useFullApp();

  return (
    <div className="w-full">
      <ReadmeRendrer readme={profile?.about.readme} />
      <ReadingStreak profile={profile} />
    </div>
  );
}
