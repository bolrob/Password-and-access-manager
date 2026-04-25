import { Component, Input, OnChanges } from '@angular/core';
import { TuiProgressBarComponent } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-strength-meter',
  standalone: true,
  imports: [CommonModule, TuiProgressBarComponent],
  template: `
    <div class="strength-meter">
      <label>Сложность пароля:</label>
      <tui-progress-bar
        [value]="strength / 100"
        [color]="strengthColor"
        size="s"
      ></tui-progress-bar>
      <span class="strength-label">{{ strengthLabel }}</span>
    </div>
  `,
  styles: [`
    .strength-meter { margin: 8px 0; }
    .strength-label { font-size: 12px; color: var(--tui-text-02); }
  `]
})
export class PasswordStrengthMeterComponent implements OnChanges {
  @Input() password = '';

  strength = 0;

  ngOnChanges(): void {
    this.strength = this.calculateStrength(this.password);
  }

  private calculateStrength(password: string): number {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 30;
    return Math.min(score, 100);
  }

  get strengthColor(): 'red' | 'yellow' | 'green' {
    if (this.strength < 40) return 'red';
    if (this.strength < 70) return 'yellow';
    return 'green';
  }

  get strengthLabel(): string {
    if (this.strength < 40) return 'Слабый';
    if (this.strength < 70) return 'Средний';
    return 'Надёжный';
  }
}