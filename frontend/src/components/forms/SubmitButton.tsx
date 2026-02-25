import type { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isPending?: boolean;
}

export function CustomButton({ isPending, children, className, ...props }: SubmitButtonProps) {
  return (
    <button
      {...props}
      disabled={isPending || props.disabled}
      className={`px-4 py-2 bg-pink-600 text-white rounded-md
        disabled:bg-pink-200 disabled:cursor-not-allowed transition-all active:scale-95 ${className}`}
    >
      { isPending && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      { children }
    </button>
  );
};
