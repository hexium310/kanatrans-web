import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { memo } from "react";
import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/root";

import '@mantine/core/styles.css';

export const Layout = memo(({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" { ...mantineHtmlProps }>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>{ children }</MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
});
Layout.displayName = "HtmlLayout";

const App = memo(() => {
  return <Outlet />;
});
App.displayName = "App";

export const ErrorBoundary = memo(({ error }: Route.ErrorBoundaryProps) => {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{ message }</h1>
      <p>{ details }</p>
      { stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{ stack }</code>
        </pre>
      ) }
    </main>
  );
});
ErrorBoundary.displayName = "ErrorBoundary";

export default App;
