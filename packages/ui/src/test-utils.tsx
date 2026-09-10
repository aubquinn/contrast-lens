import type { ReactElement, ReactNode } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';

const ChakraTestProvider = ({ children }: { children: ReactNode }) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

export const render = (ui: ReactElement, options?: RenderOptions): RenderResult =>
    rtlRender(ui, { wrapper: ChakraTestProvider, ...options });
