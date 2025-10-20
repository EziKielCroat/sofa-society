import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

export default async function seedProducts({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const remoteLink = container.resolve("remoteLink");

  try {
    const collectionsToEnsure = [
      { title: "Boho Chic", handle: "boho-chic" },
      { title: "Scandinavian Simplicity", handle: "scandinavian-simplicity" },
      { title: "Modern Luxe", handle: "modern-luxe" },
    ];

    const ensuredCollections: Record<string, string> = {};

    for (const c of collectionsToEnsure) {
      let existing = await productModuleService.listProductCollections(
        { title: c.title },
        {}
      );
      if (!existing.length) {
        logger.info(`Creating collection "${c.title}"...`);
        const [created] = await productModuleService.createProductCollections([
          {
            title: c.title,
            handle: c.handle,
          },
        ]);
        ensuredCollections[c.title] = created.id;
      } else {
        logger.info(`Collection "${c.title}" already exists, using existing.`);
        ensuredCollections[c.title] = existing[0].id;
      }
    }

    const productsData = [
      {
        title: "Paloma Haven",
        handle: "paloma-haven",
        subtitle: "Minimalist comfort and Scandinavian elegance",
        description:
          "Minimalistic designs, neutral colors, and high-quality textures. Perfect for those who seek comfort with a clean and understated aesthetic. This collection brings the essence of Scandinavian elegance to your living room.",
        collection_id: ensuredCollections["Modern Luxe"],
        status: "published",
        options: [
          { title: "Material", values: ["Linen", "Velvet", "Cotton"] },
          { title: "Color", values: ["Dark Grey", "Light Grey", "Beige"] },
        ],
        variants: [
          {
            title: "Linen - Dark Grey",
            prices: [{ amount: 1200000, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Dark Grey" },
          },
          {
            title: "Linen - Light Grey",
            prices: [{ amount: 1200000, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Light Grey" },
          },
          {
            title: "Velvet - Beige",
            prices: [{ amount: 1200000, currency_code: "eur" }],
            options: { Material: "Velvet", Color: "Beige" },
          },
        ],
      },
      {
        title: "Camden Retreat",
        handle: "camden-retreat",
        subtitle: "Laid-back charm with warm bohemian tones",
        description:
          "The Camden Retreat combines earthy textures and relaxed lines, creating the ultimate Boho Chic lounge experience.",
        collection_id: ensuredCollections["Boho Chic"],
        status: "published",
        options: [
          { title: "Material", values: ["Linen", "Wool Blend"] },
          { title: "Color", values: ["Sand", "Terracotta"] },
        ],
        variants: [
          {
            title: "Linen - Sand",
            prices: [{ amount: 10000000, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Sand" },
          },
          {
            title: "Wool Blend - Terracotta",
            prices: [{ amount: 10000000, currency_code: "eur" }],
            options: { Material: "Wool Blend", Color: "Terracotta" },
          },
        ],
      },
      {
        title: "Oslo Drift",
        handle: "oslo-drift",
        subtitle: "Nordic precision and effortless balance",
        description:
          "A statement of Scandinavian Simplicity — neutral hues, lightweight structure, and refined lines for the modern home.",
        collection_id: ensuredCollections["Scandinavian Simplicity"],
        status: "published",
        options: [
          { title: "Material", values: ["Cotton", "Velvet"] },
          { title: "Color", values: ["White", "Ash Grey"] },
        ],
        variants: [
          {
            title: "Cotton - White",
            prices: [{ amount: 20000000, currency_code: "eur" }],
            options: { Material: "Cotton", Color: "White" },
          },
          {
            title: "Velvet - Ash Grey",
            prices: [
              { amount: 30000000, currency_code: "eur" },
              { amount: 20000000, currency_code: "eur" },
            ],
            options: { Material: "Velvet", Color: "Ash Grey" },
          },
        ],
      },
      {
        title: "Sutton Royale",
        handle: "sutton-royale",
        subtitle: "Refined geometry and plush comfort",
        description:
          "Part of the Modern Luxe collection — the Sutton Royale sofa embodies elegance through bold minimalism and indulgent materials.",
        collection_id: ensuredCollections["Modern Luxe"],
        status: "published",
        options: [
          { title: "Material", values: ["Velvet", "Linen"] },
          { title: "Color", values: ["Black", "Charcoal"] },
        ],
        variants: [
          {
            title: "Velvet - Black",
            prices: [{ amount: 25000000, currency_code: "eur" }],
            options: { Material: "Velvet", Color: "Black" },
          },
          {
            title: "Linen - Charcoal",
            prices: [{ amount: 25000000, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Charcoal" },
          },
        ],
      },
    ];

    const productHandles = productsData.map((p) => p.handle);
    const existingProducts = await productModuleService.listProducts(
      { handle: productHandles },
      {}
    );
    const existingHandles = new Set(existingProducts.map((p) => p.handle));

    const newProducts = productsData.filter(
      (p) => !existingHandles.has(p.handle)
    );

    if (newProducts.length === 0) {
      logger.info(` All products already exist. No new products to create.`);
      logger.info(
        `To recreate products, delete them first or use a different handle.`
      );
      return;
    }

    logger.info(`Creating ${newProducts.length} new products...`);
    if (existingHandles.size > 0) {
      logger.info(
        `Skipping ${existingHandles.size} existing products: ${Array.from(
          existingHandles
        ).join(", ")}`
      );
    }

    const { result: products } = await createProductsWorkflow(container).run({
      input: { products: newProducts },
    });

    logger.info(`Seeded ${products.length} products successfully!`);

    // Get the default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });

    if (!salesChannels.length) {
      logger.warn(
        `⚠️  Default Sales Channel not found. Products not linked to any sales channel.`
      );
      return;
    }

    const defaultSalesChannel = salesChannels[0];
    logger.info(`Linking products to "${defaultSalesChannel.name}"...`);

    // Link all products (both new and existing) to the default sales channel
    const allProducts = await productModuleService.listProducts(
      { handle: productHandles },
      {}
    );

    for (const product of allProducts) {
      try {
        await remoteLink.create([
          {
            [Modules.PRODUCT]: {
              product_id: product.id,
            },
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: defaultSalesChannel.id,
            },
          },
        ]);
        logger.info(`Linked "${product.title}" to sales channel`);
      } catch (err: any) {
        if (err.message?.includes("already exists")) {
          logger.info(`"${product.title}" already linked to sales channel`);
        } else {
          logger.warn(`Could not link "${product.title}": ${err.message}`);
        }
      }
    }

    logger.info(`🎉 All done!`);
  } catch (err) {
    logger.error(`Error seeding products:`, err);
    throw err;
  }
}
