import { memo } from "react";
import { Outlet } from "react-router";

import { Header } from "~/components/Header";

const Layout = memo(() => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
});
Layout.displayName = "Layout";

export default Layout;
