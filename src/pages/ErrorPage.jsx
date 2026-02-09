import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <h1>Something went wrong</h1>
      <p>{error?.message || "Unknown error"}</p>
    </>
  );
}
