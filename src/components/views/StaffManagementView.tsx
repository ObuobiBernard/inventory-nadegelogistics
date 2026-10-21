import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeStaffInvitations,
  saveStaffInvitation,
  deleteStaffInvitation,
  subscribeUsers,
  updateUserRoleInFirestore,
} from '../../services/firestoreService';
import { StaffInvitation, UserProfile, UserRole } from '../../types';
import { BOOTSTRAP_ADMIN_EMAIL, logActivity } from '../../services/storage';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Database,
  Lock,
  RefreshCw,
  Users,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';

interface StaffManagementViewProps {
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({ onToast }) => {
  const { user, userProfile, isAdmin } = useAuth();

  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state to add new staff
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'staff' | 'admin'>('staff');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Subscriptions
  useEffect(() => {
    const unsubInvitations = subscribeStaffInvitations((invs) => setInvitations(invs));
    const unsubUsers = subscribeUsers((users) => setUsersList(users));

    return () => {
      unsubInvitations?.();
      unsubUsers?.();
    };
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      onToast('Please enter a valid staff email address.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const newInv: StaffInvitation = {
        email: cleanEmail,
        role: newRole,
        name: newName.trim() || undefined,
        assignedBy: user?.email || user?.uid || 'Admin',
        claimed: false,
        createdAt: new Date().toISOString(),
      };

      await saveStaffInvitation(newInv);
      logActivity(
        'Assigned staff access',
        `Authorized ${cleanEmail} as ${newRole} (awaiting first-time password setup)`
      );

      onToast(`Staff authorization added for "${cleanEmail}". They can now set their password on login!`, 'success');
      setNewEmail('');
      setNewName('');
      setNewRole('staff');
      setIsAddFormOpen(false);
    } catch (err: any) {
      console.error('Error adding staff invitation:', err);
      onToast('Could not save staff invitation: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeStaff = async (email: string) => {
    if (email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
      onToast('Superadmin access cannot be revoked.', 'error');
      return;
    }

    if (!window.confirm(`Revoke staff authorization for ${email}? They will no longer be able to access the Staff RMS.`)) {
      return;
    }

    try {
      await deleteStaffInvitation(email);
      // Also downgrade role in user list if account exists
      const targetUser = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (targetUser && targetUser.uid) {
        await updateUserRoleInFirestore(targetUser.uid, 'client');
      }

      logActivity('Revoked staff access', `Revoked ${email}`);
      onToast(`Staff authorization revoked for ${email}.`, 'info');
    } catch (err: any) {
      onToast('Error revoking staff access: ' + err.message, 'error');
    }
  };

  const handleChangeUserRole = async (targetUser: UserProfile, role: UserRole) => {
    if (targetUser.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() && role !== 'admin') {
      onToast('Cannot change root superadmin role.', 'error');
      return;
    }

    try {
      await updateUserRoleInFirestore(targetUser.uid, role);
      logActivity('Changed user role', `Updated ${targetUser.email} to ${role}`);
      onToast(`Role for ${targetUser.email} updated to "${role.toUpperCase()}".`, 'success');
    } catch (err: any) {
      onToast('Failed to update user role: ' + err.message, 'error');
    }
  };

  const filteredInvitations = invitations.filter(
    (inv) =>
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.name && inv.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Architecture & RBAC Explanation */}
      <div className="bg-gradient-to-r from-[#131a24] to-[#1a232f] border border-[#2a3a4a] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f5b342]/15 border border-[#f5b342]/30 flex items-center justify-center text-[#f5b342] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#edf2f7]">
                  Staff Role-Based Access Control (RBAC)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] text-xs font-semibold border border-[#22c55e]/30">
                  Firebase Fortified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 max-w-2xl">
                Assign staff emails with zero hardcoded passwords. When an assigned staff member visits the portal for the first time with their email, they create their own personal password.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="px-4 py-2.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isAddFormOpen ? 'Cancel' : 'Authorize New Staff'}</span>
            </button>
          </div>
        </div>

        {/* Firebase Data destination indicator */}
        <div className="mt-5 pt-4 border-t border-[#2a3a4a]/70 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#3b82f6]" />
            <span>Database: <strong className="text-white font-mono text-[11px]">Firestore Enterprise (live)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#22c55e]" />
            <span>Security: <strong className="text-white">firestore.rules enforced server-side</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#f5b342]" />
            <span>Active Roles: <strong className="text-[#22c55e]">Client</strong>, <strong className="text-[#3b82f6]">Staff</strong>, <strong className="text-[#f5b342]">Admin</strong></span>
          </div>
        </div>
      </div>

      {/* Authorize New Staff Form Dropdown */}
      {isAddFormOpen && (
        <div className="bg-[#1a232f] border border-[#f5b342]/40 rounded-2xl p-6 shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-[#f5b342]" />
            <h3 className="text-base font-bold text-[#edf2f7]">
              Authorize New Staff Email
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] mb-4">
            Enter the staff member's email. You do NOT create any password for them. The staff member will create their own secure first-time password upon logging in.
          </p>

          <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                Staff Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. staff.member@nadegelogistics.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-xl px-3.5 py-2.5 text-xs text-[#edf2f7] placeholder-[#64748b] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                Staff Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Kwame Mensah"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-xl px-3.5 py-2.5 text-xs text-[#edf2f7] placeholder-[#64748b] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                Role Permission Level
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'staff' | 'admin')}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-xl px-3.5 py-2.5 text-xs text-[#edf2f7] outline-none"
              >
                <option value="staff">Staff (Inventory & Rentals RMS)</option>
                <option value="admin">Admin (Full Control & User Management)</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="px-4 py-2 bg-[#212d3d] hover:bg-[#2a3a4a] text-[#edf2f7] text-xs font-medium rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-[#0b0e14] font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Authorizing...' : 'Save & Authorize Email'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search staff email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-xl pl-10 pr-4 py-2 text-xs text-[#edf2f7] placeholder-[#64748b] outline-none"
          />
        </div>
        <div className="text-xs text-[#94a3b8]">
          Total Authorized: <strong className="text-white">{invitations.length}</strong> · Registered Profiles: <strong className="text-white">{usersList.length}</strong>
        </div>
      </div>

      {/* SECTION 1: Authorized Staff Invitations List */}
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#edf2f7] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#f5b342]" />
              <span>Authorized Staff & First-Time Password Status</span>
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Whitelisted staff accounts. If status is "Pending", the staff member creates their password on their first login attempt.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#131a24] text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-[#2a3a4a]">
              <tr>
                <th className="py-3 px-4">Staff Email</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Role Level</th>
                <th className="py-3 px-4">Password Status</th>
                <th className="py-3 px-4">Authorized Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3a4a]">
              {/* Always display superadmin owner */}
              <tr className="bg-[#f5b342]/5">
                <td className="py-3 px-4 font-mono font-medium text-[#edf2f7]">
                  {BOOTSTRAP_ADMIN_EMAIL}
                </td>
                <td className="py-3 px-4 text-[#94a3b8]">Super Admin (Owner)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-[#f5b342]/20 text-[#f5b342] font-semibold text-[11px] border border-[#f5b342]/30">
                    SUPERADMIN
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Root Admin Active
                  </span>
                </td>
                <td className="py-3 px-4 text-[#94a3b8]">Permanent</td>
                <td className="py-3 px-4 text-right text-[11px] text-[#64748b] italic">
                  Protected
                </td>
              </tr>

              {filteredInvitations.map((inv) => (
                <tr key={inv.email} className="hover:bg-[#131a24]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-[#edf2f7]">
                    {inv.email}
                  </td>
                  <td className="py-3.5 px-4 text-[#94a3b8]">
                    {inv.name || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                        inv.role === 'admin'
                          ? 'bg-[#f5b342]/15 text-[#f5b342] border border-[#f5b342]/30'
                          : 'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30'
                      }`}
                    >
                      {inv.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {inv.claimed ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] text-[11px] font-medium border border-[#22c55e]/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Password Set & Claimed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f5b342]/15 text-[#f5b342] text-[11px] font-medium border border-[#f5b342]/30 animate-pulse">
                        <Clock className="w-3 h-3" />
                        Pending First-Time Password
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#94a3b8]">
                    {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRevokeStaff(inv.email)}
                      className="px-2.5 py-1 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors text-xs inline-flex items-center gap-1"
                      title="Revoke access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInvitations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#94a3b8] italic">
                    No custom staff members added yet. Click "Authorize New Staff" to assign credentials to your team.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Live Firebase Users & Role Level Control */}
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-[#2a3a4a] flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#edf2f7] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#3b82f6]" />
              <span>Live Firebase User Profiles & Role Assignment</span>
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Change any user's role directly on Firebase Firestore. Changes take effect instantly across all sessions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#131a24] text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-[#2a3a4a]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Change Role Level</th>
                <th className="py-3 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3a4a]">
              {filteredUsers.map((u) => {
                const isRoot = u.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
                return (
                  <tr key={u.uid} className="hover:bg-[#131a24]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#edf2f7]">{u.displayName || 'User'}</div>
                      <div className="text-[10px] font-mono text-[#64748b]">ID: {u.uid.slice(0, 12)}...</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#94a3b8]">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-[#f5b342]/15 text-[#f5b342] border border-[#f5b342]/30'
                            : u.role === 'staff'
                            ? 'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30'
                            : 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isRoot ? (
                        <span className="text-[11px] text-[#f5b342] font-semibold italic">Permanent Owner</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u, e.target.value as UserRole)}
                          className="bg-[#131a24] border border-[#2a3a4a] text-xs text-[#edf2f7] rounded-lg px-2.5 py-1 outline-none focus:border-[#f5b342]"
                        >
                          <option value="client">Client (Public Catalog only)</option>
                          <option value="staff">Staff (Inventory & Rentals RMS)</option>
                          <option value="admin">Admin (Full Control)</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#94a3b8]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#94a3b8] italic">
                    No registered user accounts found in Firestore yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
