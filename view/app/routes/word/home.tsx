import { memo } from "react";
import { Outlet } from "react-router";

const Home = memo(() => {
  return (
    <>
      <Outlet />
    </>
  );
});
Home.displayName = "Route[/word]"

export default Home;
