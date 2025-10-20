import { Modules } from "@medusajs/utils";

export default async function increaseStock({ container }: { container: any }) {
  const logger = container.resolve("logger");
  const inventoryModule = container.resolve(Modules.INVENTORY);
  const productModule = container.resolve(Modules.PRODUCT);

  try {
    // Get all products
    const products = await productModule.listProducts();
    logger.info(`Found ${products.length} products`);

    // For each product, increase stock on all variants
    for (const product of products) {
      logger.info(`\nProcessing product: ${product.title}`);

      for (const variant of product.variants || []) {
        try {
          // Get or create inventory item for this variant
          const inventoryItems = await inventoryModule.listInventoryItems({
            sku: variant.sku,
          });

          if (inventoryItems.length > 0) {
            const inventoryItem = inventoryItems[0];
            logger.info(`  Variant: ${variant.title} (SKU: ${variant.sku})`);

            // Increase quantity by updating stock levels
            await inventoryModule.updateInventoryItems(inventoryItem.id, {
              quantity: 100, // Set to 100 stock
            });

            logger.info(`    ✅ Stock updated to 100`);
          } else {
            logger.warn(
              `  ⚠️ No inventory item found for variant: ${variant.title}`
            );
          }
        } catch (err) {
          logger.error(`  ❌ Error updating variant ${variant.title}:`, err);
        }
      }
    }

    logger.info("\n✅ Stock update completed");
  } catch (err) {
    logger.error("❌ Error:", err);
    throw err;
  }
}
