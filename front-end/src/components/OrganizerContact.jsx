import React from "react";

const OrganizerContact = () => {
  return (
    <section className="w-full max-w-2xl px-4 md:px-6 py-8 text-gray-900">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="text-3xl font-semibold tracking-tight">📞 Organizer Contact</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="w-20 font-medium text-gray-700">Email:</span>
          <span className="text-gray-900">jyVb5@example.com</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="w-20 font-medium text-gray-700">Phone:</span>
          <span className="text-gray-900">0123456789</span>
        </div>
      </div>
    </section>
  );
};

export default OrganizerContact;
