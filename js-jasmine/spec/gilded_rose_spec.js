const { Shop, Item } = require("../src/gilded_rose.js");

const items = [
  new Item("+5 Dexterity Vest", 10, 20),
  new Item("+5 Dexterity Vest", 10, 55), // qualité > 50
  new Item("+5 Dexterity Vest", 10, -2), // qualité négative
  new Item("Aged Brie", 2, 0),
  new Item("Elixir of the Mongoose", 5, 7),
  new Item("Elixir of the Mongoose", 5, 20),
  new Item("Sulfuras, Hand of Ragnaros", 0, 80),
  new Item("Sulfuras, Hand of Ragnaros", -1, 80), // date de péremption != O
  new Item("Sulfuras, Hand of Ragnaros", 0, 50), // qualité != 80
  new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
  new Item("Backstage passes to a TAFKAL80ETC concert", 10, 5),
  new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),

  // This Conjured item does not work properly yet
  new Item("Conjured Mana Cake", 3, 15),
  new Item("Conjured Mana Cake", 3, 6),
];

const days = Number(process.argv[2]) || 2;
const gildedRose = new Shop(items);

const updatedItemsByDay = [];
const updatedItemsByIndex = {};
// items.forEach((item, i) => {
//   updatedItemsByIndex[i] = [
//     { name: item.name, sellIn: item.sellIn, quality: item.quality },
//   ];
// });

function time(days = days) {
  for (let day = 0; day < days; day++) {
    console.log(`\n-------- day ${day} --------`);
    console.log("name, sellIn, quality");
    items.forEach((item, i) => {
      if (!updatedItemsByIndex[i]) {
        updatedItemsByIndex[i] = [];
      }
      updatedItemsByIndex[i].push({
        name: item.name,
        sellIn: item.sellIn,
        quality: item.quality,
      });
      // console.log(`${item.name}, ${item.sellIn}, ${item.quality}`);
    });
    updatedItemsByDay.push(gildedRose.updateQuality());
  }
}
time(20);
console.log(updatedItemsByIndex);
/// ******* TESTS ********* ///

// "Sulfuras" est un objet légendaire : sa qualité est de 80
// sa qualité ne change jamais
// n'a pas de date de péremption
describe("Sulfuras: ", function () {
  it("Sulfuras: qualité = 80 (new item)", function () {
    gildedRose.items.forEach((item) => {
      if (item.name.toLowerCase().includes("sulfuras")) {
        expect(item.quality).toEqual(80);
      }
    });
  });

  it("Sulfuras: qualité toujours = 80 (updated item)", () => {
    updatedItemsByDay.forEach((day) => {
      day.forEach((item) => {
        if (item.name.toLowerCase().includes("sulfuras")) {
          expect(item.quality).toEqual(80);
        }
      });
    });
  });

  it("Sulfuras: pas de date de péremption. sellIn = 0 (new item)", () => {
    gildedRose.items.forEach((item) => {
      if (item.name.toLowerCase().includes("sulfuras")) {
        expect(item.sellIn).toEqual(0);
      }
    });
  });
  it("Sulfuras: pas de date de péremption. sellIn = 0 (new item)", () => {
    gildedRose.items.forEach((item) => {
      if (item.name.toLowerCase().includes("sulfuras")) {
        expect(item.sellIn).toEqual(0);
      }
    });
  });
});

// La qualité (quality) d'un produit ne peut jamais être négative.
describe("Qualité positive: ", () => {
  it("qualité toujours >=0 (new item)", () => {
    gildedRose.items.forEach((item) => {
      expect(item.quality).toBeGreaterThanOrEqual(0);
    });
  });

  it("qualité toujours >= 0 (updated item)", () => {
    updatedItemsByDay.forEach((day) => {
      day.forEach((item) => {
        {
          expect(item.quality).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });
});

// qualité max de 50, sauf Sulfuras
describe("Qualité Max: ", () => {
  it("qualité <= 50, sauf sulfates (new items)", () => {
    gildedRose.items.forEach((item) => {
      if (!item.name.toLowerCase().includes("sulfuras")) {
        expect(item.quality).toBeLessThanOrEqual(50);
      }
    });
  });

  it("qualité <= 50, sauf sulfates (updated items)", () => {
    updatedItemsByDay.forEach((day) => {
      day.forEach((item) => {
        if (!item.name.toLowerCase().includes("sulfuras")) {
          expect(item.quality).toBeLessThanOrEqual(50);
        }
      });
    });
  });
});

// chaque jour Sellin diminue de 1
// exceptions : Sulfates (sellIn toujours = 0)
describe("Date de péremption: ", () => {
  it("diminue de 1", () => {
    items.forEach((product, index) => {
      if (!product.name.toLowerCase().includes("sulfuras")) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            expect(item.sellIn).toEqual(prec.sellIn - 1);
          }
        }
      }
    });
  });
});

// // chaque jour Qualité diminue de 1
// Une fois que la date de péremption est passée, la qualité diminue de 2
// exceptions : Sulfates - Aged Brie - Backstage passes
describe("Qualité update: ", () => {
  it("diminue de 1 si sellIn >= 0", () => {
    items.forEach((product, index) => {
      if (
        !product.name.toLowerCase().includes("sulfuras") &&
        !product.name.toLowerCase().includes("aged brie") &&
        !product.name.toLowerCase().includes("backstage passes") &&
        !product.name.toLowerCase().includes("conjured")
      ) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn >= 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (item.quality - 1 >= 0) {
              expect(item.quality).toEqual(prec.quality - 1);
            }
          }
        }
      }
    });
  });

  it("diminue de 2 si sellIn < 0", () => {
    items.forEach((product, index) => {
      if (
        !product.name.toLowerCase().includes("sulfuras") &&
        !product.name.toLowerCase().includes("aged brie") &&
        !product.name.toLowerCase().includes("backstage passes") &&
        !product.name.toLowerCase().includes("conjured")
      ) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn < 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (item.quality - 2 >= 0) {
              expect(item.quality).toEqual(prec.quality - 2);
            }
          }
        }
      }
    });
  });
});

