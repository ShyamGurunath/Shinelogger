import { Cron } from "../Shared/deps.ts";
import  logging  from "../Shared/logsHandler.ts";

const Schedulerlist = new Map<string, Cron>();

class SchedulerClass {
  public classKey: string;

  public cronExpression: string;

  public constructor(public loggerName: string, public cronExpressionString: string) {
    this.classKey = loggerName;
    this.cronExpression = cronExpressionString;
  }

  createCronJob = (cronExpression: string) => {
    const cronJob: Cron = new Cron(cronExpression, async () => {
      await this.cronOperation();
    });
    return cronJob;
  };

  cronOperation = async () => {
    try {
      const response = await fetch(
        `http://shine_api_gateway:8502/flushlogs?loggerName=${this.classKey}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (response.status == 200) {
        logging.info(
          `${data.data} - ${data.msg} for ${this.classKey} at ${new Date()} `,
        );
      } else {
        logging.error(
          `${data.data} - ${data.msg} for ${this.classKey} at ${new Date()} `,
        );
      }
    } catch (err) {
      logging.error(err.message);
    }
  };
}

const enrollFlusher = async (classKey: string, cronExpression: string) => {
  const scheduler = new SchedulerClass(classKey, cronExpression);
  const cronjob: Cron = await scheduler.createCronJob(cronExpression);
  Schedulerlist.set(classKey, cronjob);
  logging.info(`Enrolled flusher for ${classKey} at ${new Date()} `);
};

const removeFlusher = async (classKey: string) => {
  const scheduler = Schedulerlist.get(classKey);
  await scheduler!.stop();
  Schedulerlist.delete(classKey);
  logging.info(`Removed flusher for ${classKey} at ${new Date()} `);
};

const updateFlusher = async (classKey: string, cronExpression: string) => {
  const scheduler = Schedulerlist.get(classKey);
  await scheduler!.stop();
  Schedulerlist.delete(classKey);
  await enrollFlusher(classKey, cronExpression);
};

const enrollFlusherAtStart = async () => {
  // get api call to get all the schedulers
  try {
    const url =
      `http://shine_api_gateway:8502/getloggers`;
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    if (response.status == 200) {
      if (data.data.length > 0) {
        for (const logger of data.data) {
          if (logger.isFlushLogs) {
            if(Schedulerlist.get(logger.loggerName) == null){
              logging.info(
                  `Enrolling flusher for ${logger.loggerName} at ${new Date()} `,
              );
              await enrollFlusher(
                  logger.loggerName,
                  logger.flushIntervalCronExpression,
              );

            }
            else {
              logging.info(`Logger ${logger.loggerName} already Exists, Skipping !`)
            }
          }
        }
      }
    }
  } catch (err) {
    logging.error(err.message);
  }
};

export {
  enrollFlusher,
  enrollFlusherAtStart,
  removeFlusher,
  SchedulerClass,
  Schedulerlist,
  updateFlusher,
};
