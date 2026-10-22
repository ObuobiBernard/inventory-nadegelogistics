import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PageTab,
  Equipment,
  Category,
  Customer,
  Rental,
  Sale,
  ActivityLog,
  SyncSettings,
  ToastMessage,
  ToastType,
  SelectedServiceItem,
  CustomerOrder,
} from './types';
import * as storage from './services/storage';
import { syncToGoogleSheets } from './services/googleSheets';
import {
  seedInitialFirestoreData,
  subscribeEquipment,
  subscribeCategories,
  subscribeOrders,
  subscribeRentals,
  subscribeSales,
  createOrderInFirestore,
  updateOrderStatusInFirestore,
  saveEquipmentToFirestore,
} from './services/firestoreService';
import { AuthProvider, useAuth } from './context/AuthContext';

import { StaffAuthModal } from './components/staff/StaffAuthModal';
import { ToastContainer } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';

import { DashboardView } from './components/views/DashboardView';
import { OrdersView } from './components/views/OrdersView';
import { EquipmentView } from './components/views/EquipmentView';
import { RentalsView } from './components/views/RentalsView';
import { SalesView } from './components/views/SalesView';
import { CustomersView } from './components/views/CustomersView';
import { CategoriesView } from './components/views/CategoriesView';
import { StaffManagementView } from './components/views/StaffManagementView';

import { ClientCatalog } from './components/client/ClientCatalog';
import { ClientBookingDrawer } from './components/client/ClientBookingDrawer';
import { PaymentModal } from './components/client/PaymentModal';
import { AuthModal } from './components/client/AuthModal';
import { InvoiceReceiptModal } from './components/client/InvoiceReceiptModal';

import { EquipmentModal } from './components/modals/EquipmentModal';
import { RentalModal } from './components/modals/RentalModal';
import { SaleModal } from './components/modals/SaleModal';
import { CustomerModal } from './components/modals/CustomerModal';
import { CategoryModal } from './components/modals/CategoryModal';
import { CsvImportModal } from './components/modals/CsvImportModal';
import { SettingsModal } from './components/modals/SettingsModal';

import { LegalModal, LegalTab } from './components/legal/LegalModal';
import { CookieConsentBanner } from './components/legal/CookieConsentBanner';

const SESSION_TIMEOUT_SECONDS = 5 * 60; // 5 minutes
const WARNING_BEFORE_SECONDS = 30; // 30 seconds

