declare module '*.css';

interface VsCodeApi {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

/** Injected by VS Code into webviews; may only be called once per page. */
declare function acquireVsCodeApi(): VsCodeApi;
