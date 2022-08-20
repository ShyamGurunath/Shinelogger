export default interface Logger {
  _id: { $oid: string };
  loggerName: string;
  description?: string;
  isRollingFile: boolean;
  rollingLogDirectorypath?: string;
  isEmail: boolean;
  emailLogLevel?: string;
  emailToPrimary?: string;
  emailToSecondary?: string;
  emailFrom?: string;
  emailFromPassword?: string;
  isFlushLogs: boolean;
  flushIntervalCronExpression?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
