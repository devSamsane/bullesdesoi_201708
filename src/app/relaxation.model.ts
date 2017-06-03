export class Relaxation {

  constructor(
    public intention: string,
    public intitule: string,
    public consigne: string,
    public userId?: string,
    public seanceId?: string,
    public created?: Date,
    public updated?: Date
  ) { }
}
