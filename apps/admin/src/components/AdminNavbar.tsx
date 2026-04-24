import { Camera, LogOut, Menu } from 'lucide-react';
import { clearAdminSession, getAuthRole } from '../../../../packages/auth';
import { resolveAuthAppUrl } from '../../../../packages/auth/appUrls';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const AdminNavbar = ({ onOpenSidebar }) => {
  const role = getAuthRole();
  const isStaff = role === 'staff';

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur ${
        isStaff
          ? 'border-teal-200 bg-teal-50/95'
          : 'border-line/80 bg-white/90'
      }`}
    >
      <div className="admin-shell flex h-20 items-center justify-between gap-4 lg:h-24">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                isStaff
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-primary-light text-primary'
              }`}
            >
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-ink">
                {isStaff ? 'Camera Rental House Counter' : 'Camera Rental House Admin'}
              </p>
              <p className="text-xs text-muted capitalize">
                {isStaff ? 'staff counter mode' : 'admin control mode'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            clearAdminSession();
            window.location.replace(`${authAppUrl}/login`);
          }}
          className={isStaff ? 'pill-button border border-teal-200 bg-white text-teal-700' : 'secondary-button'}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
