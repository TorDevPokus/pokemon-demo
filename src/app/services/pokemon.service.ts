import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Pokemon,
  PokemonListResponse,
  PokemonDetail,
  PokemonTypeResponse,
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private readonly pokemonCache = new Map<number, PokemonDetail>();

  getPokemons(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.http
      .get<PokemonListResponse>(
        `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
      )
      .pipe(
        map((response) => {
          // Retornar la lista básica - los detalles se cargan lazy en las tarjetas
          return response.results.map((pokemon, index) => ({
            ...pokemon,
            id: offset + index + 1,
          }));
        }),
        catchError(this.handleError)
      );
  }

  getPokemonById(id: number): Observable<PokemonDetail> {
    if (this.pokemonCache.has(id)) {
      return of(this.pokemonCache.get(id)!);
    }

    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${id}`).pipe(
      map((pokemon) => {
        this.pokemonCache.set(id, pokemon);
        return pokemon;
      }),
      catchError(this.handleError)
    );
  }

  searchPokemonByName(name: string): Observable<PokemonDetail | null> {
    if (!name.trim()) {
      return of(null);
    }

    return this.http
      .get<PokemonDetail>(`${this.baseUrl}/pokemon/${name.toLowerCase()}`)
      .pipe(
        map((pokemon) => {
          this.pokemonCache.set(pokemon.id, pokemon);
          return pokemon;
        }),
        catchError(() => of(null))
      );
  }

  getPokemonTypes(): Observable<string[]> {
    return this.http.get<PokemonTypeResponse>(`${this.baseUrl}/type`).pipe(
      map((response) => response.results.map((type) => type.name).sort()),
      catchError(this.handleError)
    );
  }

  getPokemonsByType(type: string): Observable<Pokemon[]> {
    return this.http
      .get<any>(`${this.baseUrl}/type/${type}`)
      .pipe(
        map((response) =>
          response.pokemon
            .map((p: any) => {
              const id = this.extractIdFromUrl(p.pokemon.url);
              return {
                id,
                name: p.pokemon.name,
                url: p.pokemon.url,
              };
            })
            .sort((a: Pokemon, b: Pokemon) => a.id - b.id)
            .slice(0, 100)
        ),
        catchError(this.handleError)
      );
  }

  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
