/// <reference types="vite/client" />

declare module '*.svg' {
  import type { SVGProps, ReactElement } from 'react';
  const ReactComponent: (props: SVGProps<SVGSVGElement>) => ReactElement | null;
  export default ReactComponent;
}
