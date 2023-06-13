import React from 'react';
import Logo from './logo';
import clsx from 'clsx';

export default function Header() {
  const measuredHeader = React.useCallback(
    (node: HTMLHeadElement) => {
      if (node !== null) {
        const height = node.getBoundingClientRect().height;
        document.documentElement.style.setProperty(
          '--header-height',
          `${height}px`
        );
      }
    },
    []
  );

  return (
    <header
      ref={measuredHeader}
      className="flex flex-col mx-auto items-center justify-center text-center gap-2 md:gap-4 md:max-w-lg pb-8 md:pb-16"
    >
      <Logo />
      <div className="hidden md:block">
        <h1>Radio Alhara</h1>
        <h2>MIX Uploader</h2>
      </div>
    </header>
  );
}
