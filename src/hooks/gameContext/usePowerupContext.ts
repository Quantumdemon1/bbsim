
import { usePowerupContext as usePowerup } from '../../contexts/PowerupContext';

export function usePowerupContext() {
  const powerup = usePowerup();
  
  return {
    // Powerup
    awardPowerup: powerup.awardPowerup,
    usePowerup: powerup.usePowerup,
  };
}
