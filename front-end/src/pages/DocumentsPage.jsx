import React from 'react';
import { useParams } from 'react-router-dom';
import DocumentManagement from '../components/document/DocumentManagement';
import Layout from '../components/layout/AdminLayout';

const DocumentsPage = () => {
  // Get event ID from the URL parameters
  const { id } = useParams();

  return (
    <Layout activeItem="documents">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Event Documents</h1>
        <DocumentManagement eventId={id} />
      </div>
    </Layout>
  );
};

export default DocumentsPage;
