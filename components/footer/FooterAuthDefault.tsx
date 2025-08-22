'use client';

export default function Footer() {
  return (
    <div className="z-[3] flex flex-col items-center justify-center mt-auto pb-[30px]">
      <p className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm">
        ©{new Date().getFullYear()} Job Tracker. All Rights Reserved.
      </p>
    </div>
  );
}
