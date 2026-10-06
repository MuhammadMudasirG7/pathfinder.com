"use client";
import { BarChart3, Layers, Briefcase, Building2, Calendar, Contact, Folder, LayoutDashboard, LogOut, Mail, Settings, Users, ChevronUp, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "./hooks/SidebarContext";

export default function SidebarDrawer() {
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const pathName = usePathname();

   
    const mainMenuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Candidates', href: '/candidates', icon: Users },
        { name: 'Jobs', href: '/jobs', icon: Briefcase },
        { name: 'Companies', href: '/companies', icon: Building2 },
        { name: 'Contacts', href: '/contacts', icon: Contact },
        { name: 'Mail', href: '/mail', icon: Mail },
        { name: 'Folders', href: '/folders', icon: Folder },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'Activities', href: '/activities', icon: Calendar },
    ];

  
    const bottomMenuItems = [
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Logout', href: '/logout', icon: LogOut },
    ];

    return (
        <aside className={`p-1 h-screen bg-[#F5F6F7] flex flex-col justify-between select-none transition-all duration-300 ${isCollapsed ? "w-20" : "w-50"}`}>
            <div>
                {/* Logo Section */}
                <div className={`flex items-center px-4 py-5 ${isCollapsed ? "justify-center flex-col gap-3" : "justify-between"}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#6332c5] text-white flex justify-center rounded-xl items-center shadow-sm shrink-0">
                            <Layers className="w-5 h-5" />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <p className="font-bold text-gray-900 text-[16px] leading-none tracking-tight">pathfinder</p>
                                <p className="font-semibold text-gray-400 tracking-[0.25em] text-[9px] mt-1">A T S • C R M</p>
                            </div>
                        )}
                    </div>
                </div>

                
                <nav className="px-3 space-y-3.5 mt-4">
                    {mainMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathName === item.href;
                        return (
                            <Link 
                                className={`group flex items-center gap-3.5 px-3 py-1 rounded transition-colors ${
                                    isActive 
                                        ? "bg-[#64748b] text-white shadow-sm" 
                                        : "hover:bg-[#64748b] text-slate-300"
                                } ${isCollapsed ? "justify-center" : ""}`} 
                                key={item.name} 
                                href={item.href}
                            >
                                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#787c88] group-hover:text-white'}`} />
                                {!isCollapsed && (
                                    <span className={`text-[13px] font-medium tracking-wide transition-colors ${isActive ? "text-white" : "text-[#5C657C] group-hover:text-white"}`}>
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                
                <nav className="px-3 space-y-4 mt-8 pt-4">
                    {bottomMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathName === item.href;
                        return (
                            <Link 
                                className={`group flex items-center gap-3.5 px-3 py-1 rounded transition-colors ${
                                    isActive 
                                        ? "bg-[#64748b] text-white shadow-sm" 
                                        : "hover:bg-[#64748b] text-slate-300"
                                } ${isCollapsed ? "justify-center" : ""}`} 
                                key={item.name} 
                                href={item.href}
                            >
                                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#787c88] group-hover:text-white'}`} />
                                {!isCollapsed && (
                                    <span className={`text-[13px] font-medium tracking-wide transition-colors ${isActive ? "text-white" : "text-[#5C657C] group-hover:text-white"}`}>
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Profile Footer Section */}
            <div className={`p-1 ml-1.5 border-t border-gray-200 ${isCollapsed ? "flex justify-center" : ""}`}>
                {isCollapsed ? (
                    <div className="h-9 w-9 rounded-full bg-[#64748b] text-white font-bold flex items-center justify-center shadow-sm" title="John Doe">
                        <span className="text-xs">JD</span>
                    </div>
                ) : (
                    <div className="flex items-center p-0.5 justify-between bg-[#64748b] text-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-white/20 text-white font-semibold flex items-center justify-center text-xs shrink-0">
                                <span>JD</span>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="font-semibold text-[13px] text-white">John Doe</span> 
                                <span className="text-[11px] text-slate-200 mt-0.5">Acme Corporation</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-slate-200 pr-1">
                            <ChevronUp className="w-3.5 h-3.5 -mb-1" />
                            <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}