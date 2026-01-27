import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const displayEmail = user?.email || 'User';
  const shortEmail = displayEmail.length > 20
    ? displayEmail.substring(0, 17) + '...'
    : displayEmail;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-b from-stone-700 to-stone-800 hover:from-stone-600 hover:to-stone-700 text-amber-200 px-3 py-2 rounded border-2 border-amber-900 shadow-lg font-semibold text-sm"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{shortEmail}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl border-2 border-amber-900 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-amber-900">
            <p className="text-amber-200 text-xs font-semibold">Signed in as</p>
            <p className="text-amber-100 text-sm font-bold truncate">{displayEmail}</p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-amber-200 hover:bg-stone-700 hover:text-amber-100 font-semibold text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
