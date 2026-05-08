import { adminUsers } from '../../data/mockAdmin';
import UserHeader from './UserHeader';
import UserStats from './UserStats';
import UserFilters from './UserFilters';
import UserTable from './UserTable';

const Users = () => {
  const activeUsers = adminUsers.filter((user) => !user.is_blocked).length;

  return (
    <div className="admin-shell space-y-5 py-6">
      <UserHeader />
      <UserStats totalUsers={adminUsers.length} activeUsers={activeUsers} />
      <UserFilters />
      <UserTable users={adminUsers} />
    </div>
  );
};

export default Users;
