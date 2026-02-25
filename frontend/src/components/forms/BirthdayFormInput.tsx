import { useFormContext } from "react-hook-form"; 

export default function BirthdayFormInput(
  { props }:{ props?: React.InputHTMLAttributes<HTMLInputElement>}
) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const error = errors["birthday"];

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor="birthday" className="text-sm font-medium text-slate-700">
        Birthday
      </label>

      <input
        {...register("birthday")}
        {...props}
        id="birthday"
        type="date"
        className={`px-3 py-2 border rounded-md outline-none transition-colors
          ${error ? "border-red-500 focus:border-red-600" : "bg-slate-300 focus:border-pink-500"}
        `}
      />
    
      {error && (
        <span className="text-xs text-red-500">
          { error.message?.toString() }
        </span>
      )}
    </div>
  );
};
