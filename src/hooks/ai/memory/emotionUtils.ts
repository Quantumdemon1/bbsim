
/**
 * Get default emotion based on impact
 */
export const getDefaultEmotion = (impact: 'positive' | 'negative' | 'neutral'): string => {
  switch (impact) {
    case 'positive':
      return 'happy';
    case 'negative':
      return 'upset';
    case 'neutral':
    default:
      return 'neutral';
  }
};
