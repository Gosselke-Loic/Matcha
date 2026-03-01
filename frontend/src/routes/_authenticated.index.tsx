import { createFileRoute } from "@tanstack/react-router";
//import { browseFilterSchema } from "@/features/dashboard/schemas/filter-schema";

export const Route = createFileRoute('/_authenticated/')({
  //validateSearch: (search) => browseFilterSchema.parse(search),
  component: DashboardComponent
});

function DashboardComponent() {
  //const filters = Route.useSearch();

  return (
    <></>
  );
};
