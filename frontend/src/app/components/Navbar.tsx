'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './ui/logo';
import Container from './ui/container';
import { useAuth } from '@/store/auth';
import { logout } from '../utils/logout';
import { 
  User, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Gem,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import NotificationDrawer from '@/app/(protected)/dashboard/notifications';
import SettingsDrawer from '@/app/(protected)/dashboard/settings';

const Navbar = () => {
  const { isAuthenticated, user} = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
        <Container className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* LEFT: Logo */}
          <div className="flex items-center">
              <Logo />
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link href="/skills">
                    <Gem className="h-4 w-4" />
                    Skills
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link href="/skillPlans">
                    <BookOpen className="h-4 w-4" />
                    Skill Plans
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link href="/skills/new">
                    <PlusCircle className="h-4 w-4" />
                    New Skill
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/about">About</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/about">Features</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/about">Contact</Link>
                </Button>
              </>
            )}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <>
                {/* Notifications */}
                <NotificationDrawer 
                  open={notificationsOpen} 
                  onOpenChange={setNotificationsOpen} 
                />

                {/* Settings */}
                <SettingsDrawer 
                  open={settingsOpen} 
                  onOpenChange={setSettingsOpen} 
                />

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePic} />
                        <AvatarFallback>
                          {user?.fullname?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">{user?.fullname}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    {isAuthenticated ? 'Manage your learning journey' : 'Explore our platform'}
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {isAuthenticated ? (
                    <>
                      <Button asChild variant="ghost" className="justify-start gap-3">
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="justify-start gap-3">
                        <Link href="/skills" onClick={() => setMobileMenuOpen(false)}>
                          <Gem className="h-5 w-5" />
                          Skills
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="justify-start gap-3">
                        <Link href="/skill-plans" onClick={() => setMobileMenuOpen(false)}>
                          <BookOpen className="h-5 w-5" />
                          Skill Plans
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="justify-start gap-3">
                        <Link href="/skills/new" onClick={() => setMobileMenuOpen(false)}>
                          <PlusCircle className="h-5 w-5" />
                          New Skill
                        </Link>
                      </Button>
                      <Separator />
                      <Button asChild variant="ghost" className="justify-start gap-3">
                        <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost" className="justify-start">
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                          About
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="justify-start">
                        <Link href="/features" onClick={() => setMobileMenuOpen(false)}>
                          Features
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="justify-start">
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                          Contact
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </>
  );
};

export default Navbar;