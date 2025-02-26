import { Spinner } from "./Spinner";

const LoadingBar = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <Spinner size="lg" variant="secondary" />
    </div>
  );
};

export default LoadingBar;
