const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const app = express();

const metaTags = {
  "/": {
    title: "Home Page",
    description: "Home page description.",
    image: "https://github.com/manicdon7/ezpass/blob/master/front/public/home.png?raw=true",
    url: "https://ezpass.vercel.app/"
  },
  "/host": {
    title: "Host Page",
    description: "Host page description.",
    image: "https://github.com/manicdon7/ezpass/blob/master/front/public/Screenshot%202024-05-15%20115209.png?raw=true",
    url: "https://ezpass.vercel.app/host"
  }
  // Add more routes and meta tags as needed
};

const getMetaTags = (url) => metaTags[url] || metaTags["/"];

app.use(express.static(path.resolve(__dirname, './build')));

app.get('/*', (req, res) => {
  const filePath = path.resolve(__dirname, './build', 'index.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html file:', err);
      return res.status(500).send('An error occurred');
    }

    const meta = getMetaTags(req.path);
    data = data
      .replace(/__TITLE__/g, meta.title)
      .replace(/__DESCRIPTION__/g, meta.description)
      .replace(/__IMAGEURL__/g, meta.image)
      .replace(/__URL__/g, meta.url);

    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
