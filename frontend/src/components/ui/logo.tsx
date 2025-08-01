"use client";

import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/assets/logo.jpg"
        alt="SkillSprint Logo"
        width={30}
        height={30}
        className='rounded-full cursor-pointer'
      />
      <span className="text-[16px] font-bold text-white">SkillSprint</span>
    </Link>
  );
};

export default Logo;
