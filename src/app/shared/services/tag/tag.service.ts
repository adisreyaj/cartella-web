import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@app/config/endpoints.config';
import { environment } from '@app/env/environment';
import { PayloadResponse } from '@app/interfaces/response.interface';
import { Tag, TagRequest } from '@app/interfaces/tag.interface';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  apiUrl = `${environment.api}/${CARTELLA_ENDPOINTS.tags}`;
  constructor(private http: HttpClient) {}

  getCustomTags() {
    return this.http.get<PayloadResponse<Tag>>(`${this.apiUrl}/custom`);
  }

  createNewTag(tag: TagRequest) {
    return this.http.post<Tag>(this.apiUrl, tag);
  }

  updateTag(id: string, data: Partial<TagRequest>) {
    return this.http.put<Tag>(`${this.apiUrl}/${id}`, data);
  }

  deleteTag(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
