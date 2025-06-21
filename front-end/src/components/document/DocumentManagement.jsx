import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFileAlt, faFilePdf, faFileCsv, faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';

const DocumentManagement = ({ eventId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('dateNewest');
  
  useEffect(() => {
    if (eventId) {
      console.log(`Loading document management for event ID: ${eventId}`);
      // In a real implementation, you would fetch departments and documents related to this event
      // Example:
      // const fetchDepartments = async () => {
      //   try {
      //     const response = await getDepartmentsByEventId(eventId);
      //     if (response && response.length > 0) {
      //       setDepartments([{ id: 'all', name: 'All Departments' }, ...response]);
      //     }
      //   } catch (error) {
      //     console.error('Error fetching departments:', error);
      //   }
      // };
      // fetchDepartments();
    }
  }, [eventId]);
  
  // Sample departments data - replace with actual data fetching in production
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'marketing', name: 'Marketing Department' },
    { id: 'finance', name: 'Finance Department' },
    { id: 'hr', name: 'Human Resources Department' },
    { id: 'culture', name: 'Culture Department' },
    { id: 'operations', name: 'Operations Department' },
    { id: 'it', name: 'IT Department' }
  ];

  // Sample file types - replace with actual data in production
  const fileTypes = [
    { id: 'all', name: 'All File Types' },
    { id: 'doc', name: 'DOC' },
    { id: 'pdf', name: 'PDF' },
    { id: 'csv', name: 'CSV' }
  ];

  // Sample date ranges
  const dateRanges = [
    { id: 'all', name: 'All Dates' },
    { id: 'today', name: 'Today' },
    { id: 'thisWeek', name: 'This Week' },
    { id: 'thisMonth', name: 'This Month' },
    { id: 'lastMonth', name: 'Last Month' }
  ];

  // Sample sort options
  const sortOptions = [
    { id: 'dateNewest', name: 'Date (Newest)' },
    { id: 'dateOldest', name: 'Date (Oldest)' },
    { id: 'nameAZ', name: 'Name (A-Z)' },
    { id: 'nameZA', name: 'Name (Z-A)' }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Department Documents</h2>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>
      
      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="filter-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="block text-sm font-medium text-transparent mb-1">.</label>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fileTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="block text-sm font-medium text-transparent mb-1">.</label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Document Upload Area */}
      <DocumentUpload eventId={eventId} departmentId={selectedDepartment !== 'all' ? selectedDepartment : null} />
      
      {/* Document List */}
      <DocumentList 
        searchTerm={searchTerm}
        departmentFilter={selectedDepartment}
        fileTypeFilter={selectedFileType}
        dateFilter={selectedDateRange}
        sortBy={sortBy}
        eventId={eventId}
      />
    </div>
  );
};

export default DocumentManagement;
