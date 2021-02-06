export interface Tag {
  id: string;
  name: string;
  color: string;
  metadata: Metadata;
  type: string;
  ownerId: string;
}

export interface Metadata {}
