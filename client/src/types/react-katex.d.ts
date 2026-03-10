declare module 'react-katex' {
  import * as React from 'react';
  
  interface KatexProps {
    children?: string;
    math?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: any) => React.ReactNode;
    settings?: any;
  }
  
  export const InlineMath: React.FC<KatexProps>;
  export const BlockMath: React.FC<KatexProps>;
}