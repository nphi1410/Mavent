import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createSponsorshipPackage } from "../../services/SponsorshipService";

const SubmitPackageModal = ({
  isOpen,
  onClose,
  onCreated,
  existingPackage,
  eventId,
}) => {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const [successText, setSuccessText] = useState(
    "Package created successfully!"
  );
  const [failedText, setFailedText] = useState("Package creation failed!");

  useEffect(() => {
    if (isOpen) {
      if (existingPackage) {
        reset({
          ...existingPackage,
          isActive: existingPackage.isActive ?? true,
        });
        setSuccessText("Package updated successfully!");
        setFailedText("Failed to update package!");
      } else {
        reset({
          eventId,
          isActive: true,
        });
        setSuccessText("Package created successfully!");
        setFailedText("Package creation failed!");
      }
    }
  }, [isOpen, existingPackage, eventId, reset]);

  const onSubmit = async (data) => {
    try {
      await createSponsorshipPackage(data);
      onCreated();
      onClose();
      reset();
      alert(successText);
    } catch (err) {
      alert(failedText);
      console.error("Submit failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {existingPackage ? "Update Package" : "Create Package"}
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Package Name"
              {...register("name", { required: true })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">Required</p>}

            <textarea
              placeholder="Description"
              {...register("description")}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="number"
              placeholder="Amount"
              {...register("amount", { required: true })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.amount && <p className="text-red-500 text-sm">Required</p>}

            <input
              type="text"
              placeholder="Benefits (comma separated)"
              {...register("benefits")}
              className="w-full border px-3 py-2 rounded"
            />

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4"
              />
              Is Active
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {existingPackage ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SubmitPackageModal;
