import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Building2 } from 'lucide-react';
import { useToast } from '@camera-rental-house/ui';
import axiosInstance from '../../../api/axiosInstance';

// Components
import DetailHeader from './DetailHeader';
import DetailStats from './DetailStats';
import OwnerCredentials from './OwnerCredentials';
import DetailHistory from './DetailHistory';

const HouseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [house, setHouse] = useState<any>(null);
  const [houseRentals, setHouseRentals] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const [detailRes, rentalsRes] = await Promise.all([
          axiosInstance.get(`/admin/houses/slug/${slug}`),
          axiosInstance.get(`/rentals/house/slug/${slug}`)
        ]);
        
        setHouse(detailRes.data);
        setHouseRentals(rentalsRes.data || []);

        if (detailRes.data.users?.email) {
          setCredentials(prev => ({ ...prev, username: detailRes.data.users.email }));
        }
      } catch (error) {
        addToast({ title: 'Error', message: 'Failed to fetch house details.', tone: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchHouseData();
  }, [slug, addToast]);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.password) return;
    setIsUpdatingCreds(true);
    try {
      await axiosInstance.post(`/admin/houses/${house.id}/credentials`, credentials);
      addToast({ title: 'Success', message: 'Credentials updated successfully.', tone: 'success' });
      setCredentials(prev => ({ ...prev, password: '' }));
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to update credentials.', tone: 'error' });
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="admin-shell py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-300">
          <Building2 className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-black text-ink">Production House Not Found</h2>
        <p className="mt-2 text-sm font-medium text-muted">The record you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/houses')}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-5 py-6">
      <DetailHeader house={house} />

      <div className="flex flex-col gap-5">
        <OwnerCredentials
          house={house}
          credentials={credentials}
          setCredentials={setCredentials}
          isUpdating={isUpdatingCreds}
          onUpdate={handleUpdateCredentials}
        />

        <DetailStats house={house} />
      </div>

      <DetailHistory
        rentals={houseRentals}
        expandedOrderId={expandedOrderId}
        setExpandedOrderId={setExpandedOrderId}
      />
    </div>
  );
};

export default HouseDetailPage;
