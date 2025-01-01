export function SquadHeader({ squad }: { squad: SquadDetails }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={squad.thumbnail || "/placeholder.svg"}
            alt={squad.squad_name}
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              {squad.squad_name}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              @{squad.squad_handle}
            </p>
            <p className="mt-2 max-w-2xl">{squad.description}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
          <span className="bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded-full">
            {squad.category}
          </span>
          <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            {squad.is_public ? "Public" : "Private"}
          </span>
          <span className="bg-yellow-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Posts: {squad.post_creation_allowed_to}
          </span>
          <span className="bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            Invites: {squad.invitation_permission}
          </span>
        </div>
      </div>
    </div>
  );
}
