import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading) {
      <div class="loading">
        <div class="loading__spinner"></div>
        <p>CARGANDO DATOS...</p>
      </div>
    }

    @if (error) {
      <div class="error">
        <p>⚠️ {{ error }}</p>
        <button class="btn btn-primary" routerLink="/">VOLVER AL INICIO</button>
      </div>
    }

    @if (pokemon && !loading) {
      <div class="pokemon-detail">
        <button class="btn btn-back" routerLink="/">◀ VOLVER</button>

        <div class="pokemon-detail__header">
          <div class="pokemon-detail__id">#{{ formatId(pokemon.id) }}</div>
          <h1 class="pokemon-detail__name">{{ pokemon.name }}</h1>
        </div>

        <div class="pokemon-detail__content">
          <div class="pokemon-detail__image">
            @if (
              pokemon.sprites?.other?.['official-artwork']?.front_default
            ) {
              <img
                [src]="pokemon.sprites.other['official-artwork'].front_default"
                [alt]="pokemon.name"
                class="main-sprite"
              />
            } @else if (pokemon.sprites?.front_default) {
              <img
                [src]="pokemon.sprites.front_default"
                [alt]="pokemon.name"
                class="main-sprite"
              />
            }
          </div>

          <div class="pokemon-detail__info">
            <div class="info-section">
              <h2 class="section-title">TIPOS</h2>
              <div class="types-list">
                @for (type of pokemon.types; track type.slot) {
                  <span class="pokemon-type" [attr.data-type]="type.type.name">
                    {{ type.type.name }}
                  </span>
                }
              </div>
            </div>

            <div class="info-section">
              <h2 class="section-title">MEDIDAS</h2>
              <div class="measurements">
                <div class="measurement">
                  <span class="label">Altura:</span>
                  <span class="value">{{ pokemon.height / 10 }} m</span>
                </div>
                <div class="measurement">
                  <span class="label">Peso:</span>
                  <span class="value">{{ pokemon.weight / 10 }} kg</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h2 class="section-title">ESTADÍSTICAS</h2>
              <div class="stats-list">
                @for (stat of pokemon.stats; track stat.stat.name) {
                  <div class="stat">
                    <div class="stat__name">{{ formatStatName(stat.stat.name) }}</div>
                    <div class="stat__bar-container">
                      <div
                        class="stat__bar"
                        [style.width.%]="(stat.base_stat / 255) * 100"
                        [attr.data-value]="stat.base_stat"
                      ></div>
                    </div>
                    <div class="stat__value">{{ stat.base_stat }}</div>
                  </div>
                }
              </div>
            </div>

            <div class="info-section">
              <h2 class="section-title">HABILIDADES</h2>
              <div class="abilities-list">
                @for (ability of pokemon.abilities; track ability.slot) {
                  <div
                    class="ability"
                    [class.ability--hidden]="ability.is_hidden"
                  >
                    {{ ability.ability.name }}
                    @if (ability.is_hidden) {
                      <span class="ability__badge">OCULTA</span>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .loading,
      .error {
        text-align: center;
        padding: 3rem;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

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

      .btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid;
        border-radius: 4px;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        text-decoration: none;
        display: inline-block;

        &-primary {
          background: rgba(0, 255, 0, 0.2);
          border-color: #00ff00;
          color: #00ff00;

          &:hover {
            background: rgba(0, 255, 0, 0.4);
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          }
        }

        &-back {
          background: rgba(0, 255, 255, 0.2);
          border-color: #00ffff;
          color: #00ffff;
          margin: 1rem;

          &:hover {
            background: rgba(0, 255, 255, 0.4);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
        }
      }

      .pokemon-detail {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;

        &__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        &__id {
          font-size: 1.5rem;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          margin-bottom: 0.5rem;
        }

        &__name {
          font-size: 2.5rem;
          color: #00ffff;
          text-transform: capitalize;
          font-family: 'Press Start 2P', monospace;
          margin: 0;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);

          @media (max-width: 768px) {
            font-size: 1.8rem;
          }
        }

        &__content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        &__image {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid #00ff00;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);

          .main-sprite {
            max-width: 100%;
            height: auto;
            image-rendering: pixelated;
          }
        }

        &__info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
      }

      .info-section {
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);

        .section-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          color: #00ff00;
          margin: 0 0 1rem 0;
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }
      }

      .types-list {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .pokemon-type {
        padding: 0.5rem 1rem;
        border-radius: 12px;
        font-size: 0.9rem;
        text-transform: uppercase;
        font-weight: bold;
        border: 2px solid currentColor;
        font-family: 'Courier New', monospace;

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

      .measurements {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;

        .measurement {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .label {
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
          }

          .value {
            color: #00ffff;
            font-family: 'Press Start 2P', monospace;
            font-size: 1.2rem;
          }
        }
      }

      .stats-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .stat {
          display: grid;
          grid-template-columns: 120px 1fr 50px;
          align-items: center;
          gap: 1rem;

          @media (max-width: 480px) {
            grid-template-columns: 80px 1fr 40px;
            gap: 0.5rem;
          }

          &__name {
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            text-transform: uppercase;

            @media (max-width: 480px) {
              font-size: 0.7rem;
            }
          }

          &__bar-container {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00ff00;
            border-radius: 4px;
            height: 20px;
            overflow: hidden;
          }

          &__bar {
            height: 100%;
            background: linear-gradient(90deg, #00ff00 0%, #00ffff 100%);
            transition: width 0.5s ease;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          }

          &__value {
            color: #00ffff;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            text-align: right;
          }
        }
      }

      .abilities-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .ability {
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff00;
          border-radius: 4px;
          padding: 0.75rem;
          color: #00ffff;
          font-family: 'Courier New', monospace;
          text-transform: capitalize;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &--hidden {
            border-color: #ff00ff;
            background: rgba(255, 0, 255, 0.1);
          }

          &__badge {
            background: #ff00ff;
            color: #000;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: bold;
          }
        }
      }
    `,
  ],
})
export class PokemonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pokemonService = inject(PokemonService);

  pokemon: PokemonDetail | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPokemon(parseInt(id, 10));
    } else {
      this.router.navigate(['/']);
    }
  }

  loadPokemon(id: number) {
    this.loading = true;
    this.error = null;

    this.pokemonService.getPokemonById(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  formatId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  formatStatName(name: string): string {
    const statNames: { [key: string]: string } = {
      hp: 'HP',
      attack: 'ATK',
      defense: 'DEF',
      'special-attack': 'SP. ATK',
      'special-defense': 'SP. DEF',
      speed: 'VEL',
    };
    return statNames[name] || name.toUpperCase();
  }
}
