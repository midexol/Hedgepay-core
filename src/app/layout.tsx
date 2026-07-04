import './globals.css';
import React from 'react';

export const metadata = {
  title: 'HedgePay // Borderless B2B Batch Payroll on Stellar',
  description: 'Gas-optimized batch payroll and sub-ledger ERP accounting on Stellar Soroban network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
