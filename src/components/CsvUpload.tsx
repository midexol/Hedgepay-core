'use client';

import React, { useState, useRef } from 'react';

export interface PayeeRecord {
  walletAddress: string;
  corridor: string;
  amount: number;
  department: string;
}

interface CsvUploadProps {
  onParsed: (records: PayeeRecord[]) => void;
  onError: (message: string) => void;
}

export default function CsvUpload({ onParsed, onError }: CsvUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const parseCsv = (text: string) => {
    const lines = text.split('\n');
    if (lines.length <= 1) {
      onError("CSV is empty or missing headers");
      return;
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const addressIdx = headers.indexOf('wallet_address');
    const corridorIdx = headers.indexOf('corridor');
    const amountIdx = headers.indexOf('amount_usdc');
    const deptIdx = headers.indexOf('department');

    if (addressIdx === -1 || corridorIdx === -1 || amountIdx === -1 || deptIdx === -1) {
      onError("Invalid CSV columns. Required: wallet_address, corridor, amount_usdc, department");
      return;
    }

    const records: PayeeRecord[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map(c => c.trim());
      if (cols.length < headers.length) {
        errors.push(`Row ${i + 1}: incomplete data columns`);
        continue;
      }

      const walletAddress = cols[addressIdx];
      const corridor = cols[corridorIdx];
      const amountRaw = cols[amountIdx];
      const department = cols[deptIdx];

      // Stellar address, email, or Federation ID validation
      const addressRegex = /^G[A-Z2-7]{55}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const fedRegex = /^[a-zA-Z0-9._%+-]+\*[\w.-]+$/;

      if (!addressRegex.test(walletAddress) && !emailRegex.test(walletAddress) && !fedRegex.test(walletAddress)) {
        errors.push(`Row ${i + 1}: Invalid address or identifier "${walletAddress}"`);
        continue;
      }

      // Corridor check
      const validCorridors = ['gcash', 'ovo', 'local-vn'];
      if (!validCorridors.includes(corridor.toLowerCase())) {
        errors.push(`Row ${i + 1}: Unsupported corridor "${corridor}". Use GCash, OVO, or local-vn.`);
        continue;
      }

      // Amount check
      const amount = parseFloat(amountRaw);
      if (isNaN(amount) || amount <= 0) {
        errors.push(`Row ${i + 1}: Amount must be a positive number`);
        continue;
      }

      records.push({
        walletAddress,
        corridor: corridor.toLowerCase(),
        amount,
        department
      });
    }

    if (errors.length > 0) {
      onError(errors.join('; '));
    } else if (records.length === 0) {
      onError("No valid records found in CSV");
    } else {
      onParsed(records);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      onError("Please upload a valid CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        parseCsv(e.target.result as string);
      }
    };
    reader.onerror = () => {
      onError("Error reading CSV file");
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className={`dropzone ${isDragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleChange}
        accept=".csv"
        style={{ display: 'none' }}
      />
      <div className="dropzone-icon">📤</div>
      <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>Upload CSV File</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Drag and drop your spreadsheet here or click to browse files
      </p>
    </div>
  );
}
