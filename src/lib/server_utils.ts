"use server";

import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD as string,
  url : process.env.REDIS_URL as string
});


// console.log(process.env.REDIS_PASSWORD, process.env.REDIS_URL)

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


