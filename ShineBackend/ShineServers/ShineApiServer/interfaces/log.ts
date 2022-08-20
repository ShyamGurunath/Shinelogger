export default interface Log {
  _id: { $oid: string };
  loggerName: string;
  logmessage: string;
  logLevel: string;
  logTimeStamp?: Date;
  additionalInfo?: string;
}
