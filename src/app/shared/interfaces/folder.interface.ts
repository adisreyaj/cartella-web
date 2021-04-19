import { SharedWith } from '@app/interfaces/share.interface';
import { Observable } from 'rxjs';
import { PayloadResponse } from './response.interface';
import { User } from './user.interface';

export interface FolderBaseRequest {
  name: string;
  metadata: any | null;
  private: boolean;
}

export interface FolderBaseResponse extends FolderBaseRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  share: SharedWith[];
}

export interface FolderOperations<FolderRequestType, FolderResponseType> {
  createNewFolder(data: FolderRequestType): Observable<FolderResponseType>;
  updateFolder(
    id: string,
    data: Partial<FolderRequestType>
  ): Observable<FolderResponseType>;
  deleteFolder(id: string): Observable<any>;
  getFolders(user: User): Observable<PayloadResponse<FolderResponseType>>;
}
