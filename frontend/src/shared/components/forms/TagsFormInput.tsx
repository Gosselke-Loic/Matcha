import { useFormContext, Controller } from "react-hook-form";

import type { Tags } from "@/shared/schemas/tag-schema"; 

interface TagsFormManagerProps {
  tags: Tags;
};

export const TagsFormManager = ({ tags }: TagsFormManagerProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="interests" className="text-sm font-medium text-slate-700">
        Interests
      </label>

      <Controller
        name="interests"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const selectedIds: number[] = Array.isArray(value) ? value : [];
          const toggleTag = (id: number) => {  
            const newValues = selectedIds.includes(id)
              ? selectedIds.filter((i: number) => i !== id)
              : [...selectedIds, id];

            onChange(newValues);
          };

          return (
            <>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isActive = selectedIds.includes(tag.id);

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-4 py-2 rounded-full border transition-all text-sm font-medium
                        ${ isActive
                          ? "bg-pink-500 text-white border-pink-600 shadow-sm"
                          : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                        }
                      `}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
      
              {error?.message && (
                <span className="text-xs text-red-500 font-medium">
                  { error.message.toString() }
                </span>
              )}
            </> 
          );
        }}
      />
    </div>
  );
}
