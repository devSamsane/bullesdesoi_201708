export class Seance {

  constructor(
    public intention: string,
    public rang: number,
    public created?: Date,
    public relaxations?: string[],
    public sophronisations?: string[],
    public userId?: string,
    public updated?: Date,
    public seanceId?: string
  ) { }
}
