import { z } from "zod";
import { env } from "~/env";
import { db } from "~/server/db";
import { tClimaResponseSchema } from "./TClimaResponse";

export async function GET() {
  return new Response("Get a POST");
}
export async function POST(req: Request) {
  // Secure posts with basic api-key check
  if (
    !req.headers.get("api-key") ||
    req.headers.get("api-key") !== env.BIO_KEY
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  const zodSchema = z.object({
    whoId: z.string(),
    date: z.string().datetime(),
  });
  //validate schema
  let data = null;
  try {
    data = (await req.json()) as unknown;
  } catch (error) {
    return new Response("Invalid request body, malformed JSON", {
      status: 400,
    });
  }
  try {
    zodSchema.parse(data);
  } catch (error) {
     
    return new Response(`Invalid request body, must follow schema ${error as string}`, {
      status: 400,
    });
  }
  //check that whoId exists
  const infer = data as z.infer<typeof zodSchema>;

  const who = await db.volunteers.findUnique({
    where: {
      biometric_id: infer.whoId,
    },
  });
  if (!who) {
    return new Response("Volunteer Biometric ID not found on DB", { status: 404 });
  }

  //?key=5be1b047d7b14eab954200256242604&q=-17.774130207959164,-63.1923952918588&aqi=yes
  //We need to do a query to get the weather.
  const climate = await fetch(
    env.WEATHER_API_URL +
      "?key=" +
      env.WEATHER_API_KEY +
      "&q=" +
      env.FABLAB_COORDINATES +
      "&aqi=yes",
  ).then((res) => res.json() as unknown).catch((error) => {
    //TODO: Handle this in log details
    console.log(error);
  });

  //Casteamos a zod
  const zodClimate = tClimaResponseSchema.safeParse(climate);

  if (!zodClimate.success) {
    const mark = await db.biometricPosts.create({
      data: {
        date: infer.date,
        who_id: infer.whoId,
      },
    });
    const response = {
      success: true,
      message: "Weather data not found",
      data: mark,
    }
    return new Response(JSON.stringify(response));
  }
  const creation = await db.biometricPosts.create({
    data: {
      date: infer.date,
      who_id: infer.whoId,
      weather_log: {
        create: {
          humidity: zodClimate.data.current.humidity,
          precipitation_mm: zodClimate.data.current.precip_mm,
          cloud: zodClimate.data.current.cloud,
          pressure: zodClimate.data.current.pressure_mb,
          temperature_c: zodClimate.data.current.temp_c,
          wind_dir: zodClimate.data.current.wind_dir,
          wind_speed_kmh: zodClimate.data.current.wind_mph,
          air_quality_weather: {
            create: {
              carbon_monoxide: zodClimate.data.current.air_quality.co,
              nitrogen_dioxide: zodClimate.data.current.air_quality.no2,
              gb_defra_index: zodClimate.data.current.air_quality["gb-defra-index"],
              ozone: zodClimate.data.current.air_quality.o3,
              particulate_matter_10: zodClimate.data.current.air_quality.pm10,
              particulate_matter_25: zodClimate.data.current.air_quality.pm2_5,
              sulfur_dioxide: zodClimate.data.current.air_quality.so2,
              us_epa_index: zodClimate.data.current.air_quality["us-epa-index"],
              
            }
          }

        }
      },
    },
  });
  const response = {
    success: true,
    message: "Weather data created",
    data: creation,
  }
  return new Response(
    JSON.stringify(response),
  );
  
}
