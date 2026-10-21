import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Equipment, Category, Rental, Sale, ActivityLog, CustomerOrder, StaffInvitation } from '../types';
import {
  DEFAULT_EQUIPMENT,
  DEFAULT_CATEGORIES,
  DEFAULT_RENTALS,
  getEquipment as getLocalEquip,
  saveOrder as saveLocalOrder,
} from './storage';

// Seed Initial Data to Firestore if collection is empty
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const equipSnap = await getDocs(collection(db, 'equipment'));
    if (equipSnap.empty) {
      console.log('Seeding initial equipment to Firestore in Ghanaian Cedis (GHS)...');
      for (const item of DEFAULT_EQUIPMENT) {
        await setDoc(doc(db, 'equipment', item.id), item);
      }
    }

    const catSnap = await getDocs(collection(db, 'categories'));
    if (catSnap.empty) {
      for (const cat of DEFAULT_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    const rentalSnap = await getDocs(collection(db, 'rentals'));
    if (rentalSnap.empty) {
      for (const r of DEFAULT_RENTALS) {
        await setDoc(doc(db, 'rentals', r.id), r);
      }
    }
  } catch (error) {
    console.warn('Firestore initial seeding note:', error);
  }
}

// EQUIPMENT
export function subscribeEquipment(onUpdate: (items: Equipment[]) => void): () => void {
  const path = 'equipment';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items: Equipment[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Equipment, 'id'>) });
        });
        if (items.length > 0) {
          onUpdate(items);
        } else {
          onUpdate(getLocalEquip(true));
        }
      },
      (error) => {
        console.warn('Equipment snapshot listener error:', error.message);
        onUpdate(getLocalEquip(true));
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveEquipmentToFirestore(item: Equipment): Promise<void> {
  const path = `equipment/${item.id}`;
  try {
    await setDoc(doc(db, 'equipment', item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ORDERS
export function subscribeOrders(onUpdate: (orders: CustomerOrder[]) => void): () => void {
  const path = 'orders';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list: CustomerOrder[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<CustomerOrder, 'id'>) });
        });
        // Sort newest first
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onUpdate(list);
      },
      (error) => {
        console.warn('Orders listener error (possibly unauthorized for non-staff):', error.message);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createOrderInFirestore(order: CustomerOrder): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);
    saveLocalOrder(order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  orderStatus: CustomerOrder['orderStatus']
): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), { orderStatus });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// CATEGORIES
export function subscribeCategories(onUpdate: (cats: Category[]) => void): () => void {
  const path = 'categories';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list: Category[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
        });
        if (list.length > 0) onUpdate(list);
      },
      (error) => {
        console.warn('Categories listener error:', error.message);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveCategoryToFirestore(cat: Category): Promise<void> {
  const path = `categories/${cat.id}`;
  try {
    await setDoc(doc(db, 'categories', cat.id), cat);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// RENTALS
export function subscribeRentals(onUpdate: (rentals: Rental[]) => void): () => void {
  const path = 'rentals';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list: Rental[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Rental, 'id'>) });
        });
        if (list.length > 0) onUpdate(list);
      },
      (error) => {
        console.warn('Rentals listener note:', error.message);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveRentalToFirestore(rental: Rental): Promise<void> {
  const path = `rentals/${rental.id}`;
  try {
    await setDoc(doc(db, 'rentals', rental.id), rental);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// SALES
export function subscribeSales(onUpdate: (sales: Sale[]) => void): () => void {
  const path = 'sales';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list: Sale[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Sale, 'id'>) });
        });
        if (list.length > 0) onUpdate(list);
      },
      (error) => {
        console.warn('Sales listener note:', error.message);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveSaleToFirestore(sale: Sale): Promise<void> {
  const path = `sales/${sale.id}`;
  try {
    await setDoc(doc(db, 'sales', sale.id), sale);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// STAFF INVITATIONS & ACCESS CONTROL
export function subscribeStaffInvitations(onUpdate: (invitations: StaffInvitation[]) => void): () => void {
  const path = 'staffInvitations';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list: StaffInvitation[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as StaffInvitation);
        });
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onUpdate(list);
      },
      (error) => {
        console.warn('Staff invitations listener note:', error.message);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function checkStaffInvitation(email: string): Promise<StaffInvitation | null> {
  const normalized = email.trim().toLowerCase();
  const path = `staffInvitations/${normalized}`;
  try {
    const snap = await import('firebase/firestore').then(f => f.getDoc(doc(db, 'staffInvitations', normalized)));
    if (snap.exists()) {
      return snap.data() as StaffInvitation;
    }
    return null;
  } catch (error) {
    console.warn('Check staff invitation query error:', error);
    return null;
  }
}

export async function saveStaffInvitation(invitation: StaffInvitation): Promise<void> {
  const normalized = invitation.email.trim().toLowerCase();
  const path = `staffInvitations/${normalized}`;
  try {
    await setDoc(doc(db, 'staffInvitations', normalized), {
      ...invitation,
      email: normalized,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStaffInvitation(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const path = `staffInvitations/${normalized}`;
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'staffInvitations', normalized));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function claimStaffInvitation(email: string, uid: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const path = `staffInvitations/${normalized}`;
  try {
    await updateDoc(doc(db, 'staffInvitations', normalized), {
      claimed: true,
      claimedAt: new Date().toISOString(),
      uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// USER MANAGEMENT & ROLE ASSIGNMENT
export function subscribeUsers(onUpdate: (users: import('../types').UserProfile[]) => void): () => void {
  const path = 'users';
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const list: import('../types').UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as import('../types').UserProfile);
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('Users listener note:', error.message);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateUserRoleInFirestore(uid: string, newRole: import('../types').UserRole): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), { role: newRole });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

