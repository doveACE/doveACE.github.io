let Items;
let Tiers;
let SelectedTier;
let SelectedType;
let SelectedTerm = "";
let SelectedItems = [];
let ItemDisplays = [];
let LoginToken = localStorage.getItem("Token")

if (window.location.href.split("&") && window.location.href.split("&")[1].substr(13)) {
  localStorage.setItem("Token", window.location.href.split("&")[1].substr(13))
  window.location.href = window.location
}

const GenerateItem = function (Name) {
  const Item = Items[Name];
  if (Item.UNOBTAINABLE !== true) {
    const Image = document.createElement("img");
    Image.src = Item.icon;
    Image.id = Item.real_name;
    Image.title = Item.name;
    Image.className = "item";
    Image.item = Item;
    ItemDisplays[ItemDisplays.length] = Image;
    Image.onclick = function () {
      for (var i = 0; i < SelectedItems.length; i++) {
        if (SelectedItems[i].icon === "assets/images/placeholder.png") {
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
  //this.document.getElementById("body").innerHTML = "";
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
    Selected.title = Item.name;
    Selected.onclick = function () {
      SelectedItems[i] = {
        name: "Nothing",
        icon: "assets/images/placeholder.png"
      };
      displayTrade();
    };
  }
};

const UpdateList = function () {
  for (const v of ItemDisplays) {
    const Item = v.item;
    const Shown =
      SelectedTier.split(",").includes(Item.tier) &&
      SelectedType.split(",").includes(Item.type) &&
      Item.name.toLowerCase().search(SelectedTerm.toLowerCase()) > -1;
    if (Shown) {
      v.style.display = "";
    } else {
      v.style.display = "none";
    }
  }
};

window.addEventListener("load", function () {
  document.getElementById("tier").oninput = function () {
    SelectedTier = this.value;
    UpdateList();
  };
  document.getElementById("type").oninput = function () {
    SelectedType = this.value;
    UpdateList();
  };
  /*
  document.getElementById("tradable").oninput = function () {
    ShowTradable = this.checked;
    UpdateList();
  };
  */
  document.getElementById("itemname").oninput = function () {
    SelectedTerm = document.getElementById("itemname").value;
    UpdateList();
  };
  document.getElementById("buy").onmousedown = function () {
    if (localStorage.getItem("Token")) {
      // beautiful code?
      // i agree : )
      // but obviously i plan on specializing this module
      // make it specifically for this website with ratelimits and everything

      const Items = []

      for (const v of SelectedItems) {
        if (v.name !== "Nothing") {
          Items.push(v.real_name)
        }
      }

      fetch('https://generalprox.herokuapp.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'target': 'K'
        },
        body: JSON.stringify([localStorage.getItem("Token"), Items])
      })
        .then(function(response){
          console.log(response.status);
        })
    }
  };

  SelectedTier = document.getElementById("tier").value;
  SelectedType = document.getElementById("type").value;
  //ShowTradable = document.getElementById("tradable").checked;

  for (let i = 0; i < 8; i++) {
    SelectedItems[i] = {
      name: "Nothing",
      icon: "assets/images/placeholder.png"
    };
  }

  GenerateList();
});
