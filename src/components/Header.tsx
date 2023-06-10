import React from 'react';
import Logo from './logo';

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
      className="flex flex-col items-center justify-center text-center gap-2 md:gap-4 fixed max-w-lg top-8 md:top-16 mx-auto left-1/2 -translate-x-1/2"
    >
      <Logo />
      <div className="uppercase md:text-xl">
        <h1>Radio Alhara</h1>
        <h2>MIX Uploader</h2>
      </div>
    </header>
  );
}
