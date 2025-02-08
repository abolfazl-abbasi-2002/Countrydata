'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal
// https://restcountries.com/v3.1/name/iran

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

// ///////////////////////////////////

// Ajax

const rendercountry = function (data, classname = '') {
  const html = `<article class="country ${classname}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
   `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  const html = `<p style="color:red">${msg}</p>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

// Xml

// const getCountryneighbour = function (country) {
//   // Ajax call 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     // request country
//     rendercountry(data);

//     // request country neighbours
//     // 1
//     // const [neighbours] = data.borders;
//     // 2
//     const neighbours = data.borders;
//     if (!neighbours) return;
//     // Ajax call 2
//     // 1
//     // const request2 = new XMLHttpRequest();
//     //   request2.open('GET', `https://restcountries.com/v2/alpha/${neighbours}`);
//     //   request2.send();
//     //   request2.addEventListener('load', function () {
//     //     const data2 = JSON.parse(this.responseText);
//     //     console.log(data2);
//     //     rendercountry(data2,"neighbour");
//     //   });
//     // 2
//     neighbours.forEach(element => {
//       const request2 = new XMLHttpRequest();
//       request2.open('GET', `https://restcountries.com/v2/alpha/${element}`);
//       request2.send();
//       request2.addEventListener('load', function () {
//         const data2 = JSON.parse(this.responseText);
//         console.log(data2);
//         rendercountry(data2, 'neighbour');
//       });
//     });
//   });
// };
// // getCountryneighbour('usa');
// getCountryneighbour('iran');

// fetch api
// const getCountryData = function (country) {
//   const request = fetch(`https://restcountries.com/v2/name/${country}`);
//   request
//     .then(response => {
//       creatError(response);
//       return response.json();
//     })
//     .then(data => {
//       // console.log(data[0]);
//       //   request country
//       rendercountry(data[0]);
//       // request country neighbours
//       const neighbours = data[0]?.borders;
//       neighbours.forEach(element => {
//         const request2 = fetch(`https://restcountries.com/v2/alpha/${element}`);
//         request2
//           .then(response => {
//             creatError(response);
//             return response.json();
//           })
//           .then(data => rendercountry(data, 'neighbour'));
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       renderError(`Somthing went wrong : ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

const GetJSON = function (url, errorMsg = 'Somthing went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};
const getCountryData = function (country) {
  GetJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      //   request country
      rendercountry(data[0]);
      // request country neighbours
      const neighbours = data[0]?.borders;
      if (!neighbours) {
        throw new Error('No neighbours found');
      }
      neighbours.forEach(element => {
        GetJSON(
          `https://restcountries.com/v2/alpha/${element}`,
          'Neighbours not found'
        )
          .then(data => rendercountry(data, 'neighbour'))
          .catch(err => {
            console.log(err);
            renderError(`Somthing went wrong : ${err.message}. Try again!`);
          });
      });
    })
    .catch(err => {
      console.error(err);
      renderError(`Somthing went wrong : ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
// btn.addEventListener('click', () => {
//   getCountryData('iran');
// });
// getCountryData('fafafafaf'); //error
// getCountryData('australia'); //error neighbours

// challenge 1

// const whereAmI = function (lat, lng) {
//   fetch(
//     `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//     // `https://geocode.xyz/${lat},${lng}?geoit=json`
//   )
//     .then(res => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`You are in ${data.city}, ${data.countryCode}`);

//       return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Country not found (${res.status})`);

//       return res.json();
//     })
//     .then(data => {
//       getCountryData(data[0].name);
//     })
//     .catch(err => console.error(`${err.message} 💥`));
// };
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// whereAmI("Sdsada");

// callback hell
// setTimeout(() => {
//   console.log('timeout 1');
//   setTimeout(() => {
//     console.log('timeout 2');
//     setTimeout(() => {
//       console.log('timeout 3');
//       setTimeout(() => {
//         console.log('timeout 4');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

// promis loop
// console.log('timer started');
// setTimeout(() => {
//   console.log('after 0 second');
// }, 0);
// Promise.resolve('this comes eaeler').then(res => console.log(res));
// Promise.resolve('this comes eaeler2').then(res => {
//   for (let i = 0; i < 100000; i++) {}
//   console.log(res);
// });
// console.log('timer end');

// promise

// const bet = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     if (Math.random() >= 0.5) {
//       resolve('success');
//     } else {
//       reject(new Error('fail'));
//     }
//   }, 2000);
// })
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

// const wait = function (second) {
//   return new Promise(resolve => {
//     setTimeout(resolve, second * 1000);
//   });
// };

// wait(1)
//   .then(() => {
//     console.log('wait 1 second');
//     return wait(2);
//   })
//   .then(() => {
//     console.log('wait 2 second');
//     return wait(3);
//   })
//   .then(() => {
//     console.log('wait 3 second');
//     return wait(4);
//   })
//   .then(() => {
//     console.log('wait 4 second');
//   });

// example

// const getPosition = function () {
//   return new Promise((resolve, reject) => {
//     // 1
//     // navigator.geolocation.getCurrentPosition(
//     //   position => resolve(position),
//     //   err => reject(err)
//     // );
//     // 2
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };
// getPosition()
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

// function whereAmI() {
//   getPosition().then(pos => {
//     const { latitude: lat, longitude: lng } = pos.coords;
//     fetch(
//       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//       // `https://geocode.xyz/${lat},${lng}?geoit=json`
//     )
//       .then(res => {
//         if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
//         return res.json();
//       })
//       .then(data => {
//         console.log(`You are in ${data.city}, ${data.countryCode}`);

//         return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
//       })
//       .then(res => {
//         if (!res.ok) throw new Error(`Country not found (${res.status})`);

//         return res.json();
//       })
//       .then(data => {
//         getCountryData(data[0].name);
//       })
//       .catch(err => console.error(`${err.message} 💥`));
//   });
// }
// // btn.addEventListener('click', whereAmI);

// challenge 2
// 1
// const creatImage = function (imgPath) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const img = document.createElement('img');
//       img.src = imgPath;
//       img.addEventListener('load', () => {
//         resolve(img);
//         document.querySelector('.images').appendChild(img);
//       });
//       img.addEventListener('error', () => {
//         reject(new Error(`Error loading ${imgPath}`));
//       });
//     }, 3000);
//   });
// };
// // let currentImg;
// creatImage('img/img-1.jpg')
//   .then(img => {
//     setTimeout(() => img.remove(), 3000);
//     return creatImage('img/img-2.jpg');
//   })
//   .then(img => {
//     setTimeout(() => img.remove(), 3000);
//     return creatImage('img/img-3.jpg');
//   })
//   .then(img => setTimeout(() => img.remove(), 3000))
//   .catch(err => console.error(err));

// 2
// const wait = function (second) {
//   return new Promise(resolve => {
//     setTimeout(resolve, second * 1000);
//   });
// };
// const creatImage = function (imgPath) {
//   return new Promise((resolve, reject) => {
//     const img = document.createElement('img');
//     img.src = imgPath;
//     img.addEventListener('load', () => {
//       resolve(img);
//       document.querySelector('.images').appendChild(img);
//     });
//     img.addEventListener('error', () => {
//       reject(new Error(`Error loading ${imgPath}`));
//     });
//   });
// };

// let currentImg;
// creatImage('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return creatImage('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return creatImage('img/img-3.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => (currentImg.style.display = 'none'))
//   .catch(err => console.error(err));

// await async
const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    const curPos = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    const dataCurPos = await curPos.json();
    if (!curPos.ok) throw new Error('Problem getting country');
    getCountryData(dataCurPos.countryName);
    return `You are in ${dataCurPos.city}, ${dataCurPos.countryCode}`;
  } catch (err) {
    console.error(err);
    renderError(`Somthing went wrong: ${err.message}`);
    throw err;
  }
};
// whereAmI();
btn.addEventListener('click', whereAmI);

