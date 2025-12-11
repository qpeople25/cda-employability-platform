'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, Users, Settings, BarChart3, UserCog, Link as LinkIcon, Home } from 'lucide-react';

interface PremiumHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export function PremiumHeader({ user }: PremiumHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
  
  const isAdmin = user.role === 'admin';
  
  const navigationItems = isAdmin ? [
    { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { label: 'Participants', href: '/participants', icon: Users },
    { label: 'Coaches', href: '/admin/coaches', icon: UserCog },
    { label: 'Assignments', href: '/admin/assignments', icon: LinkIcon },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ] : [
    { label: 'Dashboard', href: '/coach/dashboard', icon: Home },
    { label: 'My Participants', href: '/participants', icon: Users },
  ];
  
  return (
    <header className="bg-gradient-to-r from-[#0A4D68] via-[#1565A6] to-[#0A4D68] text-white shadow-2xl border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href={isAdmin ? '/admin/dashboard' : '/coach/dashboard'} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F0D97D] rounded-xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-7 h-7 text-[#0A4D68]" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CDA Platform</h1>
                <p className="text-xs text-white/80">Employability Assessment System</p>
              </div>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`text-white hover:bg-white/10 transition-all duration-300 ${
                        isActive ? 'bg-white/20 font-semibold' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="font-semibold">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-white/80 capitalize">{user.role}</div>
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F0D97D] rounded-full flex items-center justify-center font-bold text-[#0A4D68] shadow-lg">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
