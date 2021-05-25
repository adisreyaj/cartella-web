import { Injectable } from '@angular/core';
import { Technology } from '@cartella/interfaces/technology.interface';
import { TechnologyService } from '@cartella/services/technology/technology.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { GetTechnologies } from '../actions/technology.action';

export class TechnologyStateModel {
  technologies: Technology[] = [];
}
@State({
  name: 'technologies',
})
@Injectable()
export class TechnologyState {
  constructor(private technologyService: TechnologyService) {}

  @Selector()
  static getTechnologiesList(state: TechnologyStateModel) {
    return state.technologies;
  }

  @Action(GetTechnologies)
  getTechnologies({ getState, setState }: StateContext<TechnologyStateModel>) {
    return this.technologyService.getTechnologies().pipe(
      map(({ payload }) => payload),
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          technologies: result,
        });
      }),
    );
  }
}
