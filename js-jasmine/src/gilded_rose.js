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
  maxQuality = 50;
  minQuality = 0;
  maxSuperQuality = 80;

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
      
      switch (item.name) {
        case "Sulfuras, Hand of Ragnaros":
          // aucun changement
          break;

        case "Aged Brie":
          this.updateSellIn(item);
          item.quality += item.sellIn >= 0 ? 1 : 2;
          break;

        case "Backstage passes to a TAFKAL80ETC concert":
          this.updateSellIn(item);
          if (item.sellIn >= 10) {
            item.quality += 1;
          }
          if (item.sellIn < 10 && item.sellIn > 5) {
            item.quality += 2;
          }
          if (item.sellIn <= 5 && item.sellIn >= 0) {
            item.quality += 3;
          }
          if (item.sellIn < 0) {
            item.quality = 0;
          }
          break;

        case "Conjured Mana Cake":
          item.quality -= item.sellIn > 0 ? 2 : 4;
          this.updateSellIn(item);
          break;

        default:
          item.quality -= item.sellIn > 0 ? 1 : 2;
          this.updateSellIn(item);
          break;
      }

      this.checkMinQuality(item);
      this.checkMaxQuality(item);
      
    });
    return this.items;
  }

  updateSellIn(item) {
    if (item.name !== "Sulfuras, Hand of Ragnaros") {
      item.sellIn--;
    }
  }

  checkMinQuality(item) {
    if (item.quality < this.minQuality) {
      item.quality = this.minQuality;
    }
  }
  checkMaxQuality(item) {
    const max =
      item.name == "Sulfuras, Hand of Ragnaros"
        ? this.maxSuperQuality
        : this.maxQuality;
    if (item.quality > max) {
      item.quality = max;
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
