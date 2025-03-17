import type { RouteConfig } from "@react-router/dev/routes";
import { layout, route } from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [
    route("/", "routes/home.tsx", [
      route("word", "routes/word/home.tsx", [
        route(":word", "routes/word/detail.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
