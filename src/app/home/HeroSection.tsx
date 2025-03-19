"use client";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-gray-200 to-transparent rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-gray-100 to-transparent rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="h-full w-full" style={{ 
          backgroundImage: 'radial-gradient(circle, #f0f0f0 1px, transparent 1px)',
          backgroundSize: '30px 30px' 
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <div className="w-full md:w-1/2 space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200/50 text-gray-800 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
              New: CodeGuard Released
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-gray-900">Fortify</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">your codebase.</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg">
              Automated security scanning that helps development teams identify vulnerabilities before they reach production.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-all group"
              >
                Start scanning
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/#"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg border border-gray-700 hover:bg-gray-700 transition-all"
              >
                Watch demo
              </Link>
            </div>
            
            <div className="pt-4 border-t border-gray-300">
              <p className="text-gray-500 text-sm">Trusted by leading engineering teams</p>
              <div className="mt-4 flex items-center space-x-8">
                {["Clockhash"].map((company) => (
                  <span key={company} className="text-gray-400 font-medium">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Content - Code Card */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <div className="mx-auto text-xs text-gray-500 font-mono">
                  security-scan.log
                </div>
              </div>
              <div className="p-5 font-mono text-sm text-gray-900 space-y-2">
                <p className="flex items-center text-green-500">
                  <Shield className="mr-2 w-4 h-4" /> Scan initialized for repository: frontend-app
                </p>
                <p className="text-gray-600">Analyzing dependencies...</p>
                <p className="text-gray-600">Checking for vulnerabilities...</p>
                <p className="text-yellow-500">Warning: Outdated npm package detected (CVE-2023-44487)</p>
                <p className="text-red-500">Critical: Potential SQL injection in auth/login.js</p>
                <p className="text-gray-600">Generating detailed report...</p>
                <p className="text-gray-900">Scan complete. 2 issues found (1 critical, 1 warning)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
