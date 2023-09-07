'use client';
import { store } from '@/stores/store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

const ReduxQueryProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxQueryProvider;