// // "Aged Brie" augmente sa qualité (quality) plus le temps passe.
describe("Aged Brie: ", () => {
  it("augmente sa qualité + 1 si sellIn >=0", () => {
    items.forEach((product, index) => {
      if (product.name.toLowerCase().includes("aged brie")) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn >= 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (prec.quality + 1 <= 50) {
              expect(item.quality).toEqual(prec.quality + 1);
            }
          }
        }
      }
    });
  });

  // Condition à vérifier
  it("augmente sa qualité + 2 si sellIn < 0", () => {
    items.forEach((product, index) => {
      if (product.name.toLowerCase().includes("aged brie")) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn < 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (prec.quality + 2 <= 50) {
              expect(item.quality).toEqual(prec.quality + 2);
            }
          }
        }
      }
    });
  });
});

// // "Backstage passes" augmente sa qualité (quality) plus le temps passe (sellIn) ;
// La qualité augmente de 2 quand il reste 10 jours ou moins et de 3 quand il reste 5 jours ou moins, mais la qualité tombe à 0 après le concert.
describe("Backstage passes: ", () => {
  // Qualité +1 si sellin > 10
  it("augmente sa qualité + 1 si sellIn >= 10", () => {
    items.forEach((product, index) => {
      if (product.name.toLowerCase().includes("backstage passes")) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn >= 10) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (prec.quality + 1 <= 50) {
              expect(item.quality).toEqual(prec.quality + 1);
            }
          }
        }
      }
    });
  });

  // qualité +2 si sellIn < 10 et >5
  it("augmente sa qualité + 2 si sellIn entre ]10; 5]", () => {
    items.forEach((product, index) => {
      if (product.name.toLowerCase().includes("backstage passes")) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn < 10 && item.sellIn >= 5) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (prec.quality + 2 <= 50) {
              expect(item.quality).toEqual(prec.quality + 2);
            }
          }
        }
      }
    });
  });

  // Qualité +3 si sellIn <= 5
  it("augmente sa qualité + 3 si sellIn entre ]5; 0]", () => {
    items.forEach((product, index) => {
      if (product.name.toLowerCase().includes("backstage passes")) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn < 5 && item.sellIn >= 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (prec.quality + 3 <= 50) {
              expect(item.quality).toEqual(prec.quality + 3);
            }
          }
        }
      }
    });
  });

  // Qualité = 0 si SellIn < 0
  it("Apres Concert : Qualité = 0 si SellIn < 0", () => {
    items.forEach((product, index) => {
      if (product.name.toLowerCase().includes("backstage passes")) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn < 0) {
            expect(item.quality).toEqual(0);
          }
        }
      }
    });
  });
});

// les éléments "Conjured" voient leur qualité se dégrader de deux fois plus vite que les objets normaux.
describe("Conjured: ", () => {
  it("Quality diminue de 2 si sellIn >= 0", () => {
    items.forEach((product, index) => {
      if (
        product.name.toLowerCase().includes("conjured")
      ) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn >= 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (item.quality - 2 >= 0) {
              expect(item.quality).toEqual(prec.quality - 2);
            }
          }
        }
      }
    });
  });

  it("Quality diminue de 4 si sellIn < 0", () => {
    items.forEach((product, index) => {
      if (
        product.name.toLowerCase().includes("conjured")
      ) {
        for (let i = 0; i < updatedItemsByIndex[index].length; i++) {
          let item = updatedItemsByIndex[index][i];
          if (i > 0 && item.sellIn < 0) {
            let prec = updatedItemsByIndex[index][i - 1];
            if (item.quality - 4 >= 0) {
              expect(item.quality).toEqual(prec.quality - 4);
            }
          }
        }
      }
    });
  });
});
