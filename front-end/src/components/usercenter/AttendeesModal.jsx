import React from 'react';

const AttendeesModal = ({ isOpen, onClose, attendees, loading, taskData }) => {
  if (!isOpen) return null;
  
  // Sắp xếp attendees - Leader lên đầu
  const sortedAttendees = React.useMemo(() => {
    if (!attendees || !taskData) return attendees || [];
    
    // Tạo bản sao của mảng để không thay đổi mảng gốc
    return [...attendees].sort((a, b) => {
      // Leader luôn đứng đầu
      if (a.accountId === taskData.assignedToAccountId) return -1;
      if (b.accountId === taskData.assignedToAccountId) return 1;
      // Các attendee khác giữ nguyên thứ tự
      return 0;
    });
  }, [attendees, taskData]);
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Danh sách người tham gia</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : sortedAttendees.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Không có người tham gia nào.</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAttendees.map((attendee, index) => {
                    const isLeader = taskData && attendee.accountId === taskData.assignedToAccountId;
                    
                    return (
                      <tr 
                        key={attendee.accountId || index} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isLeader ? 'bg-blue-50' : ''}`}
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className={`py-3 px-4 ${isLeader ? 'font-semibold' : 'font-medium'}`}>
                          {attendee.accountName}
                        </td>
                        <td className="py-3 px-4">{attendee.email}</td>
                        <td className="py-3 px-4">
                          {isLeader ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Leader
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Attendee
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${attendee.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                              attendee.status === 'DECLINED' ? 'bg-red-100 text-red-800' : 
                              attendee.status === 'ATTENDED' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {attendee.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#00155c] hover:bg-[#172c70] text-white px-4 py-2 rounded-lg font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;