import axios from "axios";
import { data } from "./data.js";
import download from "download";
import { generateImage } from "./genearteImage.js";

let subscriptionKey = process.env.BING_API_KEY;
let url = `https://api.bing.microsoft.com/v7.0/images/search`;
let imageUrls = [];

function get_url_extension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}

async function downloadImage(term = "") {
  try {
    const response = await axios.get(
      `${url}?q=${encodeURIComponent(term)}&count=1&height=200`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      }
    );
    if (response?.data?.value?.length) {
      const urls = response?.data?.value.map((r) => ({
        url: r.contentUrl,
        name: `${term.replace(/\s/g, "").toLowerCase()}.${get_url_extension(
          r.contentUrl
        )}`,
      }));
      imageUrls = [...imageUrls, ...urls];
    }
  } catch (error) {
    console.log(error?.message);
  }
}

export async function processImages() {
  for (const { food } of data.slice(0, 2)) {
    await downloadImage(food);
  }

  if (imageUrls.length) {
    for (const { url, name } of imageUrls) {
      console.log(`Downloading ${name} image from ${url}`.green);
      await download(url, "images", {
        filename: name,
      });
      await generateImage(`images/${name}`, name);
    }
  }
}
