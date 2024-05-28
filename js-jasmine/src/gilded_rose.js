// ne pas modifier la classe item
class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    // À la fin de chaque journée, notre système diminue ces deux valeurs pour chaque produit
    this.sellIn = sellIn; // nombre de jours restant pour vendre l'article
    this.quality = quality; // combien l'article est précieux
    console.log(this.name);
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
    this.fixNewItems();
  }

  fixNewItems() {
    this.items.forEach((item) => {
      // Sulfuras
      if (item.name.toLowerCase().includes("sulfuras")) {
        if (item.quality !== 80) {
          item.quality = 80;
        }
        if (item.sellIn !== 0) {
          item.sellIn = 0;
        }
      } else {
        // non Sulfuras
        if (item.quality > 50) {
          item.quality = 50;
        }
      }
      // Qualité positive
      if (item.quality < 0) {
        item.quality = 0;
      }
    });
  }
  updateQuality() {
    this.items.forEach((item) => {
      const qualityLose = 1;
      switch (item.name) {
        case "Sulfuras, Hand of Ragnaros":
          // aucun changement
          break;

        case "Aged Brie":
          break;

        case "Backstage passes to a TAFKAL80ETC concert":
          break;

        case "Conjured":
          
          break;
        default:

          break;
      }
      this.updateSellIn(item);
    });
    return this.items;
  }

  updateSellIn(item) {
    if (item.name !== "Sulfuras, Hand of Ragnaros") {
      item.sellIn--;
    }
  }
  updateQuality_old() {
    for (var i = 0; i < this.items.length; i++) {
      if (
        this.items[i].name != "Aged Brie" &&
        this.items[i].name != "Backstage passes to a TAFKAL80ETC concert"
      ) {
        if (this.items[i].quality > 0) {
          if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
            this.items[i].quality = this.items[i].quality - 1;
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1;
          if (
            this.items[i].name == "Backstage passes to a TAFKAL80ETC concert"
          ) {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
          }
        }
      }
      if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      if (this.items[i].sellIn < 0) {
        if (this.items[i].name != "Aged Brie") {
          if (
            this.items[i].name != "Backstage passes to a TAFKAL80ETC concert"
          ) {
            if (this.items[i].quality > 0) {
              if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
                this.items[i].quality = this.items[i].quality - 1;
              }
            }
          } else {
            this.items[i].quality =
              this.items[i].quality - this.items[i].quality;
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1;
          }
        }
      }
    }

    return this.items;
  }
}

module.exports = {
  Item,
  Shop,
};
