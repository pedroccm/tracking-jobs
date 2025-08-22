'use client';

/*eslint-disable*/

export default function Footer() {
  return (
    <div className="flex w-full flex-col items-center justify-center px-1 pb-8 pt-3">
      <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
        ©{new Date().getFullYear()} Job Tracker. All Rights Reserved.
      </p>
    </div>
  );
}
