import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pokemon-card" [routerLink]="['/pokemon', pokemon.id]">
      <div class="pokemon-card__id">#{{ formatId(pokemon.id) }}</div>
      <div class="pokemon-card__image">
        @if (pokemonDetail) {
          <img
            [src]="pokemonDetail.sprites.front_default"
            [alt]="pokemon.name"
            loading="lazy"
          />
        } @else {
          <div class="pokemon-card__image-placeholder">
            <div class="spinner"></div>
          </div>
        }
      </div>
      <h3 class="pokemon-card__name">{{ pokemon.name }}</h3>
      @if (pokemonDetail && pokemonDetail.types && pokemonDetail.types.length > 0) {
        <div class="pokemon-card__types">
          @for (type of pokemonDetail.types; track type.slot) {
            <span
              class="pokemon-type"
              [attr.data-type]="type.type.name"
            >
              {{ type.type.name }}
            </span>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .pokemon-card {
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);

        &:hover {
          transform: translateY(-5px);
          border-color: #00ffff;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        &__id {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 0.75rem;
          color: #00ff00;
          font-family: 'Courier New', monospace;
        }

        &__image {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.5rem 0;

          img {
            width: 100%;
            height: 100%;
            image-rendering: pixelated;
          }
        }

        &__image-placeholder {
          width: 80px;
          height: 80px;
          background: rgba(0, 255, 0, 0.1);
          border: 2px dashed #00ff00;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &__name {
          font-size: 1rem;
          margin: 0.5rem 0;
          text-transform: capitalize;
          color: #00ffff;
          font-family: 'Press Start 2P', monospace;
          text-align: center;
          word-break: break-word;
        }

        &__types {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
      }

      .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid rgba(0, 255, 0, 0.3);
        border-top-color: #00ff00;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .pokemon-type {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: bold;
        border: 1px solid currentColor;

        &[data-type='normal'] {
          background: #a8a878;
          color: #000;
        }
        &[data-type='fire'] {
          background: #f08030;
          color: #fff;
        }
        &[data-type='water'] {
          background: #6890f0;
          color: #fff;
        }
        &[data-type='electric'] {
          background: #f8d030;
          color: #000;
        }
        &[data-type='grass'] {
          background: #78c850;
          color: #000;
        }
        &[data-type='ice'] {
          background: #98d8d8;
          color: #000;
        }
        &[data-type='fighting'] {
          background: #c03028;
          color: #fff;
        }
        &[data-type='poison'] {
          background: #a040a0;
          color: #fff;
        }
        &[data-type='ground'] {
          background: #e0c068;
          color: #000;
        }
        &[data-type='flying'] {
          background: #a890f0;
          color: #000;
        }
        &[data-type='psychic'] {
          background: #f85888;
          color: #fff;
        }
        &[data-type='bug'] {
          background: #a8b820;
          color: #000;
        }
        &[data-type='rock'] {
          background: #b8a038;
          color: #fff;
        }
        &[data-type='ghost'] {
          background: #705898;
          color: #fff;
        }
        &[data-type='dragon'] {
          background: #7038f8;
          color: #fff;
        }
        &[data-type='dark'] {
          background: #705848;
          color: #fff;
        }
        &[data-type='steel'] {
          background: #b8b8d0;
          color: #000;
        }
        &[data-type='fairy'] {
          background: #ee99ac;
          color: #000;
        }
      }
    `,
  ],
})
export class PokemonCardComponent implements OnInit {
  @Input({ required: true }) pokemon!: Pokemon;
  private pokemonService = inject(PokemonService);
  
  pokemonDetail: any = null;

  ngOnInit() {
    // Cargar detalles de manera lazy
    this.pokemonService.getPokemonById(this.pokemon.id).subscribe({
      next: (detail) => {
        this.pokemonDetail = detail;
      },
      error: () => {
        // En caso de error, mantener sin detalles
      }
    });
  }

  formatId(id: number): string {
    return id.toString().padStart(3, '0');
  }
}
