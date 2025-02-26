type ReadingStreakProps = {
  profile: UserProfile | null;
};
import { Flame, Calendar, Trophy, BookOpen } from "lucide-react";
const ReadingStreak = ({ profile }: ReadingStreakProps) => {
  function getDaysDifference() {
    const createdDate: any = new Date(profile?.created_at as string);

    const today: any = new Date();

    const timeDifference: any = today - createdDate;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return Math.floor(daysDifference);
  }

  return (
    <div className="w-full max-w-md my-8 mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
            <BookOpen className="w-6 h-6" />
            Reading Journey
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="col-span-2">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 transform transition-all hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Current Streak</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-orange-600">
                      {profile?.streaks.streak_length}
                    </span>
                    <span className="text-orange-600 font-medium">days</span>
                  </div>
                </div>
                <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 h-full transform transition-all group-hover:scale-[1.02] cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Trophy className="w-6 h-6 text-emerald-500" />
                <p className="text-gray-600 font-medium text-center">
                  Longest Streak
                </p>
                <span className="text-3xl font-bold text-emerald-600">
                  {profile?.streaks.longest_streak}
                </span>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 h-full transform transition-all group-hover:scale-[1.02] cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                <p className="text-gray-600 font-medium text-center">
                  Total Days
                </p>
                <span className="text-3xl font-bold text-blue-600">
                  {getDaysDifference()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            {profile?.streaks && (
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                style={{
                  width: `${
                    (profile?.streaks.streak_length /
                      profile?.streaks.longest_streak) *
                    100
                  }%`,
                }}
              />
            )}
          </div>
          {profile?.streaks && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {Math.round(
                (profile?.streaks.streak_length /
                  profile?.streaks.longest_streak) *
                  100
              )}
              % to your best streak!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingStreak;
