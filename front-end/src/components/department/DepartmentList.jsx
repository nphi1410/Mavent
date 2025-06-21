import React, { useState, useEffect } from 'react';
import { getDepartmentsByEventId } from '../../services/departmentService';
import { getMemberCount } from '../../services/departmentManagementService';

// Component hiển thị danh sách phòng ban theo sự kiện
function DepartmentList({ eventId }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await getDepartmentsByEventId(eventId);
        console.log("Departments data:", data); // Log để kiểm tra dữ liệu
        
        // Store the departments initially
        setDepartments(data);
        setError(null);
        
        // Fetch member counts for each department
        if (Array.isArray(data) && data.length > 0) {
          fetchMemberCounts(data);
        }
      } catch (err) {
        setError('Không thể tải danh sách phòng ban. Vui lòng thử lại sau.');
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchDepartments();
    }
  }, [eventId]);
  
  // Fetch member counts for all departments
  const fetchMemberCounts = async (departmentsList) => {
    try {
      // Process departments in batches to avoid too many concurrent requests
      const updatedDepartments = [...departmentsList];
      const batchSize = 3; // Small batch size to avoid overloading the API
      
      for (let i = 0; i < updatedDepartments.length; i += batchSize) {
        const batch = updatedDepartments.slice(i, i + batchSize);
        
        // Create an array of promises for this batch
        const batchPromises = batch.map(async (dept) => {
          try {
            const memberCount = await getMemberCount(eventId, dept.departmentId || dept.id);
            return { ...dept, memberCount };
          } catch (error) {
            console.error(`Error fetching member count for department ${dept.id || dept.departmentId}:`, error);
            return dept; // Return original department if count can't be fetched
          }
        });
        
        // Wait for all promises in this batch
        const results = await Promise.all(batchPromises);
        
        // Update the departments with the results
        results.forEach((updatedDept, index) => {
          updatedDepartments[i + index] = updatedDept;
        });
        
        // Update state incrementally
        setDepartments([...updatedDepartments]);
      }
    } catch (error) {
      console.error('Error fetching member counts:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải dữ liệu phòng ban...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (departments.length === 0) {
    return <div className="p-4 text-center">Không có phòng ban nào cho sự kiện này.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold mb-4">Danh sách phòng ban</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((department, index) => (
          <div 
            key={department.id || department.departmentId || `department-${index}`} 
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-semibold text-lg">{department.name}</h4>
            <p className="text-gray-600 line-clamp-3 break-words">{department.description || 'Không có mô tả'}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Số thành viên: {' '}
                {department.memberCount !== undefined ? (
                  <span className="font-medium text-blue-600">{department.memberCount}</span>
                ) : (
                  <span className="text-gray-400">Đang tải...</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentList;
