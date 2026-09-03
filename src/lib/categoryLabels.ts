export const categoryLabels: Record<string, string> = {
  Viagem: 'Lugares',
  Jantar: 'Momentos',
  Fofura: 'Fofo',
  Arcade: 'Engraçado',
  Celebration: 'Comemoração',
  Cozy: 'Triste',
};

export function getCategoryLabel(category: string) {
  return categoryLabels[category] || category;
}
