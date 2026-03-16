import type { ChangeEvent } from "react"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import {
  imagesFormSchema,
  type ImagesFormData,
  type ImagesProfileData
} from "../schemas/images-schema";
import ImagePreview from "./ImagePreview";
import { useProfile } from "../hooks/use-profile";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton";

interface ProfileImagesFormProps {
  dataImages: ImagesProfileData;
};

export function ProfileImageForm ({ dataImages }: ProfileImagesFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(imagesFormSchema),
    defaultValues: { images: dataImages.images || [] },
    mode: "onTouched"
  });
  const { deleteImage, setMainImage, uploadImages } = useProfile();
  const { fields, append, remove } = useFieldArray({ control, name: "images", keyName: "rhf_id" });

  const error = errors["root"];

  const handleMainImage = (id: number) => {
    setMainImage.mutate(id);
  };

  const handleDelete = (index: number, id: number) => {
    if (id) {
      deleteImage.mutate(id);
    };
    remove(index);
  };

  const onUpload = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(ev.target.files || []);
    files.forEach((file) => append(file));
    ev.target.value = "";
  };

  const onSubmit = (data: ImagesFormData) => {
    const fd = new FormData();
    data.images.forEach((img) => {
      if (img instanceof File) fd.append('files', img);
    });

    uploadImages.mutate(fd); // onSuccess local needed?
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800">Images</h1>

      <div className="grid grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <ImagePreview
            key={field.rhf_id}
            image={field}
            setAsProfile={(id: number) => handleMainImage(id)}
            onDelete={() => {
              if (!(field instanceof File)) {
                handleDelete(index, field.id);
              } else {
                remove(index);
              };
            }}
            error={errors.images?.[index]?.message}
          />
        ))}
      </div>

      <input type="file" multiple onChange={onUpload} />
      
      {error?.message && (
        <span className="text-xs text-red-500 font-medium">
          { error.message.toString() }
        </span>
      )}

      <div className="flex items-center justify-center">
        <CustomSubmitButton type="submit" isPending={uploadImages.isPending}>
          Upload
        </CustomSubmitButton>
      </div>
    </form>
  ); 
};
