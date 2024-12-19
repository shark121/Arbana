"use server";

import { createClient } from "redis";

const redisClient = createClient({
  // password: process.env.REDIS_PASSWORD,
  url : "redis://127.0.0.1:8080"
});

redisClient.on("error", (err) => {
  console.log(err);
});

redisClient.connect();

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


export const deleteFromCache = async (key:string)=>{
  return await redisClient.del(key)
  .then((res) => {
    return res;
  })
  .catch((err) => {
    console.log(err);
    return false;
  });
}


