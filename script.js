const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

let photosArray = [];

// To reduce first time loading time
let initialLoad = true;

// Unsplah API
let requestImagesCount = 5;
const apiKey = 'BB95KHOXMfMye2M3mNGzKclu6xwR-ICOLPGRwAfm8Y0';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${requestImagesCount}`

// Check if all images are loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        imagesLoaded = 0;
        if (initialLoad) {
            initialLoad = false;
            requestImagesCount = 30;
        }
    }
}
// Helper function to set attributes on DOM Elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create Elements for Links & Photos, Add to DOM
function displayPhotos() {
    totalImages = photosArray.length;
    photosArray.forEach((photo)=> {
        // Create <a> to link to Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        })
        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })
        // Event listener, check when each image is finished loading
        img.addEventListener('load', imageLoaded);
        // Put <img> inside <a>, then put both inside photoContainer Element
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
       displayPhotos();
        
    } catch (error) {
        console.log(error);
    }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
});

// On Load
getPhotos();