import { useFormContext } from "react-hook-form";

const AgreementInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      {/* URL input */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Document URL (optional)
        </label>
        <input
          type="url"
          {...register("agreementDocumentUrl")}
          placeholder="https://example.com/document.pdf"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="text-center text-sm text-gray-500">or</div>

      {/* File input */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Upload File (PDF, DOC, DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          {...register("agreementDocumentFile")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {errors.agreementDocument && (
        <p className="text-sm text-red-600">
          {errors.agreementDocument.message}
        </p>
      )}
    </div>
  );
};

export default AgreementInput;
