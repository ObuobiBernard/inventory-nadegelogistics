import React, { useState, useRef } from 'react';
import { Category, Equipment, EquipmentStatus } from '../../types';
import { genId } from '../../services/storage';
import { X, UploadCloud, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  existingEquipment: Equipment[];
  onImportComplete: (importedCount: number, categoryName: string, newItems: Equipment[], newCat?: Category) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  categories,
  existingEquipment,
  onImportComplete,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [csvFileName, setCsvFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [categoryChoice, setCategoryChoice] = useState('new');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const parseCsvText = (text: string, fileName: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
    if (lines.length < 2) {
      setErrorMessage('CSV file must have a header row and at least one data row.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Split respecting potential quotes
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      if (values.length >= 1) {
        const rowObj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });
        rows.push(rowObj);
      }
    }

    if (rows.length === 0) {
      setErrorMessage('No valid data rows found in CSV.');
      return;
    }

    setErrorMessage('');
    setCsvFileName(fileName.replace('.csv', ''));
    setParsedRows(rows);

    // Auto select category
    const fLower = fileName.toLowerCase();
    if (fLower.includes('led')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('led'));
      if (match) setCategoryChoice(match.id);
      else setCategoryChoice('LED Screens');
    } else if (fLower.includes('sound') || fLower.includes('audio')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('sound'));
      if (match) setCategoryChoice(match.id);
      else setCategoryChoice('Sound Equipment');
    } else if (fLower.includes('stage')) {
      const match = categories.find((c) => c.name.toLowerCase().includes('stage'));
      if (match) setCategoryChoice(match.id);
      else setCategoryChoice('Stage');
    } else {
      setCategoryChoice('new');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please select a valid .csv file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCsvText(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;

    let targetCatId = categoryChoice;
    let targetCatName = '';
    let newCategoryToSave: Category | undefined;

    if (categoryChoice === 'new' || !categories.some((c) => c.id === categoryChoice)) {
      // Create new category
      targetCatName =
        categoryChoice === 'new'
          ? csvFileName
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())
              .replace(/\s*(inventory|sheet|data|list)$/i, '')
          : categoryChoice;

      const existingMatch = categories.find(
        (c) => c.name.toLowerCase() === targetCatName.toLowerCase() && !c.deleted
      );

      if (existingMatch) {
        targetCatId = existingMatch.id;
        targetCatName = existingMatch.name;
      } else {
        newCategoryToSave = {
          id: genId(),
          name: targetCatName,
          icon: 'fa-solid fa-cube',
          deleted: false,
        };
        targetCatId = newCategoryToSave.id;
      }
    } else {
      const existing = categories.find((c) => c.id === categoryChoice);
      targetCatName = existing ? existing.name : 'General';
    }

    const existingNames = new Set(existingEquipment.map((e) => e.name.toLowerCase()));
    const newItems: Equipment[] = [];

    parsedRows.forEach((row) => {
      const name =
        row['Item Description'] ||
        row['Description'] ||
        row['Item Name'] ||
        row['name'] ||
        'Imported Equipment';

      if (existingNames.has(name.toLowerCase())) {
        return; // skip duplicate
      }

      const id = row['Item ID'] || row['id'] || genId();
      const qty = parseInt(row['Quantity'] || row['quantity'] || '1') || 1;
      const rentalPrice = parseFloat(row['Rental Price'] || row['rentalPrice'] || '0') || 0;
      const salePrice =
        parseFloat(row['Sale Price'] || row['salePrice'] || row['Unit Cost (GHS)'] || '0') || 0;
      const statusRaw = (row['Rental Status'] || row['status'] || 'available').toLowerCase();
      const validStatuses: EquipmentStatus[] = ['available', 'rented', 'maintenance', 'reserved', 'sold'];
      const status: EquipmentStatus = validStatuses.includes(statusRaw as any)
        ? (statusRaw as EquipmentStatus)
        : 'available';

      newItems.push({
        id,
        name,
        category: targetCatId,
        description: row['Notes'] || row['notes'] || `Imported from ${csvFileName}`,
        quantity: qty,
        available: qty,
        rentalPrice,
        salePrice,
        status,
        supplier: row['Supplier'] || '',
        location: row['Location'] || '',
        purchaseDate: row['Purchase Date'] || '',
        condition: row['Condition'] || 'New',
        invoice: row['Invoice / Ref No.'] || '',
        deleted: false,
        _imported: true,
        _importDate: new Date().toISOString(),
      });
      existingNames.add(name.toLowerCase());
    });

    onImportComplete(newItems.length, targetCatName, newItems, newCategoryToSave);
    onClose();
  };

  const handleClear = () => {
    setParsedRows([]);
    setCsvFileName('');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a232f] border border-[#2a3a4a] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2a3a4a]">
          <div className="flex items-center gap-2 text-[#edf2f7]">
            <FileSpreadsheet className="w-5 h-5 text-[#22c55e]" />
            <h3 className="font-bold text-lg">Import Equipment from CSV</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#ef4444]/15 border border-[#ef4444]/30 rounded-lg text-xs text-[#ef4444] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drop zone */}
        {parsedRows.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#f5b342] bg-[#f5b342]/10'
                : 'border-[#2a3a4a] bg-[#131a24] hover:border-[#f5b342]/60 hover:bg-[#1a232f]'
            }`}
          >
            <UploadCloud className="w-12 h-12 text-[#94a3b8] mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-[#edf2f7] mb-1">
              Click to browse or drag & drop CSV file
            </p>
            <p className="text-xs text-[#64748b]">
              Supports standard NADEGE inventory exports & spreadsheets
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                Category to import into
              </label>
              <select
                value={categoryChoice}
                onChange={(e) => setCategoryChoice(e.target.value)}
                className="w-full bg-[#131a24] border border-[#2a3a4a] focus:border-[#f5b342] rounded-lg px-3.5 py-2.5 text-sm text-[#edf2f7] outline-none"
              >
                <option value="new">Create new category from filename ({csvFileName})</option>
                {categories
                  .filter((c) => !c.deleted)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Preview Table */}
            <div>
              <div className="flex justify-between items-center text-xs text-[#94a3b8] mb-1.5">
                <span className="font-semibold uppercase tracking-wider">Preview ({parsedRows.length} rows)</span>
                <span className="text-[#f5b342] font-medium">{csvFileName}.csv</span>
              </div>
              <div className="max-h-52 overflow-y-auto bg-[#131a24] border border-[#2a3a4a] rounded-lg p-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2a3a4a] text-[#94a3b8]">
                      <th className="py-1.5 px-2">#</th>
                      <th className="py-1.5 px-2">ID</th>
                      <th className="py-1.5 px-2">Name</th>
                      <th className="py-1.5 px-2 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 15).map((row, idx) => (
                      <tr key={idx} className="border-b border-[#2a3a4a]/40 text-[#edf2f7]">
                        <td className="py-1.5 px-2 text-[#64748b]">{idx + 1}</td>
                        <td className="py-1.5 px-2 font-mono text-[#f5b342]">
                          {row['Item ID'] || row['id'] || '-'}
                        </td>
                        <td className="py-1.5 px-2 truncate max-w-[200px]">
                          {row['Item Description'] || row['Description'] || row['name'] || 'Unknown'}
                        </td>
                        <td className="py-1.5 px-2 text-right">{row['Quantity'] || row['quantity'] || '1'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedRows.length > 15 && (
                  <p className="text-center text-[11px] text-[#64748b] pt-2">
                    + {parsedRows.length - 15} more items will be imported
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-[#94a3b8] hover:text-white underline"
              >
                Choose another file
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm bg-[#131a24] hover:bg-[#212d3d] text-[#94a3b8]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center gap-1.5 shadow-md shadow-[#22c55e]/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Import {parsedRows.length} Items</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
