const apiShortyLink = "https://api.shrtco.de/v2/shorten?url=";
const urlInputField = document.getElementById("url");
const urlsubmitButton = document.getElementById("shotenButton");
const errorMassege = document.getElementById("errorMassege");
const styleinputLinkDiv = document.getElementById("inputLinkDiv");
const generatedContiner = document.getElementById("listDiv");
let ShortLinkList = JSON.parse(localStorage.getItem("shorty")) || [];
const getShortLinkData = async (url) => {
  try {
    const response = await axios.get(apiShortyLink + url);
    return response.data.result;
  } catch (error) {
    console.error(error);
  }
};

urlsubmitButton.addEventListener("click", () => {
  addShortLink(urlInputField.value);
});

const addShortLink = async (url) => {
  if (url) {
    let shortenUrl = await getShortLinkData(url);
    popErrorText("");
    if (shortenUrl) {
      ShortLinkList.push(shortenUrl);
      generatedContinerList(ShortLinkList);
      localStorage.setItem("shorty", JSON.stringify(ShortLinkList));
    } else {
      popErrorText("Please enter a real link!", true);
    }
  } else {
    popErrorText("Empty field", true);
  }
};

const popErrorText = (message, toPop = false) => {
  errorMassege.innerText = "";
  urlInputField.value = "";
  if (toPop) {
    errorMassege.innerText = message;
    errorMassege.style.display = "flex";
    styleinputLinkDiv.style.paddingBottom = "10px";
    urlInputField.style.border = "red solid 2px";
  } else {
    errorMassege.style.display = "none";
    window.innerWidth > 800
      ? (styleinputLinkDiv.style.padding = "40px")
      : (styleinputLinkDiv.style.padding = "15px");
    urlInputField.style.border = "none";
  }
};

const generatedContinerList = (data = []) => {
  generatedContiner.innerHTML = "";
  data.forEach((element) =>
    generatedContiner.appendChild(linkGeneratedDiv(element))
  );
};

const linkGeneratedDiv = (data) => {
  let card = document.createElement("div");
  card.classList.add("linkGeneratedDiv");

  let originalUrl = document.createElement("div");
  originalUrl.classList.add("originalUrl");
  originalUrl.innerText = data.original_link;

  let linkAndCopy = document.createElement("div");
  linkAndCopy.classList.add("newLinkAndCopy");

  let shortLink = document.createElement("p");
  shortLink.classList.add("shortLink");
  shortLink.innerText = data.full_short_link;

  let copyButton = document.createElement("button");
  copyButton.classList.add("copy");
  copyButton.innerText = "Copy";
  copyButton.addEventListener("click", () => {
    copyButton.innerText = "Copyed!";
    copyButton.style.backgroundColor = "#3b2f53";
    navigator.clipboard.writeText(data.full_short_link);
    setTimeout(() => {
      copyButton.innerText = "Copy";
      copyButton.style.backgroundColor = "#2dd1d3";
    }, 2000);
  });
  linkAndCopy.appendChild(shortLink);
  linkAndCopy.appendChild(copyButton);

  card.appendChild(originalUrl);
  card.appendChild(linkAndCopy);

  return card;
};
generatedContinerList(ShortLinkList);
