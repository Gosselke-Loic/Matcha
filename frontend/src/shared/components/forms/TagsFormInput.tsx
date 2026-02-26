import { useFormContext, Controller } from "react-hook-form";

import type { Tags } from "@/shared/schemas/tag-schema"; 

interface TagsFormManagerProps {
  tags: Tags;
};

export const TagsFormManager = ({ tags }: TagsFormManagerProps) => {
  const { control, setValue } = useFormContext();

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="interests"
        render={({ field: { value: selectedIds }, fieldState: { error } }) => {
          const toggleTag = (id: string) => {
            const newValues = selectedIds.includes(id)
              ? selectedIds.filter((i: string) => i !== id)
              : [...selectedIds, id];

            setValue("interests", newValues, { shouldValidate: true });
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
                      onClick={() => toggleTag(tag.id)}
                      className={`px-4 py-2 rounded-full border transition-all
                        ${ isActive ? "bg-pink-500 text-white" : "bg-gray-100" }
                      `}
                    >
                      { tag.label }
                    </button>
                  );
                })}
              </div>

              {error && (
                <span className="text-xs text-red-500">
                  { error.message?.toString() }
                </span>
              )}
            </> 
          );
        }}
      />
    </div>
  );
}
