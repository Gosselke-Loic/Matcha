import { z } from 'zod'; 
import { createFileRoute } from '@tanstack/react-router';

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/login"!</div>
};
