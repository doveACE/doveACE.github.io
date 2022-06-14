let Items;
let Tiers;
let SelectedTier;
let SelectedType;
let SelectedTerm = "";
let SelectedItems = [];
let ItemDisplays = [];

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
    if (window.location.href.split("&")[1].search("access_token=") === 0) {
      let Message = "";
      const request = new XMLHttpRequest();
      // beautiful code?
      // i agree : )
      // but obviously i plan on specializing this module
      // make it specifically for this website with ratelimits and everything

      let header = new Headers();
      header.append("Origin", window.location);
      header.append(
        "Authorization",
        "Bearer " + window.location.href.split("&")[1].substr(13)
      );

      fetch("http://discordapp.com/api/users/@me", { headers: header })
        .then(
          (data) =>
            function (data) {
              console.log(data);
            }
        )
        .catch((error) => console.log(error));

      request.open("POST", "https://generalprox.herokuapp.com");
      request.setRequestHeader("Content-type", "application/json");
      request.setRequestHeader("target", "DW_1");
      request.setRequestHeader("origin", window.location.origin);
      request.setRequestHeader("authorization", "h : )");

      for (const v of SelectedItems) {
        if (v.name !== "Nothing") {
          Message = Message + v.name + " - ";
        }
      }
      /*request.send(
        JSON.stringify({
          content: Message.substr(0, Message.length - 3),
          avatar_url:
            "https://cdn.discordapp.com/avatars/317758801010884613/bcafc5204bc0445611a3c3263b03fc27.png"
        })
      );*/
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
