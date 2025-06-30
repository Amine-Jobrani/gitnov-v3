import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <Header />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};