import { useFormContext } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  maxLengthNumber: number;
};

export default function CustomTextareaInput (
  { name, label, maxLengthNumber, ...props }: FormInputProps
) {
  const {
    watch,
    register,
    formState: { errors }
  } = useFormContext();

  const error = errors[name];
  const textareaContent = watch(name) || "";

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        { label }
      </label>

      <textarea
        {...register(name)}
        {...props}
        rows={4}
        id={name}
        className={`w-full p-3 border-2 rounded-xl outline-none transition-colors
          ${error?.message ? "border-red-500 focus:border-red-600" : "bg-slate-300 focus:border-pink-500"}
        `}
      />

      <div className="flex justify-between items-center mt-1 px-1">
        {error?.message && (
          <span className="text-xs text-red-500 font-medium">
            { error.message.toString() }
          </span>
        )}
        <span className={`
          text-xs font-mono px-2 py-1 rounded-full transition-all
          ${textareaContent.length > maxLengthNumber
            ? "bg-red-500 text-white animate-shake font-bold"
            : "bg-gray-100 text-gray-500"
          }
        `}>
          {textareaContent.length}/{maxLengthNumber}
        </span>
      </div>
    </div>
  );  
};
