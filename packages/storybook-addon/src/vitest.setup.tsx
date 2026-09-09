import '@testing-library/jest-dom/vitest';
import type { ReactElement, ReactNode } from 'react';
import { afterEach } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { cleanup, render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';

afterEach(() => {
    cleanup();
});

const ChakraTestProvider = ({ children }: { children: ReactNode }) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

export const render = (ui: ReactElement, options?: RenderOptions): RenderResult =>
    rtlRender(ui, { wrapper: ChakraTestProvider, ...options });
