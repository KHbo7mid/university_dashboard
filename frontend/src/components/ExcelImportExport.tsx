// components/ExcelImportExport.tsx
import React from 'react';
import * as XLSX from 'xlsx';
import { Download, Upload } from 'lucide-react';

interface ExcelImportExportProps {
  data: any[];
  templateFileName: string;
  onImport: (data: any[]) => void;
  columns: {
    header: string;
    key: string;
    type?: 'string' | 'number' | 'date';
  }[];
}

export default function ExcelImportExport({ 
  data, 
  templateFileName, 
  onImport, 
  columns 
}: ExcelImportExportProps) {
  const exportTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{}]);
    XLSX.utils.sheet_add_aoa(ws, [columns.map(col => col.header)], { origin: 'A1' });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${templateFileName}_template.xlsx`);
  };

  const exportData = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${templateFileName}_data.xlsx`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      // Validation basique des données
      const validatedData = jsonData.map((item: any) => {
        const newItem: any = {};
        columns.forEach(col => {
          if (col.type === 'number') {
            newItem[col.key] = Number(item[col.header]) || 0;
          } else {
            newItem[col.key] = item[col.header] || '';
          }
        });
        return newItem;
      });
      
      onImport(validatedData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={exportTemplate}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger le modèle
      </button>
      
      <button
        onClick={exportData}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
      >
        <Download className="h-4 w-4 mr-2" />
        Exporter les données
      </button>
      
      <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center cursor-pointer">
        <Upload className="h-4 w-4 mr-2" />
        Importer des données
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleImport} 
          className="hidden" 
        />
      </label>
    </div>
  );
}