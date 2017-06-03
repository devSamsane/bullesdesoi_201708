export class Appointment {

  constructor(
    public startDateTime: Date,
    public isConfirmed: boolean,
    public userId?: string,
    public endDateTime?: Date,
    public appointmentId?: string
  ) { }
}
