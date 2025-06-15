export function formatRoleLabel(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatTemplateCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}