const AppContent: React.FC = () => {
  const { user, isStaff, signOutUser } = useAuth();

  // Mode: 'client' (Public Customer Catalog) vs 'staff' (Inventory RMS)
  const [appPortalMode, setAppPortalMode] = useState<'client' | 'staff'>('client');

  // Staff Session Lock
  const [isStaffLocked, setIsStaffLocked] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [remainingCountdown, setRemainingCountdown] = useState(WARNING_BEFORE_SECONDS);

  // Staff Navigation & Search
  const [currentTab, setCurrentTab] = useState<PageTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Main Data States
  const [equipment, setEquipment] = useState<Equipment[]>(() => storage.getEquipment(true));
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories(true));
  const [customers, setCustomers] = useState<Customer[]>(() => storage.getCustomers(true));
  const [rentals, setRentals] = useState<Rental[]>(() => storage.getRentals(true));
  const [sales, setSales] = useState<Sale[]>(() => storage.getSales(true));
  const [orders, setOrders] = useState<CustomerOrder[]>(() => storage.getOrders());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => storage.getActivityLogs());
  const [settings, setSettings] = useState<SyncSettings>(() => storage.getSettings());

  // Client Selection / Cart State
  const [selectedCartItems, setSelectedCartItems] = useState<SelectedServiceItem[]>([]);
  const [eventNotes, setEventNotes] = useState('');

  // Modals
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedDocOrder, setSelectedDocOrder] = useState<CustomerOrder | null>(null);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('terms');

  const handleOpenLegal = (tab: LegalTab = 'terms') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Staff Modals
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [preSelectedEquipRental, setPreSelectedEquipRental] = useState<string | undefined>();

  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [preSelectedEquipSale, setPreSelectedEquipSale] = useState<string | undefined>();

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [csvImportModalOpen, setCsvImportModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = storage.genId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Seed and subscribe to Firestore
  useEffect(() => {
    seedInitialFirestoreData();

    const unsubEquip = subscribeEquipment((items) => setEquipment(items));
    const unsubCats = subscribeCategories((cats) => setCategories(cats));
    const unsubOrders = subscribeOrders((ords) => setOrders(ords));
    const unsubRentals = subscribeRentals((rents) => setRentals(rents));
    const unsubSales = subscribeSales((sls) => setSales(sls));

    return () => {
      unsubEquip?.();
      unsubCats?.();
      unsubOrders?.();
      unsubRentals?.();
      unsubSales?.();
    };
  }, []);

  // Inactivity session timer for staff portal
  const sessionTimerRef = useRef<any>(null);
  const warningTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const resetSessionTimer = useCallback(() => {
    if (isStaffLocked || appPortalMode !== 'staff') return;

    clearTimeout(sessionTimerRef.current);
    clearTimeout(warningTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    setShowTimeoutWarning(false);
    setRemainingCountdown(WARNING_BEFORE_SECONDS);

    warningTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      let count = WARNING_BEFORE_SECONDS;
      setRemainingCountdown(count);

      countdownIntervalRef.current = setInterval(() => {
        count -= 1;
        setRemainingCountdown(count);
        if (count <= 0) {
          clearInterval(countdownIntervalRef.current);
        }
      }, 1000);
    }, (SESSION_TIMEOUT_SECONDS - WARNING_BEFORE_SECONDS) * 1000);

    sessionTimerRef.current = setTimeout(() => {
      setIsStaffLocked(true);
      setShowTimeoutWarning(false);
      addToast('Staff session locked due to inactivity.', 'info');
    }, SESSION_TIMEOUT_SECONDS * 1000);
  }, [isStaffLocked, appPortalMode, addToast]);

  useEffect(() => {
    if (isStaffLocked || appPortalMode !== 'staff') return;
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleActivity = () => resetSessionTimer();

    events.forEach((evt) => window.addEventListener(evt, handleActivity));
    resetSessionTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      clearTimeout(sessionTimerRef.current);
      clearTimeout(warningTimerRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, [isStaffLocked, appPortalMode, resetSessionTimer]);

  // Client Selection / Booking Actions
  const handleAddServiceToCart = (item: Equipment, serviceType: 'rental' | 'purchase') => {
    const unitPrice = serviceType === 'rental' ? item.rentalPrice : item.salePrice;
    const days = 1;

    setSelectedCartItems((prev) => {
      const existing = prev.find(
        (i) => i.equipmentId === item.id && i.serviceType === serviceType
      );
      if (existing) {
        return prev.map((i) =>
          i.equipmentId === item.id && i.serviceType === serviceType
            ? {
                ...i,
                quantity: i.quantity + 1,
                totalPrice: (i.quantity + 1) * unitPrice * (i.serviceType === 'rental' ? i.days : 1),
              }
            : i
        );
      } else {
        const cat = categories.find((c) => c.id === item.category);
        return [
          ...prev,
          {
            id: storage.genId(),
            equipmentId: item.id,
            name: item.name,
            serviceType,
            quantity: 1,
            unitPrice,
            days,
            totalPrice: unitPrice * days,
            categoryName: cat?.name,
          },
        ];
      }
    });

    addToast(`Added "${item.name}" (${serviceType}) to your selection.`, 'success');
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setSelectedCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            const multiplier = item.serviceType === 'rental' ? item.days : 1;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice * multiplier,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleUpdateCartDays = (id: string, days: number) => {
    setSelectedCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.serviceType === 'rental') {
          return {
            ...item,
            days,
            totalPrice: item.quantity * item.unitPrice * days,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setSelectedCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setSelectedCartItems([]);
  };

  // Order Placement
  const handleOrderCompleted = async (newOrder: CustomerOrder) => {
    try {
      await createOrderInFirestore(newOrder);

      // Decrement available stock
      for (const item of newOrder.items) {
        const eq = equipment.find((e) => e.id === item.equipmentId);
        if (eq) {
          const newAvail = Math.max(0, (eq.available || 0) - item.quantity);
          const updatedEq: Equipment = {
            ...eq,
            available: newAvail,
            status: newAvail === 0 ? 'rented' : eq.status,
          };
          saveEquipmentToFirestore(updatedEq);
        }
      }

      storage.logActivity(
        'New customer order',
        `Order ${newOrder.orderNumber} placed by ${newOrder.customerName} (${storage.formatGHS(newOrder.totalAmount)})`
      );

      // Clear cart
      setSelectedCartItems([]);
      setBookingDrawerOpen(false);

      // Open Document Modal (Proforma Invoice or Receipt)
      setSelectedDocOrder(newOrder);
      setDocModalOpen(true);

      addToast(
        newOrder.paymentStatus === 'paid' || newOrder.paymentStatus === 'partially_paid'
          ? 'Payment successful! Receipt generated.'
          : 'Order confirmed! Official Proforma Invoice generated.',
        'success'
      );
    } catch (err: any) {
      console.error('Error placing order:', err);
      addToast('Could not finalize order in database: ' + (err?.message || ''), 'error');
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: CustomerOrder['orderStatus']
  ) => {
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
      storage.logActivity('Updated order status', `Order ${orderId} status set to "${newStatus}"`);
      addToast(`Order updated to "${newStatus}".`, 'success');
    } catch (err: any) {
      addToast('Could not update status: ' + err.message, 'error');
    }
  };

  // Staff Portal Actions
  const handleSaveEquipment = (data: Partial<Equipment>) => {
    if (editingEquipment) {
      const updated: Equipment = {
        ...editingEquipment,
        ...data,
      } as Equipment;
      storage.saveEquipment(updated);
      saveEquipmentToFirestore(updated);
      storage.logActivity('Updated equipment', `"${updated.name}"`);
      addToast(`Updated "${updated.name}" successfully.`, 'success');
    } else {
      const newItem: Equipment = {
        id: storage.genId(),
        name: data.name || 'New Equipment',
        category: data.category || (categories[0]?.id || 'cat_led'),
        quantity: data.quantity || 1,
        available: data.available !== undefined ? data.available : (data.quantity || 1),
        rentalPrice: data.rentalPrice || 0,
        salePrice: data.salePrice || 0,
        status: data.status || 'available',
        description: data.description || '',
        supplier: data.supplier || '',
        location: data.location || 'Warehouse',
        deleted: false,
      };
      storage.saveEquipment(newItem);
      saveEquipmentToFirestore(newItem);
      storage.logActivity('Added equipment', `"${newItem.name}"`);
      addToast(`Added "${newItem.name}" to inventory.`, 'success');
    }
    setEquipmentModalOpen(false);
    setEditingEquipment(null);
  };

  const handleDeleteEquipment = (id: string) => {
    const item = equipment.find((e) => e.id === id);
    if (!window.confirm(`Delete "${item?.name || 'this item'}"? (It can be restored)`)) return;
    storage.deleteEquipment(id);
    if (item) saveEquipmentToFirestore({ ...item, deleted: true });
    storage.logActivity('Deleted equipment', item ? `"${item.name}"` : id);
    addToast('Equipment moved to deleted archive.', 'info');
  };

  const handleRestoreEquipment = (id: string) => {
    const item = equipment.find((e) => e.id === id);
    storage.restoreEquipment(id);
    if (item) saveEquipmentToFirestore({ ...item, deleted: false });
    storage.logActivity('Restored equipment', item ? `"${item.name}"` : id);
    addToast(`Restored "${item?.name || 'item'}".`, 'success');
  };

  const handleReturnRental = (rentalId: string) => {
    const r = rentals.find((item) => item.id === rentalId);
    if (!r) return;
    if (!window.confirm('Mark this equipment rental as returned? Stock will be restored.')) return;

    const updatedRental: Rental = { ...r, status: 'returned' };
    storage.saveRental(updatedRental);

    const equip = equipment.find((e) => e.id === r.equipmentId);
    if (equip) {
      const restoredAvail = (equip.available || 0) + r.quantity;
      const updatedEquip: Equipment = {
        ...equip,
        available: restoredAvail,
        status: restoredAvail > 0 && equip.status === 'rented' ? 'available' : equip.status,
      };
      storage.saveEquipment(updatedEquip);
      saveEquipmentToFirestore(updatedEquip);
    }

    storage.logActivity('Returned rental', `Rental ${r.id}`);
    addToast('Rental returned! Equipment added back to available stock.', 'success');
  };

  // Google Sheets sync
  const handleSyncToGoogleSheets = async () => {
    setIsSyncing(true);
    const result = await syncToGoogleSheets();
    setIsSyncing(false);
    if (result.success) {
      addToast(result.message, 'success');
    } else {
      addToast(result.message, 'error');
    }
  };

  // Customer orders matching logged in user
  const clientUserOrders = orders.filter(
    (o) => user && (o.customerId === user.uid || o.customerEmail === user.email)
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#edf2f7] flex flex-col antialiased selection:bg-[#f5b342] selection:text-[#0b0e14]">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* CLIENT PORTAL (Catalog section - exclusively for clients & customers) */}
      {appPortalMode === 'client' && (
        <ClientCatalog
          equipment={equipment}
          categories={categories}
          selectedItems={selectedCartItems}
          onAddItem={handleAddServiceToCart}
          onOpenBookingDrawer={() => setBookingDrawerOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onOpenStaffPortal={() => {
            setAppPortalMode('staff');
            setIsStaffLocked(true);
          }}
          clientOrders={clientUserOrders}
          onViewOrderDoc={(order) => {
            setSelectedDocOrder(order);
            setDocModalOpen(true);
          }}
          onOpenLegal={handleOpenLegal}
        />
      )}

      {/* STAFF INVENTORY & RMS PORTAL (Exclusively for staff / inventory management) */}
      {appPortalMode === 'staff' && (
        <>
          {/* Secure Firebase Staff Authentication & First-Time Password Gateway */}
          <StaffAuthModal
            isOpen={isStaffLocked && !isStaff}
            onSuccess={() => {
              setIsStaffLocked(false);
              addToast('Staff credentials verified. Welcome!', 'success');
            }}
            onReturnToCatalog={() => {
              setAppPortalMode('client');
            }}
            showTimeoutWarning={showTimeoutWarning}
            remainingCountdown={remainingCountdown}
            onExtendSession={() => {
              resetSessionTimer();
              addToast('Session extended.', 'success');
            }}
          />

          {(!isStaffLocked || isStaff) && (
            <div className="flex flex-1 min-h-screen">
              {/* Sidebar */}
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  setCurrentTab(tab);
                  setSearchQuery('');
                }}
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                onLockSession={() => {
                  setIsStaffLocked(true);
                  signOutUser();
                  addToast('Staff session logged out & locked.', 'info');
                }}
                onSwitchToClientCatalog={() => setAppPortalMode('client')}
                counts={{
                  equipment: equipment.filter((e) => !e.deleted).length,
                  rentals: rentals.filter((r) => !r.deleted).length,
                  sales: sales.filter((s) => !s.deleted).length,
                  customers: customers.filter((c) => !c.deleted).length,
                  orders: orders.length,
                }}
              />

              {/* Main Workspace */}
              <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <Topbar
                  currentTab={currentTab}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
                  onOpenAddEquipment={() => {
                    setEditingEquipment(null);
                    setEquipmentModalOpen(true);
                  }}
                  onOpenCsvImport={() => setCsvImportModalOpen(true)}
                  onOpenSettings={() => setSettingsModalOpen(true)}
                  onToggleCatalog={() => setAppPortalMode('client')}
                  onSyncGoogleSheets={handleSyncToGoogleSheets}
                  isSyncing={isSyncing}
                />

                {/* Staff Views */}
                <div className="flex-1">
                  {currentTab === 'dashboard' && (
                    <DashboardView
                      equipment={equipment}
                      rentals={rentals}
                      customers={customers}
                      activityLogs={activityLogs}
                      onClearActivityLogs={() => {
                        storage.clearActivityLogs();
                        setActivityLogs([]);
                        addToast('Activity logs cleared.', 'info');
                      }}
                      onNavigate={setCurrentTab}
                    />
                  )}

                  {currentTab === 'orders' && (
                    <OrdersView
                      orders={orders}
                      searchQuery={searchQuery}
                      onUpdateStatus={handleUpdateOrderStatus}
                      onViewDoc={(ord) => {
                        setSelectedDocOrder(ord);
                        setDocModalOpen(true);
                      }}
                    />
                  )}

                  {currentTab === 'equipment' && (
                    <EquipmentView
                      equipment={equipment}
                      categories={categories}
                      searchQuery={searchQuery}
                      onOpenAddModal={() => {
                        setEditingEquipment(null);
                        setEquipmentModalOpen(true);
                      }}
                      onOpenImportModal={() => setCsvImportModalOpen(true)}
                      onEditItem={(item) => {
                        setEditingEquipment(item);
                        setEquipmentModalOpen(true);
                      }}
                      onDeleteItem={handleDeleteEquipment}
                      onRestoreItem={handleRestoreEquipment}
                      onQuickRent={(id) => {
                        setPreSelectedEquipRental(id);
                        setRentalModalOpen(true);
                      }}
                      onQuickSell={(id) => {
                        setPreSelectedEquipSale(id);
                        setSaleModalOpen(true);
                      }}
                    />
                  )}

                  {currentTab === 'rentals' && (
                    <RentalsView
                      rentals={rentals}
                      equipment={equipment}
                      customers={customers}
                      searchQuery={searchQuery}
                      onOpenNewRental={() => {
                        setPreSelectedEquipRental(undefined);
                        setRentalModalOpen(true);
                      }}
                      onReturnRental={handleReturnRental}
                      onDeleteRental={(id) => {
                        storage.deleteRental(id);
                        setRentals(storage.getRentals(true));
                        addToast('Rental soft-deleted.', 'info');
                      }}
                      onRestoreRental={(id) => {
                        storage.restoreRental(id);
                        setRentals(storage.getRentals(true));
                        addToast('Rental restored.', 'success');
                      }}
                    />
                  )}

                  {currentTab === 'sales' && (
                    <SalesView
                      sales={sales}
                      equipment={equipment}
                      customers={customers}
                      searchQuery={searchQuery}
                      onOpenNewSale={() => {
                        setPreSelectedEquipSale(undefined);
                        setSaleModalOpen(true);
                      }}
                      onDeleteSale={(id) => {
                        storage.deleteSale(id);
                        setSales(storage.getSales(true));
                        addToast('Sale soft-deleted.', 'info');
                      }}
                      onRestoreSale={(id) => {
                        storage.restoreSale(id);
                        setSales(storage.getSales(true));
                        addToast('Sale restored.', 'success');
                      }}
                    />
                  )}

                  {currentTab === 'customers' && (
                    <CustomersView
                      customers={customers}
                      searchQuery={searchQuery}
                      onOpenAddCustomer={() => {
                        setEditingCustomer(null);
                        setCustomerModalOpen(true);
                      }}
                      onEditCustomer={(c) => {
                        setEditingCustomer(c);
                        setCustomerModalOpen(true);
                      }}
                      onDeleteCustomer={(id) => {
                        storage.deleteCustomer(id);
                        setCustomers(storage.getCustomers(true));
                        addToast('Customer soft-deleted.', 'info');
                      }}
                      onRestoreCustomer={(id) => {
                        storage.restoreCustomer(id);
                        setCustomers(storage.getCustomers(true));
                        addToast('Customer restored.', 'success');
                      }}
                    />
                  )}

                  {currentTab === 'categories' && (
                    <CategoriesView
                      categories={categories}
                      equipment={equipment}
                      onOpenAddCategory={() => {
                        setEditingCategory(null);
                        setCategoryModalOpen(true);
                      }}
                      onEditCategory={(c) => {
                        setEditingCategory(c);
                        setCategoryModalOpen(true);
                      }}
                      onDeleteCategory={(id) => {
                        storage.deleteCategory(id);
                        setCategories(storage.getCategories(true));
                        addToast('Category soft-deleted.', 'info');
                      }}
                      onRestoreCategory={(id) => {
                        storage.restoreCategory(id);
                        setCategories(storage.getCategories(true));
                        addToast('Category restored.', 'success');
                      }}
                    />
                  )}

                  {currentTab === 'staff-management' && (
                    <StaffManagementView onToast={addToast} />
                  )}
                </div>
              </main>
            </div>
          )}
        </>
      )}

      {/* Client Booking Drawer */}
      <ClientBookingDrawer
        isOpen={bookingDrawerOpen}
        onClose={() => setBookingDrawerOpen(false)}
        items={selectedCartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateDays={handleUpdateCartDays}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        eventNotes={eventNotes}
        onEventNotesChange={setEventNotes}
        onProceedToPayment={() => {
          setBookingDrawerOpen(false);
          setPaymentModalOpen(true);
        }}
      />

      {/* Client Payment Modal (Pay Now Full/Part or Book & Pay Later) */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        items={selectedCartItems}
        subtotal={selectedCartItems.reduce((acc, curr) => acc + curr.totalPrice, 0)}
        eventNotes={eventNotes}
        onOrderCompleted={handleOrderCompleted}
        onRequireAuth={() => setAuthModalOpen(true)}
        onOpenLegal={handleOpenLegal}
      />

      {/* Client Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => addToast('Logged in successfully.', 'success')}
        onOpenLegal={handleOpenLegal}
      />

      {/* Official Printable Invoice / Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        order={selectedDocOrder}
      />

      {/* Legal & Compliance Modal (Privacy Act 843, Terms, Refund, Cookies) */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner onOpenLegal={handleOpenLegal} />

      {/* Staff Modals */}
      <EquipmentModal
        isOpen={equipmentModalOpen}
        onClose={() => {
          setEquipmentModalOpen(false);
          setEditingEquipment(null);
        }}
        onSave={handleSaveEquipment}
        editingItem={editingEquipment}
        categories={categories.filter((c) => !c.deleted)}
      />

      <RentalModal
        isOpen={rentalModalOpen}
        onClose={() => {
          setRentalModalOpen(false);
          setPreSelectedEquipRental(undefined);
        }}
        onSave={(data) => {
          const newRental: Rental = { id: storage.genId(), ...data };
          storage.saveRental(newRental);
          setRentals(storage.getRentals(true));
          setRentalModalOpen(false);
          addToast('Rental created.', 'success');
        }}
        equipmentList={equipment}
        customerList={customers}
        preSelectedEquipmentId={preSelectedEquipRental}
      />

      <SaleModal
        isOpen={saleModalOpen}
        onClose={() => {
          setSaleModalOpen(false);
          setPreSelectedEquipSale(undefined);
        }}
        onSave={(data) => {
          const newSale: Sale = { id: storage.genId(), ...data };
          storage.saveSale(newSale);
          setSales(storage.getSales(true));
          setSaleModalOpen(false);
          addToast('Sale recorded.', 'success');
        }}
        equipmentList={equipment}
        customerList={customers}
        preSelectedEquipmentId={preSelectedEquipSale}
      />

      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => {
          setCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={(data) => {
          if (editingCustomer) {
            storage.saveCustomer({ ...editingCustomer, ...data } as Customer);
          } else {
            storage.saveCustomer({ id: storage.genId(), ...data, deleted: false } as Customer);
          }
          setCustomers(storage.getCustomers(true));
          setCustomerModalOpen(false);
          addToast('Customer saved.', 'success');
        }}
        editingCustomer={editingCustomer}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={(data) => {
          if (editingCategory) {
            storage.saveCategory({ ...editingCategory, ...data } as Category);
          } else {
            storage.saveCategory({ id: storage.genId(), ...data, deleted: false } as Category);
          }
          setCategories(storage.getCategories(true));
          setCategoryModalOpen(false);
          addToast('Category saved.', 'success');
        }}
        editingCategory={editingCategory}
      />

      <CsvImportModal
        isOpen={csvImportModalOpen}
        onClose={() => setCsvImportModalOpen(false)}
        categories={categories}
        existingEquipment={equipment}
        onImportComplete={(count, catName, newItems) => {
          newItems.forEach((item) => saveEquipmentToFirestore(item));
          setEquipment(storage.getEquipment(true));
          addToast(`Imported ${count} items into "${catName}".`, 'success');
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSave={(newSet) => {
          storage.saveSettings(newSet);
          setSettings(newSet);
          addToast('Settings saved.', 'success');
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
