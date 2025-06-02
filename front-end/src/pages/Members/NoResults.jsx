import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const NoResults = () => {
  return (
    <div className="text-center py-10">
      <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-5xl mb-3" />
      <p className="text-gray-500 text-lg">No members match your search criteria</p>
    </div>
  );
};

export default NoResults;
