export default interface Logger {
    _id: {$oid: string};
    loggerName: string;
    description?: string;
    isRollingFile: boolean;
    isEmail: boolean;
    isConsole: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}