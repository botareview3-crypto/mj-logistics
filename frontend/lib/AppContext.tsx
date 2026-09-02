'use client';
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import Router from 'next/router';
import { Vehicle, Part, CartItem } from './types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activeVehicle: Vehicle | null;
  setActiveVehicle: (v: Vehicle | null) => void;
  savedVehicles: Vehicle[];
  addSavedVehicle: (v: Vehicle) => void;
  removeSavedVehicle: (id: string) => void;
  updateSavedVehicleNickname: (id: string, nickname: string) => void;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (part: Part, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateCartQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  isSelectorModalOpen: boolean;
  selectorInitialTab: 'vin' | 'cascading';
  openSelectorModal: (tab?: 'vin' | 'cascading') => void;
  closeSelectorModal: () => void;
  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: (open: boolean) => void;
  currentPath: string;
  navigate: (path: string) => void;
  isPartCompatibleWithActiveVehicle: (part: Part) => boolean | null;
  toasts: Toast[];
  toastMessage?: string;
  toastType?: string;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // These start with the same values on server and client. Browser storage is
  // restored after the first render so it can never alter the hydration tree.
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicleState] = useState<Vehicle | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);
  const [selectorInitialTab, setSelectorInitialTab] = useState<'vin' | 'cascading'>('vin');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const garage = localStorage.getItem('autoparts_garage');
      const vehicle = localStorage.getItem('autoparts_active_vehicle');
      const savedCart = localStorage.getItem('autoparts_cart');
      if (garage) setSavedVehicles(JSON.parse(garage));
      if (vehicle) setActiveVehicleState(JSON.parse(vehicle));
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch {
      // Ignore corrupt or legacy browser storage and continue with an empty session.
    } finally {
      setHasLoadedStorage(true);
    }
  }, []);

  // Keep app chrome in sync with real Next.js route transitions.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    }
    const onRouteChange = (url: string) => setCurrentPath(url);
    Router.events.on('routeChangeComplete', onRouteChange);
    return () => Router.events.off('routeChangeComplete', onRouteChange);
  }, []);

  const setActiveVehicle = useCallback((v: Vehicle | null) => {
    setActiveVehicleState(v);
    try {
      if (v) localStorage.setItem('autoparts_active_vehicle', JSON.stringify(v));
      else localStorage.removeItem('autoparts_active_vehicle');
    } catch { /* ignore */ }
  }, []);

  const addSavedVehicle = useCallback((v: Vehicle) => {
    setSavedVehicles(prev => {
      const filtered = prev.filter(item => item.id !== v.id && item.vin !== v.vin);
      const updated = [v, ...filtered];
      try { localStorage.setItem('autoparts_garage', JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
    setActiveVehicle(v);
  }, [setActiveVehicle]);

  const removeSavedVehicle = useCallback((id: string) => {
    setSavedVehicles(prev => {
      const updated = prev.filter(v => v.id !== id);
      try { localStorage.setItem('autoparts_garage', JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
    setActiveVehicleState(prev => prev?.id === id ? null : prev);
  }, []);

  const updateSavedVehicleNickname = useCallback((id: string, nickname: string) => {
    setSavedVehicles(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, nickname } : v);
      try { localStorage.setItem('autoparts_garage', JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    try { localStorage.setItem('autoparts_cart', JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart, hasLoadedStorage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== path) {
      void Router.push(path);
    }
    setCurrentPath(path);
    setIsMegaMenuOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToCart = useCallback((part: Part, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.part.id === part.id);
      if (existing) {
        return prev.map(item => item.part.id === part.id
          ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { part, quantity, addedForVehicle: activeVehicle }];
    });
    showToast(`Added ${quantity}x "${part.name}" to cart!`, 'success');
  }, [activeVehicle, showToast]);

  const removeFromCart = useCallback((partId: string) => {
    setCart(prev => prev.filter(item => item.part.id !== partId));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const updateCartQuantity = useCallback((partId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(partId); return; }
    setCart(prev => prev.map(item => item.part.id === partId ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const openSelectorModal = useCallback((tab: 'vin' | 'cascading' = 'vin') => {
    setSelectorInitialTab(tab);
    setIsSelectorModalOpen(true);
  }, []);

  const closeSelectorModal = useCallback(() => setIsSelectorModalOpen(false), []);

  const isPartCompatibleWithActiveVehicle = useCallback((part: Part): boolean | null => {
    if (!activeVehicle) return null;
    if (activeVehicle.id && part.compatibleEngineIds.includes(activeVehicle.id)) return true;
    const makeMatch = part.fitsVehicles.some(f => {
      if (f.make === 'All Vehicles') return true;
      if (f.make.toLowerCase() === activeVehicle.make.toLowerCase()) {
        if (f.model === 'All Models' || f.model.toLowerCase() === activeVehicle.model.toLowerCase()) return true;
      }
      return false;
    });
    return makeMatch;
  }, [activeVehicle]);

  const cartCount = useMemo(() => cart.reduce((t, i) => t + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((t, i) => t + i.part.price * i.quantity, 0), [cart]);

  const latestToast = toasts[toasts.length - 1];

  return (
    <AppContext.Provider value={{
      activeVehicle, setActiveVehicle,
      savedVehicles, addSavedVehicle, removeSavedVehicle, updateSavedVehicleNickname,
      cart, cartCount, cartSubtotal, addToCart, removeFromCart, updateCartQuantity, clearCart,
      isSelectorModalOpen, selectorInitialTab, openSelectorModal, closeSelectorModal,
      isMegaMenuOpen, setIsMegaMenuOpen,
      currentPath, navigate,
      isPartCompatibleWithActiveVehicle,
      toasts,
      toastMessage: latestToast?.message,
      toastType: latestToast?.type,
      showToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
