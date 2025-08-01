'use client'
import Link from 'next/link';
import Button from './ui/button';
import Logo from './ui/logo';
import Container from './ui/container';


const Navbar = () => {
  const isLoggedIn = false; // Replace with real auth check later

  return (
    <header className="border-b bg-black">
      <Container className="flex items-center justify-between h-16">
        <Logo />

        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-[13px] font-medium cursor-pointer hover:bg-gray-700 text-gray-250 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                Dashboard
              </Link>
              <Link href="/create" className="text-[13px] font-medium cursor-pointer hover:bg-gray-700 text-gray-250 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                Create Plan
              </Link>
              <Link href="/history" className="text-[13px] font-medium cursor-pointer hover:bg-gray-700 text-gray-250 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                SkillPlans
              </Link>
              <Link href="/notifications" className="text-[13px] font-medium cursor-pointer hover:bg-gray-700 text-gray-250 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                History
              </Link>
            </>
          ) : (
            <>
                <Link href="/about" className="text-[13px] font-medium cursor-pointer hover:bg-gray-700 text-gray-250 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                    About
                </Link>
                <Link href="/features" className="text-[13px] font-medium cursor-pointer hover:bg-gray-700 text-gray-250 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                    Features
                </Link>
                <Link href="/contact" className="text-[13px] font-medium cursor-pointer hover:bg-gray-700 text-gray-250 transition-all px-[7px] py-[5px] bg-black rounded-lg">
                    Contact
                </Link>
            </>
          )}
          {!isLoggedIn ? (
            <>
                <Button onClick={() => alert("Login")} variant='primary'>
                    Log in
                </Button>

                <Button onClick={() => alert("Sign up")} variant='primary'>
                    Sign up
                </Button>

            </>
          ) : (
            <>
              {/* In the future: user avatar or dropdown */}
              <Link href="/profile">
                <img src="" alt='Profile' />
              </Link>
              <Link href="/notifications">
                Notifications
              </Link>
            </>
          )}
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
