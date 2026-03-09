import { z } from "zod";
import { useFormContext } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  enumSchema: z.ZodEnum<any>;
};

export default function SelectFormInput ({
  name, label, enumSchema, ...props
}: FormInputProps) {
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

      <select {...register(name)} {...props} className="border rounded p-2">
        {enumSchema.options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    
      {error?.message && (
        <span className="text-xs text-red-500 font-medium">
          { error.message.toString() }
        </span>
      )}
    </div>
  );  
};
