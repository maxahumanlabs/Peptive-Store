'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/auth';
import { User } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<{billing: any; shipping: any} | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isValid = await authAPI.validateToken();
    
    if (!isValid) {
      router.push('/login');
      return;
    }

    const currentUser = await authAPI.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      // Load orders and addresses
      const customerOrders = await authAPI.getCustomerOrders();
      const customerAddresses = await authAPI.getCustomerAddresses();
      setOrders(customerOrders);
      setAddresses(customerAddresses);
    } else {
      router.push('/login');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="px-4 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-sm text-gray-600">
            Welcome back, {user?.firstName || user?.displayName || user?.username}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Addresses
              </button>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl text-gray-900 mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-900 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.firstName || ''}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-900 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.lastName || ''}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-900 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-900 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.username || ''}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <button className="bg-gray-900 text-white text-sm py-2.5 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl text-gray-900 mb-6">Order History</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Order #{order.id}</p>
                              <p className="text-sm text-gray-900">
                                {new Date(order.date_created).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs">
                              {order.status}
                            </span>
                          </div>
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-lg text-gray-900">
                              Dhs. {parseFloat(order.total).toFixed(2)}
                            </p>
                            <Link 
                              href={`/orders/${order.id}`}
                              className="inline-block mt-2 text-sm text-gray-900 hover:text-gray-700 hover:underline transition-all"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-600 mb-6">No orders yet</p>
                      <Link 
                        href="/products"
                        className="inline-block bg-gray-900 text-white text-sm py-2.5 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-xl text-gray-900 mb-6">Saved Addresses</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Billing Address */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 transition-all">
                      <h3 className="text-base text-gray-900 mb-3">Billing Address</h3>
                      {addresses?.billing && (addresses.billing.address_1 || addresses.billing.city) ? (
                        <div className="text-gray-600 text-sm space-y-1 mb-4">
                          <p>{addresses.billing.first_name} {addresses.billing.last_name}</p>
                          {addresses.billing.company && <p>{addresses.billing.company}</p>}
                          <p>{addresses.billing.address_1}</p>
                          {addresses.billing.address_2 && <p>{addresses.billing.address_2}</p>}
                          <p>{addresses.billing.city}, {addresses.billing.state} {addresses.billing.postcode}</p>
                          <p>{addresses.billing.country}</p>
                          {addresses.billing.phone && <p>Phone: {addresses.billing.phone}</p>}
                          {addresses.billing.email && <p>Email: {addresses.billing.email}</p>}
                        </div>
                      ) : (
                        <div className="text-gray-600 text-sm space-y-1 mb-4">
                          <p>No billing address saved</p>
                        </div>
                      )}
                      <button className="text-sm text-gray-900 hover:text-gray-700 hover:underline transition-all">
                        {addresses?.billing && (addresses.billing.address_1 || addresses.billing.city) ? 'Edit Address' : 'Add Address'} →
                      </button>
                    </div>

                    {/* Shipping Address */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 transition-all">
                      <h3 className="text-base text-gray-900 mb-3">Shipping Address</h3>
                      {addresses?.shipping && (addresses.shipping.address_1 || addresses.shipping.city) ? (
                        <div className="text-gray-600 text-sm space-y-1 mb-4">
                          <p>{addresses.shipping.first_name} {addresses.shipping.last_name}</p>
                          {addresses.shipping.company && <p>{addresses.shipping.company}</p>}
                          <p>{addresses.shipping.address_1}</p>
                          {addresses.shipping.address_2 && <p>{addresses.shipping.address_2}</p>}
                          <p>{addresses.shipping.city}, {addresses.shipping.state} {addresses.shipping.postcode}</p>
                          <p>{addresses.shipping.country}</p>
                        </div>
                      ) : (
                        <div className="text-gray-600 text-sm space-y-1 mb-4">
                          <p>No shipping address saved</p>
                        </div>
                      )}
                      <button className="text-sm text-gray-900 hover:text-gray-700 hover:underline transition-all">
                        {addresses?.shipping && (addresses.shipping.address_1 || addresses.shipping.city) ? 'Edit Address' : 'Add Address'} →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
