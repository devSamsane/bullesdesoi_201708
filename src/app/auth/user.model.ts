export class User {

  constructor(
    public email: string,
    public password: string,
    public firstname: string,
    public lastname: string,
    public phoneNumber: string,
    public appointments?: string[],
    public seances?: string[],
    public displayName?: string,
    public userId?: string,
  ) { }
}
