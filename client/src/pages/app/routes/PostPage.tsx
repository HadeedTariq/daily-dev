import { Link, useParams } from "react-router-dom";
import { useGetPostComments } from "../hooks/usePostsHandler";
import { format } from "date-fns";
import MarkdownEditor from "@uiw/react-markdown-editor";

import UpvoteButton from "../components/posts/UpvoteButton";

import { useFullApp } from "@/store/hooks/useFullApp";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  emptyCurrenPostComments,
  setCurrentPost,
  setStopFetchingPostComments,
} from "@/reducers/fullAppReducer";
import { CommentSection } from "../components/posts/CommentSection";

const PostPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);

  const {
    posts,
    currentPostComments: comments,
    stopFetchingPostComments,
  } = useFullApp();

  const post = posts?.find((p) => p.slug === params.post_slug);

  const { isLoading: isCommentsLoading } = useGetPostComments(
    post?.id,
    8,
    pageNumber
  );

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (post !== undefined) {
      dispatch(setCurrentPost(post));
    }
    return () => {
      dispatch(setStopFetchingPostComments(false));
      dispatch(emptyCurrenPostComments());
    };
  }, []);

  useEffect(() => {
    if (stopFetchingPostComments) {
      window.removeEventListener("s0croll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [stopFetchingPostComments]);

  return (
    <>
      {post ? (
        <article className="max-w-2xl mx-auto px-4 py-8">
          <header className="mb-8">
            <Link
              to={`/squads/${post.squad_details.squad_handle}`}
              className="flex items-center mb-4"
            >
              <img
                src={post.squad_details.squad_thumbnail}
                alt={post.squad_details.squad_handle}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <span className="text-sm text-gray-600">
                @{post.squad_details.squad_handle}
              </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center mb-4">
              <img
                src={post.author_details.author_avatar}
                alt={post.author_details.author_name}
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
              <div>
                <p className="font-semibold">
                  {post.author_details.author_name}
                </p>
                <p className="text-sm text-gray-600">
                  @{post.author_details.author_username}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>{format(post.created_at, "dd MMM yyyy")}</span>
              <span className="mx-2">•</span>
              <span>{post.views} views</span>
            </div>
          </header>

          <img
            src={post.thumbnail}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto mb-8 rounded-lg"
          />

          <MarkdownEditor.Markdown
            source={post.content}
            style={{ backgroundColor: "#09090B" }}
          />

          <footer>
            <div className="flex items-center mb-4">
              <UpvoteButton
                postId={post.id}
                initialUpvotes={post.upvotes}
                initialUserUpvoted={post.current_user_upvoted}
              />
              <span className="ml-4 text-sm text-gray-600">
                {post.views} views
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
          <CommentSection
            postId={Number(post.id)}
            comments={comments || []}
            isCommentsLoading={isCommentsLoading}
          />
        </article>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export default PostPage;
