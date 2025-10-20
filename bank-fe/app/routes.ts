import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("account/:id", "routes/account.$id.tsx"),
] satisfies RouteConfig;
