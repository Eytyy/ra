'use client';

import React, { PropsWithChildren } from 'react';

type Props = {};

type ContextProps = {
  isListOpen: boolean;
  toggleList: (open: boolean) => void;
};
const Context = React.createContext<ContextProps | null>(null);

export function LayoutProvider({
  children,
}: PropsWithChildren<Props>) {
  const [isListOpen, setIsListOpen] = React.useState(false);
  return (
    <Context.Provider
      value={{
        isListOpen,
        toggleList: (open) => setIsListOpen(open),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useLayout() {
  const context = React.useContext(Context);
  if (context === null) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
