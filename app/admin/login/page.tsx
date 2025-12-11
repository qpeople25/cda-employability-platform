'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/coach/dashboard');
        }
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4D68] via-[#1565A6] to-[#0A4D68] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-start text-white space-y-8 px-12">
          {/* CDA Logo Placeholder - Replace with actual logo */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F0D97D] rounded-xl flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-[#0A4D68]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">CDA</h1>
                <p className="text-sm text-white/80">Community Development Authority</p>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6"></div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Employability Assessment Platform
            </h2>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              A comprehensive coaching and assessment system designed to empower Emirati job seekers through evidence-based interventions and personalized support.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Multi-Coach Management</h3>
                  <p className="text-sm text-white/80">Assign and manage multiple coaches with role-based access control</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">8-Domain Assessment</h3>
                  <p className="text-sm text-white/80">Comprehensive evaluation across all employability dimensions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Complete Audit Trail</h3>
                  <p className="text-sm text-white/80">Track all changes with full accountability and transparency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-10 backdrop-blur-xl border border-white/20">
            {/* Logo for Mobile */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0A4D68] to-[#1565A6] rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0A4D68]">CDA</h1>
                <p className="text-xs text-gray-600">Community Development Authority</p>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@cda.ae"
                  required
                  autoFocus
                  autoComplete="email"
                  className="h-12 text-base border-gray-300 focus:border-[#0A4D68] focus:ring-[#0A4D68]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-12 text-base border-gray-300 focus:border-[#0A4D68] focus:ring-[#0A4D68]"
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-red-600"></div>
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-[#0A4D68] to-[#1565A6] hover:from-[#053042] hover:to-[#0A4D68] shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ChevronRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 text-center mb-2 font-medium">
                  Default Admin Credentials
                </p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <code className="bg-white px-3 py-1.5 rounded-lg text-[#0A4D68] font-mono border border-gray-200 shadow-sm">
                    admin@cda.ae
                  </code>
                  <span className="text-gray-400">/</span>
                  <code className="bg-white px-3 py-1.5 rounded-lg text-[#0A4D68] font-mono border border-gray-200 shadow-sm">
                    admin123
                  </code>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-white/80 text-sm mt-6">
            © 2024 Community Development Authority. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
