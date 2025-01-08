"use server";

import { liteClient as algoliasearch } from "algoliasearch/lite";
import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD as string,
  url: process.env.REDIS_URL as string,
});

const subscriber = createClient({
  password: process.env.REDIS_PASSWORD,
  url: process.env.REDIS_URL,
});

// console.log(process.env.REDIS_PASSWORD, process.env.REDIS_URL)

redisClient.on("error", (err) => {
  console.log(err);
});

subscriber.on("error", (err) => {
  console.log("error with  redis subscriber:", String(err));
});

subscriber.connect();

redisClient.connect();

// Enable keyspace notifications for expiration events
async () => await redisClient.configSet("notify-keyspace-events", "Ex");

export async function getCache(key: string) {
  return await redisClient
    .get(key)
    .then((data) => {
      //   console.log(data);
      data = String(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export async function setCache(key: string, value: any, ttl?: number) {
  const time = ttl ?? 3600;

  await redisClient
    .setEx(key, time, JSON.stringify(value))
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export const existsInCache = async (key: string) => {
  return await redisClient
    .exists(key)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const deleteFromCache = async (key: string) => {
  return await redisClient
    .del(key)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export async function setRedisTriggerEvent(
  key: string,
  value: string,
  data: string,
  ttlInSeconds: number
) {
  try {
    await redisClient.configSet("notify-keyspace-events", "Ex");

    await redisClient.set(key, value, { EX: ttlInSeconds });

    // await redisClient.set(`${key}_`, data, { EX: ttlInSeconds + 5 });
  
    await redisClient.set(`${key}_`, data);

    console.log(`Key "${key}" set with TTL of ${ttlInSeconds} seconds.`);
  } catch (e) {
    console.log("there was an error setting redis trigger", String(e));
  }
}

export async function invokeSubscriberCallback(
  callback: (message: string) => void
) {
  await subscriber
    .subscribe("__keyevent@0__:expired", (message) => {
      console.log("callback invoked.....");
      callback(String(message));
    })
    .catch((e) =>
      console.log(
        "there was an error invoking subscriber callback: ",
        String(e)
      )
    );
}

async () =>
  invokeSubscriberCallback((message) => {
    console.log("this is the message: ", message);
    if (message === "expired") {
      console.log("expired");
    }
  });

export async function sendMessage() {}

// export const searchClient = algoliasearch(
//   process.env.ALGOLIA_APP_ID as string,
//   process.env.ALGOLIA_SEARCH_KEY as string
// );