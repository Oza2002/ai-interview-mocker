"use client"
import { UserButton } from '@clerk/nextjs'
import React, { useEffect} from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

function Header() {

    const path = usePathname();
    useEffect(()=>{
       console.log(path)
    },{})

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={160} height={100} />
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard'&&'text-purple-500 font-bold'}
    `} >Dashboard</li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/qus'&&'text-purple-500 font-bold'}
    `}>Questions</li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/how'&&'text-purple-500 font-bold'}
    `}>How it Works</li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/up'&&'text-purple-500 font-bold'}
    `}>Upgrade</li>
      </ul>
      <UserButton/>
    </div>
  );
}

export default Header;
