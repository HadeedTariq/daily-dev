export function PostCard({ post }: { post: SquadPost }) {
  return (
    <div className="bg-zinc-900 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            src={post.post_thumbnail}
            alt={post.post_title}
            width={200}
            height={200}
            className="h-48 w-full object-cover md:w-48"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{post.post_title}</h3>
          <p className="text-gray-600 mb-4">{post.post_content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <img
                src={post.author_avatar}
                alt="Author"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{new Date(post.post_created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {post.post_upvotes}
              </span>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {post.post_views}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.post_tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
