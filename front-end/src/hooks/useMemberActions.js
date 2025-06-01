import { useState, useCallback } from 'react';
import memberService from '../services/memberService';

/**
 * Hook để quản lý các hành động với member như update, ban/unban, delete.
 * Hook này tập trung vào việc xử lý các API call để thực hiện các hành động trên members.
 */
const useMemberActions = (eventId = 1) => {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update member with new information
  const updateMember = useCallback(async (editedUser, departments = []) => {
    try {
      setLoading(true);
      
      // Clear debug information
      // console.log('=== SAVING USER CHANGES ===');
      // console.log('Edited user full data:', editedUser);
      
      // Priority 1: Use departmentId directly if it's stored in editedUser during editing
      let departmentId = null;
      
      // Check if we already have departmentId from the handleEditInputChange
      if (editedUser.departmentId) {
        // console.log(`DIRECT: Using departmentId from editedUser: ${editedUser.departmentId}`);
        departmentId = editedUser.departmentId;
      } 
      // If no departmentId stored, try to match department name
      else if (editedUser.department && departments.length > 0) {
        // console.log(`SEARCH: Looking for department match for: "${editedUser.department}"`);
        
        const deptName = editedUser.department.toLowerCase().trim();
        
        // Try exact match first
        const exactMatch = departments.find(dept => 
          dept.name.toLowerCase().trim() === deptName
        );
        
        if (exactMatch) {
          // console.log(`Found exact match: ${exactMatch.name} (ID: ${exactMatch.departmentId})`);
          departmentId = exactMatch.departmentId;
        } 
        // Try contains match if exact match failed
        else {
          const partialMatch = departments.find(dept => 
            dept.name.toLowerCase().includes(deptName) || 
            deptName.includes(dept.name.toLowerCase())
          );
          
          if (partialMatch) {
            // console.log(`Found partial match: ${partialMatch.name} (ID: ${partialMatch.departmentId})`);
            departmentId = partialMatch.departmentId;
          } else {
            // console.log('No department match found');
          }
        }
      }
      
      // Transform the edited user data to match UpdateMemberRequestDTO      
      const updateData = {
        eventId: eventId,
        accountId: editedUser.accountId || editedUser.id,
        eventRole: editedUser.role || editedUser.eventRole,
        departmentId: departmentId,
        // Map status from UI to backend format (isActive boolean)
        // Use isActive directly if available, otherwise derive from status
        isActive: editedUser.isActive !== undefined ? editedUser.isActive : (editedUser.status === 'Active'),
        reason: "Updated by admin"
      };
      
      // console.log('Status being sent:', editedUser.status);
      // console.log('isActive being sent:', updateData.isActive);
      
      // console.log('Update data being sent:', updateData);
      
      const response = await memberService.updateMember(updateData);
      
      if (!response.success) {
        setError('Không thể cập nhật thông tin thành viên');
        console.error('Update failed:', response);
        return { success: false, data: null };
      }
      
      console.log('Update response data:', response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating member:', err);
      setError('Không thể cập nhật thông tin thành viên');
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Ban a member (set isBanned to true)
  const banMember = useCallback(async (member) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!member || (!member.accountId && !member.id)) {
        console.error('Invalid member object provided to banMember:', member);
        setError('Invalid member data');
        return false;
      }
      
      const banData = {
        eventId: eventId,
        accountId: member.accountId || member.id,
        isBanned: true,
        reason: 'Banned by admin'
      };
      
      console.log('Calling banMember with data:', banData);
      const response = await memberService.banMember(banData);
      
      if (!response || !response.success) {
        console.error('Ban operation failed:', response);
        setError('Không thể thực hiện hành động này');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error banning member:', err);
      setError(err.response?.data?.message || 'Không thể thực hiện hành động này');
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Unban a member (set isBanned to false)
  const unbanMember = useCallback(async (member) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!member || (!member.accountId && !member.id)) {
        console.error('Invalid member object provided to unbanMember:', member);
        setError('Invalid member data');
        return false;
      }
      
      const banData = {
        eventId: eventId,
        accountId: member.accountId || member.id,
        isBanned: false,
        reason: 'Unbanned by admin'
      };
      
      // console.log('Calling unbanMember with data:', banData);
      const response = await memberService.banMember(banData);
      
      if (!response || !response.success) {
        console.error('Unban operation failed:', response);
        setError('Không thể thực hiện hành động này');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error unbanning member:', err);
      setError(err.response?.data?.message || 'Không thể thực hiện hành động này');
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);
  
  // Delete a member
  const deleteMember = useCallback(async (member) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      return false;
    }
    
    try {
      setLoading(true);
      
      await memberService.removeMember(eventId, member.accountId || member.id);
      return true;
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Không thể xóa thành viên');
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // View user details (chỉ trả về accountId để parent hook có thể gọi fetchMemberDetails)
  const viewUserDetails = useCallback((user) => {
    return user.accountId || user.id;
  }, []);

  return {
    loading,
    error,
    updateMember,
    banMember,
    unbanMember,
    deleteMember,
    viewUserDetails,
    clearError: () => setError(null)
  };
};

// Export the hook as both named and default export
export { useMemberActions };
export default useMemberActions;
