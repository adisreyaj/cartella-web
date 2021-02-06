export interface TagBase {
  name: string;
  color: string;
  metadata: Metadata;
  type: string;
}

export interface Tag extends TagBase {
  id: string;
  ownerId: string;
}

export interface TagRequest extends TagBase {}

export interface Metadata {}
