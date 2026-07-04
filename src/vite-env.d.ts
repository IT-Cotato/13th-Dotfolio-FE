/// <reference types="vite/client" />

declare module '*.svg' {
  import type { ComponentProps } from 'react';
  const ReactComponent: (props: ComponentProps<'svg'>) => JSX.Element;
  export default ReactComponent;
}
