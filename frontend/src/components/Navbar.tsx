'use client';

import Link from 'next/link';
import Logo from './ui/logo';
import Container from './ui/container';
import NotificationIcon from './ui/notificaions';

const Navbar = () => {
  const isLoggedIn = false; // Replace with real auth check later

  return (
    <header className="w-full bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <Container className="mx-auto max-w-[1200px] px-4 md:px-8 flex items-center justify-between h-16">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* CENTER: Nav links */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-[13px] font-medium cursor-pointer hover:bg-gray-900 text-gray-400 hover:text-gray-50 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                Dashboard
              </Link>
              <Link href="/create" className="text-[13px] font-medium cursor-pointer hover:bg-gray-900 text-gray-400 hover:text-gray-50 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                Create Plan
              </Link>
              <Link href="/history" className="text-[13px] font-medium cursor-pointer hover:bg-gray-900 text-gray-400 hover:text-gray-50 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                SkillPlans
              </Link>
              <Link href="/notifications" className="text-[13px] font-medium cursor-pointer hover:bg-gray-900 text-gray-400 hover:text-gray-50 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                History
              </Link>
            </>
          ) : (
            <>
              <Link href="/about" className="text-[13px] font-medium cursor-pointer hover:bg-gray-900 text-gray-400 hover:text-gray-50 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                About
              </Link>
              <Link href="/features" className="text-[13px] font-medium cursor-pointer hover:bg-gray-900 text-gray-400 hover:text-gray-50 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                Features
              </Link>
              <Link href="/contact" className="text-[13px] font-medium cursor-pointer hover:bg-gray-900 text-gray-400 hover:text-gray-50 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                Contact
              </Link>
            </>
          )}
        </div>

        {/* RIGHT: Auth buttons or Profile */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className='text-[13px] font-medium cursor-pointer hover:bg-gray-800 text-gray-250 transition-all px-[9px] py-[6px] rounded-lg hover:text-white'>
                Log in
              </Link>
              <Link href="/signup" className='bg-gray-100 cursor-pointer hover:bg-white transition-all  text-black text-[13px] py-[6px] px-[9px] font-medium rounded-lg'>
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <img src="" alt='Profile' className='rounded-full cursor-pointer' width={25} height={25} />
              </Link>
              <Link href="/notifications" className='flex items-center'>
                <NotificationIcon onClick={() => alert("notifications")} />
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
