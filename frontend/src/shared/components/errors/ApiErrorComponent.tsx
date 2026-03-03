import type ApiError from "@/api/ApiError";

interface ApiErrorComponentProps {
  error: ApiError;
};

export default function ApiErrorComponent(
  { error }: ApiErrorComponentProps
) {
  return (
    <div className="p-4 border-1-4 border-red-500 bg-red-50">
      <h3 className="font-bold text-red-800">Server error</h3>
      <p className="text-sm text-red-700">{error.message}</p>
      {/* Can add more details here */}
    </div>
  );  
};
