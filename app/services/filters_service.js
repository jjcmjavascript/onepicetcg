
 export const costs = Array(10).fill(0).map((_,k) => k + 1);
 
 export const attacks = Array(10).fill(0).map((_,k) => (k + 1) * 1000); 
 
 export const colors = await this.colors.findAll(
  {attributes: ['name', 'id']}
 );
 
 export const packs = await this.packs.findAll({
     attributes: ['name', 'code', 'id'],
 }) 