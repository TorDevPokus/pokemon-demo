import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PokemonCardComponent],
  template: `
    <div class="pokemon-list">
      <div class="pokemon-list__header">
        <h1 class="title">POKÉDEX</h1>
        <p class="subtitle">Generación I & II</p>
      </div>

      <div class="pokemon-list__controls">
        <div class="search-box">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (keyup.enter)="searchPokemon()"
            placeholder="Buscar por nombre o ID..."
            class="search-input"
          />
          <button class="btn btn-primary" (click)="searchPokemon()">
            BUSCAR
          </button>
          @if (searchTerm) {
            <button class="btn btn-secondary" (click)="clearSearch()">
              LIMPIAR
            </button>
          }
        </div>

        <div class="filter-box">
          <label for="type-filter">Filtrar por tipo:</label>
          <select
            id="type-filter"
            [(ngModel)]="selectedType"
            (change)="filterByType()"
            class="filter-select"
          >
            <option value="">Todos los tipos</option>
            @for (type of types; track type) {
              <option [value]="type">{{ type }}</option>
            }
          </select>
        </div>
      </div>

      @if (loading) {
        <div class="loading">
          <div class="loading__spinner"></div>
          <p>CARGANDO...</p>
        </div>
      }

      @if (error) {
        <div class="error">
          <p>⚠️ {{ error }}</p>
          <button class="btn btn-primary" (click)="retry()">REINTENTAR</button>
        </div>
      }

      @if (!loading && !error && pokemons.length === 0) {
        <div class="empty">
          <p>No se encontraron Pokémon</p>
        </div>
      }

      @if (!loading && !error && pokemons.length > 0) {
        <div class="pokemon-grid">
          @for (pokemon of pokemons; track pokemon.id) {
            <app-pokemon-card [pokemon]="pokemon" />
          }
        </div>

        @if (!isFiltered && !isSearching) {
          <div class="pagination">
            <button
              class="btn btn-secondary"
              [disabled]="currentPage === 1"
              (click)="previousPage()"
            >
              ◀ ANTERIOR
            </button>
            <span class="pagination__info">
              Página {{ currentPage }} ({{ pokemons.length }} Pokémon)
            </span>
            <button
              class="btn btn-secondary"
              [disabled]="pokemons.length < pageSize"
              (click)="nextPage()"
            >
              SIGUIENTE ▶
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .pokemon-list {
        padding: 2rem 1rem;
        max-width: 1400px;
        margin: 0 auto;

        &__header {
          text-align: center;
          margin-bottom: 2rem;

          .title {
            font-size: 3rem;
            color: #00ff00;
            text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            font-family: 'Press Start 2P', monospace;
            margin: 0;
            letter-spacing: 0.2rem;
          }

          .subtitle {
            color: #00ffff;
            margin-top: 0.5rem;
            font-family: 'Courier New', monospace;
          }
        }

        &__controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;

          @media (min-width: 768px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }
      }

      .search-box {
        display: flex;
        gap: 0.5rem;
        flex: 1;
        flex-wrap: wrap;

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid #00ff00;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          border-radius: 4px;

          &::placeholder {
            color: rgba(0, 255, 0, 0.5);
          }

          &:focus {
            outline: none;
            border-color: #00ffff;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
          }
        }
      }

      .filter-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        label {
          color: #00ff00;
          font-family: 'Courier New', monospace;
          white-space: nowrap;
        }

        .filter-select {
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid #00ff00;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          border-radius: 4px;
          cursor: pointer;
          text-transform: capitalize;

          &:focus {
            outline: none;
            border-color: #00ffff;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
          }

          option {
            background: #000;
            color: #00ff00;
          }
        }
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid;
        border-radius: 4px;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        white-space: nowrap;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &-primary {
          background: rgba(0, 255, 0, 0.2);
          border-color: #00ff00;
          color: #00ff00;

          &:hover:not(:disabled) {
            background: rgba(0, 255, 0, 0.4);
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          }
        }

        &-secondary {
          background: rgba(0, 255, 255, 0.2);
          border-color: #00ffff;
          color: #00ffff;

          &:hover:not(:disabled) {
            background: rgba(0, 255, 255, 0.4);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
        }
      }

      .loading,
      .error,
      .empty {
        text-align: center;
        padding: 3rem;
        color: #00ff00;
        font-family: 'Courier New', monospace;

        &__spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 255, 0, 0.3);
          border-top-color: #00ff00;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
      }

      .error {
        color: #ff0000;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .pokemon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;

        @media (max-width: 480px) {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;

        &__info {
          color: #00ff00;
          font-family: 'Courier New', monospace;
        }
      }
    `,
  ],
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  pokemons: Pokemon[] = [];
  types: string[] = [];
  loading = false;
  error: string | null = null;

  searchTerm = '';
  selectedType = '';
  currentPage = 1;
  pageSize = 20;

  isFiltered = false;
  isSearching = false;

  ngOnInit() {
    this.loadPokemons();
    this.loadTypes();
  }

  loadPokemons() {
    this.loading = true;
    this.error = null;
    this.isFiltered = false;
    this.isSearching = false;

    const offset = (this.currentPage - 1) * this.pageSize;

    this.pokemonService.getPokemons(this.pageSize, offset).subscribe({
      next: (pokemons) => {
        this.pokemons = pokemons;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  loadTypes() {
    this.pokemonService.getPokemonTypes().subscribe({
      next: (types) => {
        this.types = types;
      },
      error: (err) => {
        console.error('Error loading types:', err);
      },
    });
  }

  searchPokemon() {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.isSearching = true;
    this.isFiltered = false;
    this.selectedType = '';

    this.pokemonService.searchPokemonByName(this.searchTerm).subscribe({
      next: (pokemon) => {
        if (pokemon) {
          this.pokemons = [
            {
              id: pokemon.id,
              name: pokemon.name,
              url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`,
              sprites: pokemon.sprites,
              types: pokemon.types,
              stats: pokemon.stats,
              abilities: pokemon.abilities,
            },
          ];
        } else {
          this.pokemons = [];
          this.error = 'No se encontró el Pokémon';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  filterByType() {
    if (!this.selectedType) {
      this.loadPokemons();
      return;
    }

    this.loading = true;
    this.error = null;
    this.isFiltered = true;
    this.isSearching = false;
    this.searchTerm = '';

    this.pokemonService.getPokemonsByType(this.selectedType).subscribe({
      next: (pokemons) => {
        this.pokemons = pokemons;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedType = '';
    this.currentPage = 1;
    this.loadPokemons();
  }

  nextPage() {
    this.currentPage++;
    this.loadPokemons();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPokemons();
    }
  }

  retry() {
    if (this.isSearching) {
      this.searchPokemon();
    } else if (this.isFiltered) {
      this.filterByType();
    } else {
      this.loadPokemons();
    }
  }
}
