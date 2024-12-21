import { useFullApp } from "@/store/hooks/useFullApp";
import MarkdownEditor from "@uiw/react-markdown-editor";

const ReadmeRendrer = () => {
  const { profile } = useFullApp();

  return (
    <div>
      <MarkdownEditor.Markdown source={profile?.about.readme} />
    </div>
  );
};

export default ReadmeRendrer;