document.querySelector('.btn').addEventListener('click', () => {
  const data = String(document.querySelector('.data').value);
  getCountryData(data);
});
// Running Promises in Parallel
// const get3Countries = async function (c1, c2, c3) {
//   try {
//     // const [data1] = await getJSON(
//     //   `https://restcountries.com/v2/name/${c1}`
//     // );
//     // const [data2] = await getJSON(
//     //   `https://restcountries.com/v2/name/${c2}`
//     // );
//     // const [data3] = await getJSON(
//     //   `https://restcountries.com/v2/name/${c3}`
//     // );
//     // console.log([data1.capital, data2.capital, data3.capital]);

//     const data = await Promise.all([
//       GetJSON(`https://restcountries.com/v2/name/${c1}`),
//       GetJSON(`https://restcountries.com/v2/name/${c2}`),
//       GetJSON(`https://restcountries.com/v2/name/${c3}`),
//     ]);
//     console.log(data.map(d => d[0].capital));
//   } catch (err) {
//     console.error(err);
//   }
// };
// get3Countries('portugal', 'canada', 'iran');

// const timeOut = function (sec) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error('Timeout is took along'));
//     }, sec * 1000);
//   });
// };

// Promise.race([GetJSON(`https://restcountries.com/v2/name/iran`), timeOut(0.3)])
//   .then(r => console.log(r[0]))
//   .catch(err => console.error(err));

// Promise.allSettled([
//   Promise.resolve('success1'),
//   Promise.reject('faild1'),
//   Promise.resolve('success2'),
// ])
//   .then(r => console.log(...r))
//   .catch(err => console.error(err));

// Promise.all([
//   Promise.resolve('success1'),
//   Promise.reject('faild1'),
//   Promise.resolve('success2'),
// ])
//   .then(r => console.log(...r))
//   .catch(err => console.error(err));

// Promise.any([
//   Promise.reject('faild1'),
//   Promise.resolve('success1'),
//   Promise.resolve('success2'),
// ])
//   .then(r => console.log(...r))
//   .catch(err => console.error(err));

// challenge 3

// const wait = function (second) {
//   return new Promise(resolve => {
//     setTimeout(resolve, second * 1000);
//   });
// };
// const creatImage = function (imgPath) {
//   return new Promise((resolve, reject) => {
//     const img = document.createElement('img');
//     img.src = imgPath;
//     img.addEventListener('load', () => {
//       resolve(img);
//       document.querySelector('.images').appendChild(img);
//     });
//     img.addEventListener('error', () => {
//       reject(new Error(`Error loading ${imgPath}`));
//     });
//   });
// };
// const loadNPause = async function () {
//   try {
//     let img = await creatImage('img/img-1.jpg');
//     await wait(2);
//     img.style.display = 'none';
//     img = await creatImage('img/img-2.jpg');
//     await wait(2);
//     img.style.display = 'none';
//     img = await creatImage('img/img-3.jpg');
//     await wait(2);
//     img.style.display = 'none';
//   } catch (err) {
//     console.error(err.message);
//   }
// };
// loadNPause();
// const loadAll = async function (imgArr) {
//   try {
//     const imgs = imgArr.map(async imgPath => await creatImage(imgPath));
//     console.log(imgs);
//     const imgEl = await Promise.all(imgs);
//     console.log(imgEl);
//     imgEl.forEach(img => img.classList.add('parallel'));
//   } catch (err) {
//     console.error(err.message);
//   }
// };
// const imgs = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];
// loadAll(imgs);
