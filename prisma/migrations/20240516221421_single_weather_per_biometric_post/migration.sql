/*
  Warnings:

  - A unique constraint covering the columns `[weather_log_id]` on the table `AirQualityWeather` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biometric_post_id]` on the table `WeatherLogs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AirQualityWeather_weather_log_id_key" ON "AirQualityWeather"("weather_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherLogs_biometric_post_id_key" ON "WeatherLogs"("biometric_post_id");
