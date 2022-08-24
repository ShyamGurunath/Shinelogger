import { Cron } from "../Shared/deps.ts";
import { SHINESERVERHOST, SHINESERVERPORT } from "../Shared/constants.ts";
import { log } from "../Shared/deps.ts";

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
        `http://${SHINESERVERHOST}:${SHINESERVERPORT}/api/log/flush-logs/${this.classKey}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (response.status == 200) {
        log.info(
          `${data.data} - ${data.msg} for ${this.classKey} at ${new Date()} `,
        );
      } else {
        log.error(
          `${data.data} - ${data.msg} for ${this.classKey} at ${new Date()} `,
        );
      }
    } catch (err) {
      log.error(err.message);
    }
  };
}

const enrollFlusher = async (classKey: string, cronExpression: string) => {
  const scheduler = new SchedulerClass(classKey, cronExpression);
  const cronjob: Cron = await scheduler.createCronJob(cronExpression);
  Schedulerlist.set(classKey, cronjob);
  log.info(`Enrolled flusher for ${classKey} at ${new Date()} `);
};

const removeFlusher = async (classKey: string) => {
  const scheduler = Schedulerlist.get(classKey);
  await scheduler!.stop();
  Schedulerlist.delete(classKey);
  log.info(`Removed flusher for ${classKey} at ${new Date()} `);
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
      `http://${SHINESERVERHOST}:${SHINESERVERPORT}/api/get-all-loggers`;
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    if (response.status == 200) {
      if (data.data.length > 0) {
        for (const logger of data.data) {
          if (logger.isFlushLogs) {
            log.info(
              `Enrolling flusher for ${logger.loggerName} at ${new Date()} `,
            );
            await enrollFlusher(
              logger.loggerName,
              logger.flushIntervalCronExpression,
            );
          }
        }
      }
    }
  } catch (err) {
    log.error(err.message);
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
