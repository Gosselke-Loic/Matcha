import { useEffect, type ChangeEvent } from "react"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import {
  imagesFormArraySchema,
  type ImagesProfileData,
  type ImageFormArrayData
} from "../schemas/images-schema";
import ImagePreview from "./ImagePreview";
import { useProfile } from "../hooks/use-profile";
import CustomSubmitButton from "@/shared/components/forms/SubmitButton";

interface ProfileImagesFormProps {
  userId: number;
  dataImages: ImagesProfileData;
};

export function ProfileImageForm ({ dataImages, userId }: ProfileImagesFormProps) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(imagesFormArraySchema),
    defaultValues: { images: [] },
    mode: "onTouched"
  });

  useEffect(() => {
    if (dataImages.images) {
      reset({
        images: dataImages.images.map((image) => ({
          id: image.id,
          filename: image.filename,
          isPrimary: image.isPrimary,
          isLocal: false
        }))
      });
    };
  }, [dataImages, reset]);

  const error = errors["root"];
  const { fields, append, remove, update }
    = useFieldArray({ control, name: "images", keyName: "rhf_id"});
  const { deleteImage, setMainImage, uploadImages } = useProfile();

  const handleMainImage = (id: number, isLocal: boolean, index: number) => {
    if (isLocal) {
      // toast
      return ;
    };

    setMainImage.mutate(id, {
      onSuccess: () => {
        fields.forEach((field, i) => {
          if (field.isPrimary) { update(i, { ...field, isPrimary: false }); };
        });

        update(index, { ...fields[index], isPrimary: true });
      }
    });
  };

  const handleDelete = (id: number, index: number) => {
    deleteImage.mutate(id, {
      onSuccess: () => { remove(index) }
    });
  };

  const onUpload = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(ev.target.files || []);
    files.forEach((file) => append({
      id: -1,
      file: file,
      filename: "",
      isLocal: true,
      isPrimary: false
    }));
    ev.target.value = "";
  };

  const onSubmit = (data: ImageFormArrayData) => {
    const fd = new FormData();
    data.images.forEach((img) => {
      if (img.isLocal) { fd.append('files', img.file); };
    });

    uploadImages.mutate({ userId, ...fd });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800">Images</h1>

      <div className="grid grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <ImagePreview
            key={field.rhf_id}
            image={field}
            setAsProfile={() =>
              handleMainImage(field.id, field.isLocal, index)
            }
            onDelete={() => {
              if (!(field instanceof File)) {
                handleDelete(field.id, index);
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
