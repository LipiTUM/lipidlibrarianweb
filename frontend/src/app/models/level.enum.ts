export enum Level {
  level_unknown = "level_unknown",
  lipid_category = "lipid_category",
  lipid_class = "lipid_class",
  sum_lipid_species = "sum_lipid_species",
  structural_lipid_species = "structural_lipid_species",
  molecular_lipid_species = "molecular_lipid_species",
  isomeric_lipid_species = "isomeric_lipid_species",
}


export const LevelLabel: Record<Level, string> = {
  [Level.level_unknown]: 'unknown',
  [Level.lipid_category]: 'cateogory',
  [Level.lipid_class]: 'class',
  [Level.sum_lipid_species]: 'sum species',
  [Level.structural_lipid_species]: 'structural species',
  [Level.molecular_lipid_species]: 'molecular species',
  [Level.isomeric_lipid_species]: 'isomeric species',
};
