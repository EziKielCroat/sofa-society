import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys } from "@medusajs/utils";

export default async function seedProducts({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productCollectionModuleService = container.resolve(
    "productCollectionModuleService"
  );

  try {
    // Define the collections
    const collectionsToEnsure = [
      { title: "Boho Chic", handle: "boho-chic" },
      { title: "Scandinavian Simplicity", handle: "scandinavian-simplicity" },
      { title: "Modern Luxe", handle: "modern-luxe" },
    ];

    const ensuredCollections: Record<string, string> = {};

    // Create or find collections
    for (const c of collectionsToEnsure) {
      let existing = await productCollectionModuleService.list(
        { title: c.title },
        {}
      );
      if (!existing.length) {
        logger.info(`📦 Creating collection "${c.title}"...`);
        const created = await productCollectionModuleService.create({
          title: c.title,
          handle: c.handle,
        });
        ensuredCollections[c.title] = created.id;
      } else {
        ensuredCollections[c.title] = existing[0].id;
      }
    }

    // Define products and assign to collections
    const productsData = [
      {
        title: "Paloma Haven",
        handle: "paloma-haven",
        subtitle: "Minimalist comfort and Scandinavian elegance",
        description:
          "Minimalistic designs, neutral colors, and high-quality textures. Perfect for those who seek comfort with a clean and understated aesthetic. This collection brings the essence of Scandinavian elegance to your living room.",
        collection_id: ensuredCollections["Modern Luxe"],
        options: [
          { title: "Material", values: ["Linen", "Velvet", "Cotton"] },
          { title: "Color", values: ["Dark Grey", "Light Grey", "Beige"] },
        ],
        variants: [
          {
            title: "Linen - Dark Grey",
            prices: [{ amount: 199900, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Dark Grey" },
          },
          {
            title: "Linen - Light Grey",
            prices: [{ amount: 199900, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Light Grey" },
          },
          {
            title: "Velvet - Beige",
            prices: [{ amount: 219900, currency_code: "eur" }],
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
        options: [
          { title: "Material", values: ["Linen", "Wool Blend"] },
          { title: "Color", values: ["Sand", "Terracotta"] },
        ],
        variants: [
          {
            title: "Linen - Sand",
            prices: [{ amount: 100000, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Sand" },
          },
          {
            title: "Wool Blend - Terracotta",
            prices: [{ amount: 115000, currency_code: "eur" }],
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
        options: [
          { title: "Material", values: ["Cotton", "Velvet"] },
          { title: "Color", values: ["White", "Ash Grey"] },
        ],
        variants: [
          {
            title: "Cotton - White",
            prices: [{ amount: 200000, currency_code: "eur" }],
            options: { Material: "Cotton", Color: "White" },
          },
          {
            title: "Velvet - Ash Grey",
            prices: [
              { amount: 300000, currency_code: "eur" },
              { amount: 250000, currency_code: "eur", region_id: "discount" },
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
        options: [
          { title: "Material", values: ["Velvet", "Linen"] },
          { title: "Color", values: ["Black", "Charcoal"] },
        ],
        variants: [
          {
            title: "Velvet - Black",
            prices: [{ amount: 250000, currency_code: "eur" }],
            options: { Material: "Velvet", Color: "Black" },
          },
          {
            title: "Linen - Charcoal",
            prices: [{ amount: 240000, currency_code: "eur" }],
            options: { Material: "Linen", Color: "Charcoal" },
          },
        ],
      },
    ];

    // Create products
    const { result: products } = await createProductsWorkflow(container).run({
      input: { products: productsData },
    });

    logger.info(`✅ Seeded ${products.length} products successfully!`);
  } catch (err) {
    logger.error(`❌ Error seeding products:`, err);
    throw err;
  }
}
