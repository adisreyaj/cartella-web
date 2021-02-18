import { ModalOperationType } from './general.interface';

export interface TagBase {
  name: string;
  color: string;
  metadata?: Metadata;
  type?: string;
}

export interface Tag extends TagBase {
  id: string;
  ownerId: string;
}

export type TagRequest = TagBase;

export interface Metadata {
  [key: string]: any;
}

export interface TagAddModalPayload {
  tag?: Tag;
  type: ModalOperationType;
}
