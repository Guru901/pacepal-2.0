export type User = {
  id: string;
  picture?: string;
  given_name: string;
  email: string;
  isOnBoarded: boolean;
  versions: Array<{
    versionName: string;
    data: {
      slots: Array<{
        name: string;
        hours: number;
      }>;
      desiredSleepHours: number;
    };
  }>;
  mongoId: string;
};
