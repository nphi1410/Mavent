import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createSponsor,
  getSponsorById,
  getSponsors,
} from "../services/SponsorService";
import SponsorSelect from "../components/sponsorship/SponsorSelect";
import {
  createSponsorship,
  getSponsorshipPackages,
} from "../services/sponsorshipService";
import PackageSelect from "../components/sponsorship/PackageSelect";
import ContactAccountSelect from "../components/sponsorship/ContactAccountSelect";
import AgreementInput from "../components/sponsorship/AgreementInput";
import CreateSponsorModal from "../components/sponsorship/CreateSponsorModal";
import memberService from "../services/memberService";

const SubmitSponsorshipPage = () => {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = methods;

  const { id } = useParams();
  const [sponsors, setSponsors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [contactAccounts, setContactAccounts] = useState([]);
  const packageId = watch("packageId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const existedSponsorship = location.state?.sponsorship;
  const [successText, setSuccessText] = useState(
    "Sponsorship created successfully!"
  );
  const [failedText, setFailedText] = useState("Sponsorship creation failed!");

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [packagesData, sponsorsData, contactsData] = await Promise.all([
          getSponsorshipPackages(id),
          getSponsors(id),
          memberService.getSponsorManageableMembers(id),
        ]);
        setPackages(packagesData);
        setContactAccounts(contactsData);

        if (existedSponsorship) {
          const existedSponsor = await getSponsorById(
            existedSponsorship.sponsorId
          );

          const finalSponsors = [...sponsorsData, existedSponsor];

          setSponsors(finalSponsors);

          setSuccessText("Sponsorship updated successfully!");
          setFailedText("Failed to update sponsorship!");
          reset(existedSponsorship);
          setTimeout(() => {
            console.log("Form values after reset:", getValues());
          }, 0);
        } else {
          setSponsors(sponsorsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, [id]);

  useEffect(() => {
    if (packageId) {
      const selectedPackage = packages.find((p) => p.packageId === packageId);
      if (selectedPackage) {
        setValue("amount", selectedPackage.amount); // overwrite amount
      }
    } else {
      setValue("amount", 0);
    }
  }, [packageId, packages, setValue]);

  const fetchSponsors = async () => {
    try {
      const data = await getSponsors(id);
      setSponsors(data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    const selected = getValues("sponsorId");
    if (selected === "__create_new__") {
      setValue("sponsorId", null);
    }
  };
  const handleSubmitSponsor = async (newSponsor) => {
    const createNewSponsor = async (sponsorData) => {
      try {
        const data = await createSponsor(sponsorData);
        return data;
      } catch (error) {
        console.error("Error creating sponsor:", error);
        return null;
      }
    };
    const createdSponsor = await createNewSponsor(newSponsor);
    // Add the new sponsor to list
    fetchSponsors();

    // Set form value to newly created sponsor's ID
    setValue("sponsorId", createdSponsor.sponsorId); // assumes sponsorId is available
  };

  const onSubmit = (data) => {
    const hasUrl = data.agreementDocumentUrl?.trim();
    const hasFile = data.agreementDocumentFile?.length > 0;

    if (!hasUrl && !hasFile) {
      methods.setError("agreementDocument", {
        type: "manual",
        message: "You must provide a URL or upload a file",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      createSponsorship(data);
      alert(successText);
    } catch (error) {
      alert(failedText);
      console.error("Error submitting sponsorship:", error);
    } finally {
      setIsSubmitting(false);
    }

    navigate(`/event/${id}/staff/sponsorship`, { replace: true });

    reset();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Create New Sponsorship</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* IDs */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="hidden"
              defaultValue={id}
              {...register("eventId", { required: true })}
            />
            <div>
              <label className="block mb-1 font-medium">
                Sponsor <span className="text-red-500">*</span>
              </label>
              <Controller
                name="sponsorId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <SponsorSelect
                    sponsors={sponsors}
                    value={field.value}
                    onChange={field.onChange}
                    onCreateNew={() => setShowCreateModal(true)}
                  />
                )}
              />
              {errors.sponsorId && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Package</label>
              <Controller
                name="packageId"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <PackageSelect
                    packages={packages}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 font-medium">
                Main Contact Account <span className="text-red-500">*</span>
              </label>
              <Controller
                name="mainContactAccountId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <ContactAccountSelect
                    accounts={contactAccounts}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.mainContactAccountId && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("startDate", { required: true })}
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("endDate", {
                  required: true,
                  validate: (endDate) => {
                    const startDate = watch("startDate");
                    if (!startDate || !endDate) return true;
                    return (
                      new Date(endDate) > new Date(startDate) ||
                      "End date must be after start date"
                    );
                  },
                })}
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.endDate?.type === "required" && (
                <p className="text-red-500 text-sm">End date is required</p>
              )}
              {errors.endDate?.type === "validate" && (
                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Amount + Status */}
          <div>
            <label className="block mb-1 font-medium">
              Amount (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("amount", { required: true, min: 0 })}
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">Must be a positive number</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select status</option>
              <option value="INTERESTED">Interested</option>
              <option value="NEGOTIATING">Negotiating</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PAID">Paid</option>
              <option value="FULFILLED">Fulfilled</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">Status is required</p>
            )}
          </div>

          {/* Optional fields */}
          <div className="space-y-2">
            <label className="block font-medium">
              Agreement Document <span className="text-red-500">*</span>
            </label>
            <AgreementInput />
          </div>

          <div>
            <label className="block mb-1 font-medium">Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create Sponsorship"}
          </button>
        </form>
      </FormProvider>
      {showCreateModal && (
        <CreateSponsorModal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onSubmit={handleSubmitSponsor}
        />
      )}
    </div>
  );
};

export default SubmitSponsorshipPage;
