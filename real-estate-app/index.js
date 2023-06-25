// contentful api access

const client = contentful.createClient({
  space: "8phiap0ji3ws",
  environment: "master", // defaults to 'master' if not set
  accessToken: "fa67KghWnFBRCxON6TpXDRxeqyJSRNR2OQdGUB0PM_I",
});

const header = document.querySelector("header");
const logo = document.querySelector("#logo");
const navMenu = document.querySelector("#nav-menu");
const navToggle = document.querySelector("#nav-toggle");
const carousle = document.querySelector("#properties-slider");
const icons = document.querySelectorAll(".container i");

// const clonedFirstDiv = firstDiv.cloneNode(true);
// carousle.appendChild(clonedFirstDiv);
// const sliderchild = carousle.childElementCount;

//added effects to header on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.style.background = "white";
    header.style.padding = "0.5rem 0";
    navMenu.classList.add("is-sticky");
    logo.style.color = "black";
  } else {
    header.style.background = "transparent";
    navMenu.classList.remove("is-sticky");
    logo.style.color = "";
    header.style.padding = "";
  }
});

//added smooth scrolling to sections
document.addEventListener("DOMContentLoaded", function () {
  var anchorLinks = document.querySelectorAll('header a[href^="#"]');
  for (var i = 0; i < anchorLinks.length; i++) {
    anchorLinks[i].addEventListener("click", function (e) {
      e.preventDefault();
      var targetElement = document.querySelector(this.getAttribute("href"));
      var targetOffsetTop = targetElement.offsetTop;

      window.scrollTo({
        top: targetOffsetTop - 80,
        behavior: "smooth",
      });
    });
  }
});

// toggle functionality of navbar
const properties = document.querySelector("#properties-slider");
navToggle.addEventListener("click", () => {
  navMenu.style.right = 0;
});

// properties class
class Properties {
  async getProperties() {
    try {
      let contentful = await client.getEntries({
        content_type: "estateProperties",
      });
      let properties = contentful.items;
      // console.log(properties);
      properties = properties.map((property) => {
        const image = property.fields.propertyImg.fields.file.url;
        const id = property.sys;
        const { address, price, area, bath, beds } = property.fields;
        return { image, id, address, price, area, bath, beds };
      });
      return properties;
    } catch (error) {}
  }
}
class SliderUI {
  displayslider(properties) {
    // console.log(properties);
    let slider = "";
    properties.forEach((property) => {
      slider += `<div class="properties-carousle">
              <img src=${property.image} alt="" />
              <div class="property-details">
                <p class="price">Rs ${property.price}</p>
                <span class="beds">${property.beds} beds</span>
                <span class="baths">${property.bath} baths</span>
                <span class="sqft">${property.area} sqft.</span>
                <address>${property.address}</address>
              </div>
            </div>`;
    });
    carousle.innerHTML = slider;

    //scroll property slider
    const firstDiv = carousle.querySelectorAll("div")[0];
    const firstDivWidth = firstDiv.clientWidth + 20;

    const handleIconClick = (icon) => {
      clearInterval(intervalID);
      const scrollAmount = icon.id == "left" ? -firstDivWidth : firstDivWidth;
      // Scroll the carousel left or right based on the clicked icon
      carousle.scrollBy({ left: scrollAmount, behavior: "smooth" });
      //  set interval again
      intervalID = setInterval(() => {
        carousle.scrollBy({ left: firstDivWidth, behavior: "smooth" });
      }, 3000);
    };

    // Add click event listeners to carousel icons
    icons.forEach((icon) => {
      icon.addEventListener("click", () => handleIconClick(icon));
    });

    let intervalID = setInterval(() => {
      carousle.scrollBy({ left: firstDivWidth, behavior: "smooth" }); // Scroll the carousel by the width of a single item
    }, 3000);

    // Function to handle infinite scrolling
    const handleInfiniteScroll = () => {
      if (carousle.scrollLeft + carousle.clientWidth >= carousle.scrollWidth) {
        // If the scroll position reaches the end of the carousel
        carousle.scrollTo({ left: 0, behavior: "smooth" });
      }
    };

    // Add a scroll event listener to the carousel
    carousle.addEventListener("scroll", handleInfiniteScroll);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const sliderui = new SliderUI();
  const properties = new Properties();
  properties.getProperties().then((properties) => {
    sliderui.displayslider(properties);
  });
});
