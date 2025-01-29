type ReadingStreakProps = {
  profile: UserProfile | null;
};

const ReadingStreak = ({ profile }: ReadingStreakProps) => {
  function getDaysDifference() {
    const createdDate: any = new Date(profile?.created_at as string);

    const today: any = new Date();

    const timeDifference: any = today - createdDate;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return Math.floor(daysDifference);
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-800">Reading Streak</h1>
      <div className="mt-4">
        <p className="text-lg text-gray-600">Current Streak</p>
        <span className="text-4xl font-extrabold text-blue-600">
          {profile?.streaks.streak_length}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-lg text-gray-600">Longest Streak</p>
        <span className="text-4xl font-extrabold text-green-600">
          {profile?.streaks.longest_streak}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-lg text-gray-600">Total Reading Days</p>
        <span className="text-4xl font-extrabold text-purple-600">
          {getDaysDifference()} days
        </span>
      </div>
    </div>
  );
};

export default ReadingStreak;
