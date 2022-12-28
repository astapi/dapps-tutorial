
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container px-4 mx-auto">
      <main className="pt-4">{children}</main>
    </div>
  );
}