import { useFormContext } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
};

export default function CustomFormInput (
  { name, label, type = "text", ...props }: FormInputProps
) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        { label }
      </label>

      <input
        {...register(name)}
        {...props}
        id={name}
        type={type}
        className={`px-3 py-2 border rounded-md outline-none transition-colors
          ${error?.message ? "border-red-500 focus:border-red-600" : "bg-slate-300 focus:border-pink-500"}
        `}
      />
    
      {error?.message && (
        <span className="text-xs text-red-500 font-medium">
          { error.message.toString() }
        </span>
      )}
    </div>
  );  
};
