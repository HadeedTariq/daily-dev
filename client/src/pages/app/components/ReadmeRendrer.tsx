import MarkdownEditor from "@uiw/react-markdown-editor";

type ReadmeRendrerProps = {
  readme: string | undefined;
};

const ReadmeRendrer = ({ readme }: ReadmeRendrerProps) => {
  return (
    <div>
      <MarkdownEditor.Markdown source={readme} />
    </div>
  );
};

export default ReadmeRendrer;
