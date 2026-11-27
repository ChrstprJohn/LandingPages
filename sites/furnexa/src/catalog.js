import { posts, products } from './content'

const existingTypes = ['Armchairs', 'Bedroom Furniture Sets', 'Tables', 'Clipboards', 'Laptop Stands', 'Bedroom Furniture Sets']

const collections = {
  living: [
    ["modern-armchair"],
    ["coffee-tables","Coffee Tables","Tables"],
    ["halo-sectional","Halo Sectional","Sofas"],
    ["ivory-curve","Ivory Curve","Armchairs"],
    ["luxe-sofa","Luxe Sofa","Sofas"],
    ["nimbus-ottoman","Nimbus Ottoman","Ottomans"],
    ["nordic-loveseat","Nordic Loveseat","Sofas"],
    ["solace-chair","Solace Chair","Armchairs"],
    ["wooden-bookcase","Wooden Bookcase","Shelves"],
  ],
  bedroom: [
    ["king-size-bed"],
    ["cozy-table"],
    ["cupboard"],
    ["hanger"],
    ["luna-nightstand"],
    ["rocking-chair","Rocking Chair","Rocking Chairs"],
    ["rugs","Rugs","Rugs"],
    ["shelf","Shelf","Shelves","149$"],
  ],
  dining: [
    ["aspen-table","Aspen Table","Tables"],
    ["cutting-boards","Cutting Boards","Accessories"],
    ["dining-chair","Dining Chair","Chairs","$129.00"],
    ["elm-sideboard","Elm Sideboard","Storage"],
    ["maris-stool","Maris Stool","Chairs"],
    ["terra-chair","Terra Chair","Chairs","$149.00"],
    ["vento-bench","Vento Bench","Benches"],
  ],
  lamps: [
    ["artistic-lamp","Artistic Lamp","Lamps"],
    ["ivory-twist","Ivory Twist","Lamps"],
    ["luna-dome","Luna Dome","Lamps"],
    ["oak-curve","Oak Curve","Lamps"],
    ["twist-oak","Twist Oak","Lamps"],
  ],
  office: [
    ["cosmo-chair","Cosmo Chair","Chairs"],
    ["cozy-interior","Cozy Interior","Accessories"],
    ["minimalist-armchair","Minimalist Armchair","Rocking Chairs"],
    ["office-chair","Office Chair","Chairs"],
    ["strata-cabinet","Strata Cabinet","Storage"],
    ["terra-desk","Terra Desk","Tables"],
    ["vega-chair","Vega Chair","Chairs"],
    ["white-pillow","White Pillow","Accessories"],
  ],
}

export const collectionsBySlug = Object.fromEntries(Object.entries(collections).map(([collection, items]) => [collection,
  items.map(([slug, name, type, old]) => {
    const bestSeller = products.find((item) => item.slug === slug)
    return bestSeller
      ? { ...bestSeller, type: existingTypes[products.indexOf(bestSeller)], collection }
      : { slug, name, type, old, price: '$99', file: `catalog-${slug}.jpg`, collection }
  }),
 ]))

export const shopItems = [collectionsBySlug.living[0], ...collectionsBySlug.bedroom]
export const catalog = Object.values(collectionsBySlug).flat()

export const articles = [...posts,
  ...[
    ["Pieces for everyday living","modern-living-essentials","essentials","Furniture Guides"],
    ["Make your desk work better","workday-workspace-upgrade","workspace","Office Design"],
    ["Set a more inviting table","dining-mood-table-design","dining","Living Spaces"],
    ["What makes a seat comfortable","comfort-driven-design","comfort","Furniture Guides"],
    ["How to shop for furniture","thoughtful-furniture-choices","choices","Office Design"],
  ].map(([name, slug, image, category]) => ({ name, slug, image, category })),
]

export const colors = [
  ['Neutral Beige', '#d8cbbb'], ['Soft Sage Green', '#a5b39a'], ['Blush Pink', '#dcb8b6'],
]

export const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
export const amount = (price) => Number(price.replace(/[^0-9.]/g, ''))
