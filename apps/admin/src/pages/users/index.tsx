import { useState, useMemo, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '@camera-rental-house/ui';
import { Loader2 } from 'lucide-react';
import UserHeader from './UserHeader';
import UserStats from './UserStats';
import UserFilters from './UserFilters';
import UserCard from './UserCard';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        addToast({ title: 'Error', message: 'Failed to fetch users', tone: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [addToast]);
  
  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.is_verified && !u.is_blocked).length;
  const pendingUsers = users.filter((u) => !u.is_verified && !u.is_blocked).length;

  const filteredUsers = useMemo(() => {
    let result = users;

    // Status Filter
    if (statusFilter === 'verified') {
      result = result.filter(u => u.is_verified && !u.is_blocked);
    } else if (statusFilter === 'review') {
      result = result.filter(u => !u.is_verified && !u.is_blocked);
    }

    // Search Filter
    if (!searchTerm) return result;
    const lowerQuery = searchTerm.toLowerCase();
    return result.filter((user) => 
      user.full_name?.toLowerCase().includes(lowerQuery) ||
      user.email?.toLowerCase().includes(lowerQuery) ||
      user.phone?.includes(lowerQuery)
    );
  }, [searchTerm, statusFilter, users]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-5 py-6">
      <UserHeader />
      <UserStats 
        totalUsers={totalUsers} 
        verifiedUsers={verifiedUsers} 
        pendingUsers={pendingUsers} 
      />
      <UserFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <UserCard users={filteredUsers} />
    </div>
  );
};

export default Users;
