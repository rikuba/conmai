declare module 'electron-load-devtool' {
  const module: any;
  export default module;
}

declare module 're-reselect' {
  interface CachedSelector {
    (...args: any[]): any;
    getMatchingSelector(...args: any[]): Function;
    removeMatchingSelector(...args: any[]): Function;
    clearCache(): void;
    resultFunc: Function;
  }

  export default function createCachedSelector(...funcs: Function[]):
    (resolver: Function, createSelectorInstance?: Function) =>
      CachedSelector;
}

declare module 'redux-electron-store' {
  export const electronEnhancer: any;
}

declare module 'xss' {
  const xss: (string: string) => string;
  export default xss;
}

declare module JSX {
  interface IntrinsicElements {
    webview: any;
  }
}
