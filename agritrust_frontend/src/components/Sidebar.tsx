// @ts-nocheck
import { useState } from 'react';
// @ts-nocheck
import {
  LayoutDashboard, Users, CreditCard, Map, Settings,
  LogOut, ChevronDown, Sprout, Shield, UserCheck, Briefcase
} from 'lucide-react';

export type Role = 'lender' | 'farmer' | 'admin' | 'agent';

const roles: { key: Role; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'lender', label: 'Lender / MFI', icon: <Briefcase size={14} />, color: '#1a7a4a' },
  { key: 'farmer', label: 'Farmer', icon: <Sprout size={14} />, color: '#0ea5e9' },
  { key: 'admin', label: 'Admin', icon: <Shield size={14} />, color: '#7c3aed' },
  { key: 'agent', label: 'Field Agent', icon: <UserCheck size={14} />, color: '#f59e0b' },
];

const navItems: Record<Role, { label: string; icon: React.ReactNode; id: string }[]> = {
  lender: [
    { label: 'Overview', icon: <LayoutDashboard size={16} />, id: 'overview' },
    { label: 'Applications', icon: <CreditCard size={16} />, id: 'applications' },
    { label: 'Farmer profiles', icon: <Users size={16} />, id: 'farmers' },
    { label: 'Peer pools', icon: <Map size={16} />, id: 'pools' },
  ],
  farmer: [
    { label: 'My trust profile', icon: <LayoutDashboard size={16} />, id: 'profile' },
    { label: 'My loans', icon: <CreditCard size={16} />, id: 'loans' },
    { label: 'My peer pool', icon: <Users size={16} />, id: 'pool' },
    { label: 'Improvement tips', icon: <Sprout size={16} />, id: 'tips' },
  ],
  admin: [
    { label: 'System overview', icon: <LayoutDashboard size={16} />, id: 'overview' },
    { label: 'Farmer registry', icon: <Users size={16} />, id: 'registry' },
    { label: 'Peer pool manager', icon: <Map size={16} />, id: 'pools' },
    { label: 'Settings', icon: <Settings size={16} />, id: 'settings' },
  ],
  agent: [
    { label: 'My assignments', icon: <LayoutDashboard size={16} />, id: 'assignments' },
    { label: 'Onboard farmer', icon: <Users size={16} />, id: 'onboard' },
    { label: 'Log field visit', icon: <Map size={16} />, id: 'visit' },
    { label: 'Recent visits', icon: <UserCheck size={16} />, id: 'visits' },
  ],
};

interface SidebarProps {
  role: Role;
  onRoleChange: (r: Role) => void;
  activePage: string;
  onPageChange: (p: string) => void;
}

export default function Sidebar({ role, onRoleChange, activePage, onPageChange }: SidebarProps) {
  const [rolePicker, setRolePicker] = useState(false);
  const currentRole = roles.find(r => r.key === role)!;

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'var(--green-deep)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--green-bright)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sprout size={18} color="#0a4a2e" />
          </div>
          <div>
            <div style={{ color: 'white', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>AgriTrust</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '0.08em' }}>AI CREDIT PLATFORM</div>
          </div>
        </div>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '12px 12px 8px', position: 'relative' }}>
        <button
          onClick={() => setRolePicker(!rolePicker)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 500,
          }}
        >
          <span style={{
            width: 20, height: 20, borderRadius: 5,
            background: currentRole.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {currentRole.icon}
          </span>
          <span style={{ flex: 1, textAlign: 'left' }}>{currentRole.label}</span>
          <ChevronDown size={12} style={{ opacity: 0.6, transform: rolePicker ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </button>

        {rolePicker && (
          <div style={{
            position: 'absolute', top: '100%', left: 12, right: 12, zIndex: 50,
            background: 'white', borderRadius: 10, overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            border: '1px solid var(--border)',
          }}>
            {roles.map(r => (
              <button
                key={r.key}
                onClick={() => { onRoleChange(r.key); setRolePicker(false); onPageChange(navItems[r.key][0].id); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', border: 'none', cursor: 'pointer',
                  background: r.key === role ? 'var(--surface)' : 'white',
                  color: 'var(--text-primary)', fontSize: 12, fontWeight: r.key === role ? 600 : 400,
                  textAlign: 'left',
                }}
              >
                <span style={{ width: 20, height: 20, borderRadius: 5, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  {r.icon}
                </span>
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', padding: '8px 8px 4px' }}>
          MENU
        </div>
        {navItems[role].map(item => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
              marginBottom: 2,
              background: activePage === item.id ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: activePage === item.id ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 13, fontWeight: activePage === item.id ? 500 : 400,
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ opacity: activePage === item.id ? 1 : 0.7 }}>{item.icon}</span>
            {item.label}
            {activePage === item.id && (
              <span style={{
                marginLeft: 'auto', width: 4, height: 4,
                borderRadius: '50%', background: 'var(--green-bright)',
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--green-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: 'white',
          }}>
            AG
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>AgriTrust AI</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Kenya AI Challenge 2026</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
