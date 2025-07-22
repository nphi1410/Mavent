"use client"

import { FileText } from "lucide-react"

export default function EventProposal({ proposal }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Proposal Details
      </h2>

      <div className="space-y-4">
        {/* Proposal Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{proposal?.title}</h3>
          <div className="flex items-center gap-4 mb-3">
            <a
              href={proposal?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View Proposal Document
            </a>
          </div>
          {proposal?.note && <p className="text-gray-600 text-sm">{proposal?.note}</p>}
        </div>
      </div>
    </div>
  )
}
