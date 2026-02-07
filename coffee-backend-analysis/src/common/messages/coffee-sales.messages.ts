export const CoffeeSalesMessages = {
  NOT_FOUND: (id: number) =>
    `Coffee sale with id ${id} not found`,

  FIND_SUCCESS_TOP_SELLING_COFFEES: (limit: number) =>
    `Top ${limit} selling coffees`,

  FIND_SUCCESS_MOST_PROFITABLE_MONTHS: (limit: number) =>
    `Top ${limit} most profitable months`,

  CREATED: 'Coffee sale created successfully',
  FIND_ONE_SUCCESS: 'Find Coffee sale successfully',
  FIND_SUCCESS: 'Find list Coffee sales successfully',
  UPDATED: 'Coffee sale updated successfully',
  DELETED: 'Coffee sale removed successfully',

  INVALID_FILE: 'Invalid coffee sales file',
};
