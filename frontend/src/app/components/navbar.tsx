'use client';

import React from 'react';
import Link from 'next/link';
import { API_HOST, fetchFromApi } from '@/src/api/utils';

interface NavbarProps {
    onLogin?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {

    return (
        <header className="w-full bg-white border-b shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href="/" className="text-lg font-semibold tracking-tight">
                    Monetary Penalty System
                </Link>
                <ul className="flex items-center gap-6">
                    <li>
                        <Link href="/cases" className="text-sm hover:text-blue-600">
                            Cases
                        </Link>
                    </li>
                    <li>
                        <Link href="/reports" className="text-sm hover:text-blue-600">
                            Reports
                        </Link>
                    </li>
                    <li>
                        <a href={`${API_HOST}/login`} className="text-sm hover:text-blue-600">
                            Login
                        </a>
                    </li>
                    <li>
                        <a href={`${API_HOST}/logout`} className="text-sm hover:text-blue-600">
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;