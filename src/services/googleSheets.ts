import { getEquipment, getCategories, getCustomers, getRentals, getSales, logActivity, getSettings } from './storage';

export const SYNC_COOLDOWN_SECONDS = 30;
let lastSyncTimestamp = 0;

export function getRemainingSyncCooldown(): number {
  const elapsed = (Date.now() - lastSyncTimestamp) / 1000;
  if (elapsed >= SYNC_COOLDOWN_SECONDS) return 0;
  return Math.ceil(SYNC_COOLDOWN_SECONDS - elapsed);
}

export async function syncToGoogleSheets(): Promise<{ success: boolean; message: string }> {
  const settings = getSettings();
  if (!settings.url || !settings.secret) {
    return {
      success: false,
      message: 'Please configure your Google Sheets sync settings first (⚙️).',
    };
  }

  const cooldown = getRemainingSyncCooldown();
  if (cooldown > 0) {
    return {
      success: false,
      message: `Please wait ${cooldown}s before syncing again.`,
    };
  }

  try {
    const payload = {
      secret: settings.secret,
      equipment: getEquipment(true),
      rentals: getRentals(true),
      sales: getSales(true),
      customers: getCustomers(true),
      categories: getCategories(true),
    };

    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify(payload));

    const response = await fetch(settings.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();

    if (result.success) {
      lastSyncTimestamp = Date.now();
      logActivity('Sync to Google Sheets', 'Success');
      return {
        success: true,
        message: result.message || 'Sync complete! Check your Google Sheet.',
      };
    } else {
      logActivity('Sync to Google Sheets', 'Failed: ' + (result.error || 'Unknown error'));
      return {
        success: false,
        message: 'Sync failed: ' + (result.error || 'Unknown error'),
      };
    }
  } catch (error: any) {
    logActivity('Sync to Google Sheets', 'Error: ' + (error?.message || 'Network error'));
    return {
      success: false,
      message: 'Network error: ' + (error?.message || 'Failed to reach Google Apps Script'),
    };
  }
}
