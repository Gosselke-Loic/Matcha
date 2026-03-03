import type { ZodError } from "zod";

interface ZodErrorComponentProps {
  error: ZodError;
};

export default function ZodErrorComponent(
  { error }: ZodErrorComponentProps
) {
  return (
    <div className="p-4 border-1-4 border-orange-500 bg-orange-50">
      <h3 className="font-bold text-orange-800">Data error</h3>
      <ul className="mt-2">
        {error.issues.map((issue, index) => (
          <li key={index} className="text-sm text-orange-700">
            <strong>{issue.path.join('.')}:</strong> {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );  
};
