import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys } from "@medusajs/utils";

export default async function seedRelatedProducts({
  container,
}: {
  container: any;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    const productsData = [
      {
        title: "Camden Retreat",
        handle: "camden-retreat",
        description: "Boho chic sofa with relaxed elegance and comfort",
        collection_id: "boho-chic",
        options: [
          {
            title: "Material",
            values: ["Linen", "Velvet", "Cotton"],
          },
          {
            title: "Color",
            values: ["Cream", "Terracotta", "Sage"],
          },
        ],
        variants: [
          {
            title: "Linen - Cream",
            prices: [{ amount: 100000, currency_code: "eur" }],
            options: {
              Material: "Linen",
              Color: "Cream",
            },
          },
          {
            title: "Velvet - Terracotta",
            prices: [{ amount: 100000, currency_code: "eur" }],
            options: {
              Material: "Velvet",
              Color: "Terracotta",
            },
          },
        ],
      },
      {
        title: "Oslo Drift",
        handle: "oslo-drift",
        description:
          "Scandinavian simplicity with clean lines and minimalist design",
        collection_id: "scandinavian-simplicity",
        options: [
          {
            title: "Material",
            values: ["Wool", "Linen", "Leather"],
          },
          {
            title: "Color",
            values: ["Black", "Grey", "White"],
          },
        ],
        variants: [
          {
            title: "Wool - Black",
            prices: [{ amount: 200000, currency_code: "eur" }],
            options: {
              Material: "Wool",
              Color: "Black",
            },
          },
          {
            title: "Linen - Grey",
            prices: [{ amount: 300000, currency_code: "eur" }],
            options: {
              Material: "Linen",
              Color: "Grey",
            },
          },
        ],
      },
      {
        title: "Sutton Royale",
        handle: "sutton-royale",
        description:
          "Modern luxe sofa with premium materials and sophisticated design",
        collection_id: "modern-luxe",
        options: [
          {
            title: "Material",
            values: ["Leather", "Premium Velvet", "Suede"],
          },
          {
            title: "Color",
            values: ["Black", "Charcoal", "Navy"],
          },
        ],
        variants: [
          {
            title: "Leather - Black",
            prices: [{ amount: 250000, currency_code: "eur" }],
            options: {
              Material: "Leather",
              Color: "Black",
            },
          },
          {
            title: "Premium Velvet - Charcoal",
            prices: [{ amount: 250000, currency_code: "eur" }],
            options: {
              Material: "Premium Velvet",
              Color: "Charcoal",
            },
          },
        ],
      },
    ];

    const { result: products } = await createProductsWorkflow(container).run({
      input: {
        products: productsData,
      },
    });

    logger.info(`✅ Seeded ${products.length} related product(s) successfully`);
  } catch (err) {
    logger.error(`❌ Error seeding related products:`, err);
    throw err;
  }
}
