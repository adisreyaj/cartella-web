export interface BundleReport {
  assets: Asset[];
  dependencyCount: number;
  dependencySizes: DependencySize[];
  description: string;
  gzip: number;
  hasJSModule: boolean;
  hasJSNext: boolean;
  hasSideEffects: boolean;
  name: string;
  repository: string;
  scoped: boolean;
  size: number;
  version: string;
}

export interface Asset {
  gzip: number;
  name: string;
  size: number;
  type: string;
}

export interface DependencySize {
  approximateSize: number;
  name: string;
}

export interface PackageBundleMetaData {
  size: {
    gzipped: number;
    minified: number;
  };
}
