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
      className="flex flex-col items-center justify-center text-center gap-2 md:gap-4 md:fixed md:max-w-lg md:top-16 md:left-1/2 md:mx-auto md:-translate-x-1/2"
    >
      <Logo />
      <div className="hidden md:visible">
        <h1>Radio Alhara</h1>
        <h2>MIX Uploader</h2>
      </div>
    </header>
  );
}
