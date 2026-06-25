import { useState } from 'react';
import Sidebar, { type Role } from './components/Sidebar';

import { LenderOverview, LenderApplications, LenderFarmers, LenderPools } from './pages/LenderDashboard';
import { FarmerProfile, FarmerLoans, FarmerPool, FarmerTips } from './pages/FarmerDashboard';
import { AdminOverview, AdminRegistry, AdminPools, AdminSettings } from './pages/AdminDashboard';
import { AgentAssignments, AgentOnboard, AgentVisitLog, AgentVisits } from './pages/AgentDashboard';

type PageMap = Record<string, React.ReactNode>;

export default function App() {
  const [role, setRole] = useState<Role>('lender');
  const [page, setPage] = useState('overview');

  const pages: Record<Role, PageMap> = {
    lender: {
      overview: <LenderOverview />,
      applications: <LenderApplications />,
      farmers: <LenderFarmers />,
      pools: <LenderPools />,
    },
    farmer: {
      profile: <FarmerProfile />,
      loans: <FarmerLoans />,
      pool: <FarmerPool />,
      tips: <FarmerTips />,
    },
    admin: {
      overview: <AdminOverview />,
      registry: <AdminRegistry />,
      pools: <AdminPools />,
      settings: <AdminSettings />,
    },
    agent: {
      assignments: <AgentAssignments />,
      onboard: <AgentOnboard />,
      visit: <AgentVisitLog />,
      visits: <AgentVisits />,
    },
  };

  function handleRoleChange(r: Role) {
    setRole(r);
    const defaults: Record<Role, string> = {
      lender: 'overview', farmer: 'profile', admin: 'overview', agent: 'assignments',
    };
    setPage(defaults[r]);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>
      <Sidebar role={role} onRoleChange={handleRoleChange} activePage={page} onPageChange={setPage} />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxHeight: '100vh' }}>
        {pages[role][page] ?? <div style={{ padding: 40, color: 'var(--text-muted)' }}>Page not found.</div>}
      </main>
    </div>
  );
}
