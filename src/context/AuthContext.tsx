import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase/config';
import { UserProfile, UserRole, StaffInvitation } from '../types';
import { BOOTSTRAP_ADMIN_EMAIL } from '../services/storage';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, phone?: string, company?: string) => Promise<void>;
  registerStaffFirstTime: (email: string, pass: string, name: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize or create user profile in Firestore
  const syncUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
    const emailNorm = (firebaseUser.email || '').trim().toLowerCase();
    const isBootstrapped = emailNorm === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
    const userDocRef = doc(db, 'users', firebaseUser.uid);

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        // Keep bootstrap admin check in sync
        if (isBootstrapped && data.role !== 'admin') {
          const updated: UserProfile = { ...data, role: 'admin' };
          await setDoc(userDocRef, updated, { merge: true });
          return updated;
        }
        return data;
      } else {
        // Check if there is an active staff invitation for this email
        let assignedRole: UserRole = isBootstrapped ? 'admin' : 'client';
        try {
          const invSnap = await getDoc(doc(db, 'staffInvitations', emailNorm));
          if (invSnap.exists()) {
            const inv = invSnap.data() as StaffInvitation;
            assignedRole = inv.role;
            // Mark invitation as claimed
            await updateDoc(doc(db, 'staffInvitations', emailNorm), {
              claimed: true,
              claimedAt: new Date().toISOString(),
              uid: firebaseUser.uid,
            });
          }
        } catch (invErr) {
          console.warn('Invitation check during profile sync note:', invErr);
        }

        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: emailNorm,
          displayName: firebaseUser.displayName || 'Staff Member',
          role: assignedRole,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        return newProfile;
      }
    } catch (error) {
      console.warn('Could not sync user profile with Firestore, using fallback:', error);
      return {
        uid: firebaseUser.uid,
        email: emailNorm,
        displayName: firebaseUser.displayName || 'User',
        role: isBootstrapped ? 'admin' : 'client',
      };
    }
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      const prof = await syncUserProfile(auth.currentUser);
      setUserProfile(prof);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await syncUserProfile(currentUser);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const profile = await syncUserProfile(result.user);
        setUserProfile(profile);
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (result.user) {
        const profile = await syncUserProfile(result.user);
        setUserProfile(profile);
      }
    } catch (error: any) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    phone?: string,
    company?: string
  ) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        const isBootstrapped = normalizedEmail === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
        const profile: UserProfile = {
          uid: result.user.uid,
          email: normalizedEmail,
          displayName: name,
          role: isBootstrapped ? 'admin' : 'client',
          phone,
          company,
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(doc(db, 'users', result.user.uid), profile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${result.user.uid}`);
        }
        setUserProfile(profile);
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      throw error;
    }
  };

  // First-time staff registration: creates the staff account and claims their authorization
  const registerStaffFirstTime = async (email: string, pass: string, name: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // 1. Verify invitation existence
    const invRef = doc(db, 'staffInvitations', normalizedEmail);
    const invSnap = await getDoc(invRef);
    if (!invSnap.exists()) {
      throw new Error('This email has not been pre-authorized by an administrator.');
    }
    const invitation = invSnap.data() as StaffInvitation;

    // 2. Create the user with their desired personal password
    const result = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
    if (result.user) {
      await updateProfile(result.user, { displayName: name || invitation.name || 'Staff' });

      // 3. Create user profile in Firestore with authorized staff role
      const profile: UserProfile = {
        uid: result.user.uid,
        email: normalizedEmail,
        displayName: name || invitation.name || 'Staff Member',
        role: invitation.role || 'staff',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', result.user.uid), profile);

      // 4. Mark invitation as claimed
      await updateDoc(invRef, {
        claimed: true,
        claimedAt: new Date().toISOString(),
        uid: result.user.uid,
      });

      setUserProfile(profile);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  // Determine if user has staff privileges
  const isAdmin =
    user?.email?.trim().toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ||
    userProfile?.role === 'admin';

  const isStaff =
    isAdmin ||
    userProfile?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        isStaff,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        registerStaffFirstTime,
        signOutUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
