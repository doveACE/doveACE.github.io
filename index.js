let Items;
let Tiers;
let SelectedTier;
let SelectedType;
let SelectedTerm = "";
let SelectedItems = [];
let ItemDisplays = [];
let LoginToken = localStorage.getItem("Token");
let LoggedIn = false;

if (
  window.location.href.split("&")[1] &&
  window.location.href.split("&")[1].substr(13)
) {
  localStorage.setItem("Token", window.location.href.split("&")[1].substr(13));
  window.location.hash = "";
  LoginToken = localStorage.getItem("Token");
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

const GenerateList = async function () {
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
    if (LoggedIn === true) {
      // beautiful code?
      // i agree : )
      // but obviously i plan on specializing this module
      // make it specifically for this website with ratelimits and everything

      const Items = [];

      for (const v of SelectedItems) {
        if (v.name !== "Nothing") {
          Items.push(v.real_name);
        }
      }

      fetch("https://generalprox.herokuapp.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          target: "K"
        },
        body: JSON.stringify([localStorage.getItem("Token"), Items])
      }).then(function (response) {
        if (response.status === 200) {
          alert(
            "Your request has been posted!\nCheck back later for confirmation to complete the trade."
          );
        } else if (response.status === 429) {
          alert(
            "Sorry, but you've posted too many requests!\nTry again later."
          );
        } else {
          alert("Sorry, but an unknown error has occured!\nTry again later.");
        }
      });
    } else {
      alert("Please autheticate via the banner at the top!");
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
  fetch("https://discordapp.com/api/users/@me", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + LoginToken
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.message !== "401: Unauthorized") {
        LoggedIn = true;
        document.getElementById("banner").innerHTML =
          `Verified as <b>` +
          data.username +
          `#` +
          data.discriminator +
          `</b> - <a href='' onclick='logout()'>Logout?</a>`;
      } else {
        document.getElementById("banner").innerHTML =
          `It appears you are not <a href='https://discord.com/api/oauth2/authorize?client_id=970683445934182470&redirect_uri=` +
          window.origin +
          `&response_type=token&scope=identify'>verified with discord</a>!`;
      }
    });
});

let logout = function () {
  localStorage.setItem("Token", null);
};
