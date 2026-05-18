import LoadingBar from "@/components/LoadingBar";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();

  if (isLoading) return <LoadingBar />;

  return <div></div>;
};

export default EditPost;
