export interface PackageSuggestions {
  name: string;
  description: string;
}

export interface PackageDetails {
  analyzedAt: string;
  collected: Collected;
  evaluation: Evaluation;
  score: packageScore;
}

export interface Collected {
  metadata: Metadata;
  npm: Npm;
  github: Github;
  source: Source;
}

export interface Github {
  homepage: string;
  starsCount: number;
  forksCount: number;
  subscribersCount: number;
  issues: Issues;
  contributors: GithubContributor[];
  commits: Commit[];
}

export interface Commit {
  from: string;
  to: string;
  count: number;
}

export interface GithubContributor {
  username: string;
  commitsCount: number;
}

export interface Issues {
  count: number;
  openCount: number;
  distribution: { [key: string]: number };
  isDisabled: boolean;
}

export interface Metadata {
  name: string;
  scope: string;
  version: string;
  description: string;
  date: string;
  publisher: Publisher;
  maintainers: Publisher[];
  contributors: MetadataContributor[];
  repository: Repository;
  links: PackageLinks;
  license: string;
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
  peerDependencies: PeerDependencies;
  releases: Commit[];
  hasTestScript: boolean;
  hasSelectiveFiles: boolean;
  readme: string;
}

export interface MetadataContributor {
  name: string;
  email: string;
}

export interface PackageLinks {
  npm: string;
  homepage: string;
  repository: string;
  bugs: string;
}

export interface Publisher {
  username: string;
  email: string;
}

export interface PeerDependencies {
  [key: string]: string;
}

export interface Repository {
  type: string;
  url: string;
}

export interface Npm {
  downloads: Commit[];
  dependentsCount: number;
  starsCount: number;
}

export interface Source {
  files: Files;
  badges: Badge[];
  linters: string[];
  coverage: number;
  outdatedDependencies: OutdatedDependencies;
}

export interface Badge {
  urls: Urls;
  info: Info;
}

export interface Info {
  service: string;
  type: string;
  modifiers: Modifiers;
}

export interface Modifiers {
  branch?: string;
  type?: string;
}

export interface Urls {
  original: string;
  service?: string;
  shields: string;
  content: string;
}

export interface Files {
  readmeSize: number;
  testsSize: number;
  hasChangelog: boolean;
}

export interface OutdatedDependencies {
  [key: string]: string;
}

export interface Evaluation {
  quality: PackageQuality;
  popularity: PackagePopularity;
  maintenance: Maintenance;
}

export interface Maintenance {
  releasesFrequency: number;
  commitsFrequency: number;
  openIssues: number;
  issuesDistribution: number;
}

export interface PackagePopularity {
  communityInterest: number;
  downloadsCount: number;
  downloadsAcceleration: number;
  dependentsCount: number;
}

export interface PackageQuality {
  carefulness: number;
  tests: number;
  health: number;
  branding: number;
}

export interface packageScore {
  final: number;
  detail: PackageScoreDetail;
}

export interface PackageScoreDetail {
  quality: number;
  popularity: number;
  maintenance: number;
}
