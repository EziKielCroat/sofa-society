import { Modules } from "@medusajs/utils";

// nediraj nepitaj neradi boga pitaj sta je sovin

// 401 unauthorized error kadgod runnan ovu skriput makar iskoristia najnovije keyeve

export default async function checkAndCreateRegion({
  container,
}: {
  container: any;
}) {
  const logger = container.resolve("logger");
  const regionModule = container.resolve(Modules.REGION);

  try {
    logger.info("Fetching regions...");

    // Use listRegions instead
    const regions = await regionModule.listRegions();

    logger.info(`✅ Regions found: ${regions.length}`);
    regions.forEach((r: any) => {
      logger.info(
        `  - ID: ${r.id}, Name: ${r.name}, Currency: ${r.currency_code}`
      );
    });

    if (regions.length === 0) {
      logger.info("No regions found. Creating default region...");

      const newRegion = await regionModule.createRegions({
        name: "Europe",
        currency_code: "eur",
        tax_rate: 0,
      });

      logger.info(`✅ Region created successfully!`);
      logger.info(`Region ID: ${newRegion.id}`);
      logger.info(`COPY THIS ID AND ADD TO FRONTEND .env.local`);

      return newRegion;
    }

    logger.info(`Using existing region: ${regions[0].id}`);
    return regions[0];
  } catch (err) {
    logger.error("Error:", err);
    throw err;
  }
}
