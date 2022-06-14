let Items;
let Tiers;
let SelectedTier;
let SelectedType;
let SelectedTerm = "";
let ShowTradable;
let SelectedItems = [];

const GenerateItem = function (Name) {
  const Item = Items[Name];
  if (
    SelectedTier.split(",").includes(Item.tier) &&
    SelectedType.split(",").includes(Item.type) &&
    Item.name.toLowerCase().search(SelectedTerm.toLowerCase()) > -1 &&
    Item.UNOBTAINABLE !== true
  ) {
    const Image = document.createElement("img");
    Image.src = Item.icon;
    Image.id = Item.real_name;
    Image.title = Item.name;
    Image.className = "item";
    Image.onclick = function () {
      for (var i = 0; i < SelectedItems.length; i++) {
        if (SelectedItems[i].icon === "assets/images/placeholder.txt") {
          SelectedItems[i] = Item;
          displayTrade();
          break;
        }
      }
    };

    Image.onmouseenter = function () {
      Image.style = `border-image: linear-gradient(135deg, #${
        Tiers[Item.tier][1]
      }, #${Tiers[Item.tier][2]}) 1;`;
    };
    Image.onmouseleave = function () {
      Image.style = `border-image: null`;
    };

    document.getElementById("body").appendChild(Image);
  }
};

const GenerateList = function () {
  this.document.getElementById("body").innerHTML = "";
  fetch("assets/data/KAT.json")
    .then((response) => response.json())
    .then((json) => {
      Items = json.items;
      Tiers = json.tiers;

      for (const Name in Items) {
        GenerateItem(Name);
      }

      displayTrade();
    });
};

const displayTrade = function () {
  for (const i in SelectedItems) {
    const Item = SelectedItems[i];
    const Selected = document.getElementsByClassName("selected")[i];
    Selected.src = Item.icon;
    Selected.title = Item.name
    Selected.onclick = function () {
      SelectedItems[i] = { icon: "assets/images/placeholder.png" };
      displayTrade();
    };
  }
};

window.addEventListener("load", function () {
  document.getElementById("tier").oninput = function () {
    SelectedTier = this.value;
    GenerateList();
  };
  document.getElementById("type").oninput = function () {
    SelectedType = this.value;
    GenerateList();
  };
  /*
  document.getElementById("tradable").oninput = function () {
    ShowTradable = this.checked;
    GenerateList();
  };
  */
  document.getElementById("itemname").oninput = function () {
    SelectedTerm = document.getElementById("itemname").value;
    GenerateList();
  };
  document.getElementById("buy").onmousedown = function () {
    const request = new XMLHttpRequest();
    // beautiful code?
    // i agree : )
    request.open("POST", "http://localhost:5000");
    request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('target', 'DW_1');

    request.send(`{"content": "test for gamers..."}`);
  };

  SelectedTier = document.getElementById("tier").value;
  SelectedType = document.getElementById("type").value;
  //ShowTradable = document.getElementById("tradable").checked;

  for (let i = 0; i < 8; i++) {
    SelectedItems[i] = { icon: "assets/images/placeholder.png" };
  }

  GenerateList();
});
