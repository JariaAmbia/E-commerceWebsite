// ========== SECTION 1: FEATURED PRODUCTS (4 items per category) ==========
Promise.all([
    fetch("https://dummyjson.com/products/category/mens-shirts?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-dresses?limit=10").catch(() => ({products: []})),
    fetch("https://dummyjson.com/products/category/mens-shoes?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-shoes?limit=10").then(res => res.json())
])
.then(([shirts, dresses, shoes, womensShoes]) => {
    const container = document.getElementById("productContainer");
    if (!container) {
        console.error("productContainer element not found!");
        return;
    }
    container.innerHTML = '';

    // Take only 4 items from each category
    const shirtsProducts = shirts.products?.slice(0, 4) || [];
    const dressesProducts = dresses.products?.slice(0, 4) || [];
    const shoesProducts = shoes.products?.slice(0, 4) || [];
    const womensShoesProducts = womensShoes.products?.slice(0, 4) || [];
    
    // Combine all products
    const allProducts = [
        ...shirtsProducts,
        ...dressesProducts,
        ...shoesProducts,
        ...womensShoesProducts
    ];
    
    // Display all products
    allProducts.forEach(product => {
        const isShopPage = window.location.pathname.includes('shop.html');
        
        let productColors = [];
        let showColors = isShopPage;
        
        if (showColors) {
            if (product.category === 'mens-shirts') {
                productColors = ["green", "yellow", "orange", "red"];
            } else if (product.category === 'womens-dresses') {
                productColors = ["pink", "purple", "blue", "yellow"];
            } else if (product.category === 'mens-shoes') {
                productColors = ["black", "brown", "white", "blue"];
            } else if (product.category === 'womens-shoes') {
                productColors = ["red", "black", "gold", "silver"];
            } else {
                productColors = ["green", "blue", "red", "yellow"];
            }
        }
        
        let displayCategory = product.category;
        if (product.category === 'mens-shirts') displayCategory = "Men's Shirts";
        else if (product.category === 'mens-shoes') displayCategory = "Men's Shoes";
        else if (product.category === 'womens-dresses') displayCategory = "Women's Dresses";
        else if (product.category === 'womens-shoes') displayCategory = "Women's Shoes";

        const productCard = `
        <div class="pro">
            <img src="${product.images[0]}" alt="${product.title}" class="product-image">
            <div class="des">
                <span>${displayCategory}</span>
                <h5>${product.title}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>$${product.price}</h4>
                ${showColors ? `<div class="product-colors">
                    ${productColors.map(color => `<span class="color-dot" style="background-color: ${color};"></span>`).join('')}
                </div>` : ''}
                <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>
            </div>
        </div>
        `;
        
        container.innerHTML += productCard;
    });
})
.catch(error => {
    console.error('Error fetching products:', error);
    const container = document.getElementById("productContainer");
    if (container) {
        container.innerHTML = '<p style="color: red;">Sorry, failed to load products. Please try again later.</p>';
    }
});

// ========== SECTION 2: NEW ARRIVALS (8 products from NEW categories - Bags, Watches, Sunglasses, Jewelry) ==========
document.addEventListener('DOMContentLoaded', function() {
    // Get products from completely different categories
    Promise.all([
        fetch("https://dummyjson.com/products/category/womens-bags?limit=4").then(res => res.json()),
        fetch("https://dummyjson.com/products/category/mens-watches?limit=4").then(res => res.json()),
        fetch("https://dummyjson.com/products/category/sunglasses?limit=4").then(res => res.json()),
        fetch("https://dummyjson.com/products/category/womens-jewellery?limit=4").then(res => res.json())
    ])
    .then(([bags, watches, sunglasses, jewellery]) => {
        const container = document.getElementById("newArrivalsContainer");
        if (!container) {
            console.error("newArrivalsContainer element not found!");
            return;
        }
        
        container.innerHTML = '';
        
        // Take 2 from each category to get total 8 products
        const allNewArrivals = [
            ...(bags.products?.slice(0, 2) || []),
            ...(watches.products?.slice(0, 2) || []),
            ...(sunglasses.products?.slice(0, 2) || []),
            ...(jewellery.products?.slice(0, 2) || [])
        ];
        
        // Display products
        allNewArrivals.forEach(product => {
            // Generate star rating
            const rating = Math.round(product.rating);
            let stars = '';
            for(let i = 1; i <= 5; i++) {
                if(i <= rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            
            // Format category name nicely
            let categoryLabel = product.category;
            if (product.category === 'womens-bags') categoryLabel = "Women's Bag";
            else if (product.category === 'mens-watches') categoryLabel = "Men's Watch";
            else if (product.category === 'sunglasses') categoryLabel = "Sunglasses";
            else if (product.category === 'womens-jewellery') categoryLabel = "Jewelry";
            
            const productCard = `
            <div class="pro">
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                <div class="des">
                    <span>${categoryLabel}</span>
                    <h5>${product.title.substring(0, 30)}${product.title.length > 30 ? '...' : ''}</h5>
                    <div class="star">
                        ${stars}
                    </div>
                    <h4>$${product.price}</h4>
                    <a href="#" class="cart"><i class="fa-solid fa-cart-shopping"></i></a>
                </div>
            </div>
            `;
            
            container.innerHTML += productCard;
        });
        
        console.log(`New Arrivals loaded successfully! (${allNewArrivals.length} products from bags, watches, sunglasses, jewelry)`);
    })
    .catch(error => {
        console.error("Error loading new arrivals:", error);
        const container = document.getElementById("newArrivalsContainer");
        if (container) {
            container.innerHTML = '<p style="color: red; text-align: center;">Failed to load new arrivals. Please try again later.</p>';
        }
    });
});

// ========== LIGHTBOX FUNCTIONALITY ==========
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const counter = document.getElementById("lightbox-counter");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    
    const productTitle = document.getElementById("product-title");
    const productCategory = document.getElementById("product-category");
    const productDescription = document.getElementById("product-description");
    const productPrice = document.getElementById("product-price");
    const productStars = document.getElementById("product-stars");
    const productRating = document.getElementById("product-rating");
    const productStock = document.getElementById("product-stock");
    
    let currentImages = [];
    let currentIndex = 0;
    let currentProduct = null;

    document.addEventListener("click", function(e) {
        if (e.target.classList.contains('product-image')) {
            const productDiv = e.target.closest('.pro');
            
            const title = productDiv.querySelector('h5').textContent;
            const category = productDiv.querySelector('.des span').textContent;
            const price = productDiv.querySelector('h4').textContent;
            
            currentProduct = {
                title: title,
                category: category,
                price: price,
                description: "Premium quality product with excellent craftsmanship. Made from high-quality materials for long-lasting comfort and style.",
                rating: 4.5,
                stock: Math.floor(Math.random() * 20) + 1
            };
            
            const allImages = productDiv.querySelectorAll('img[src]');
            currentImages = [...new Set(Array.from(allImages).map(img => img.src))];
            
            currentIndex = currentImages.indexOf(e.target.src);
            if (currentIndex === -1) currentIndex = 0;
            
            showImage(currentIndex);
            updateProductDetails(currentProduct);
            lightbox.style.display = "block";
        }
    });
    
    // Color dot click functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('color-dot')) {
            const isShopPage = window.location.pathname.includes('shop.html') || 
                              window.location.href.includes('shop.html');
            
            if (!isShopPage) {
                e.target.style.transform = 'scale(1.2)';
                setTimeout(() => e.target.style.transform = '', 200);
                return;
            }
            
            const productDiv = e.target.closest('.pro');
            const productImg = productDiv.querySelector('.product-image');
            
            let currentSrc = productImg.src;
            let match = currentSrc.match(/\/(\d+)\.webp$/);
            
            if (match) {
                let currentIndex = parseInt(match[1]);
                let nextIndex = (currentIndex % 4) + 1;
                let newSrc = currentSrc.replace(`/${currentIndex}.webp`, `/${nextIndex}.webp`);
                
                productImg.style.opacity = '0.5';
                setTimeout(() => {
                    productImg.src = newSrc;
                    productImg.style.opacity = '1';
                }, 150);
            } else {
                productImg.style.transform = 'scale(0.95)';
                setTimeout(() => productImg.style.transform = '', 200);
            }
        }
    });

    function showImage(index) {
        if (currentImages.length > 0) {
            lightboxImg.src = currentImages[index];
            counter.textContent = `${index + 1} / ${currentImages.length}`;
            updateThumbnails(index);
            
            if (prevBtn && nextBtn) {
                prevBtn.style.display = currentImages.length > 1 ? "block" : "none";
                nextBtn.style.display = currentImages.length > 1 ? "block" : "none";
            }
        }
    }

    function updateProductDetails(product) {
        if (!product) return;
        
        productTitle.textContent = product.title;
        productCategory.textContent = product.category;
        productDescription.textContent = product.description;
        productPrice.textContent = product.price;
        
        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        productStars.textContent = stars;
        productRating.textContent = `(${product.rating} stars)`;
        
        if (product.stock > 10) {
            productStock.textContent = `✓ In Stock (${product.stock} available)`;
            productStock.className = 'stock-status';
        } else if (product.stock > 0) {
            productStock.textContent = `⚠ Only ${product.stock} left in stock`;
            productStock.className = 'stock-status low-stock';
        } else {
            productStock.textContent = '✗ Out of Stock';
            productStock.className = 'stock-status out-stock';
        }
    }

    function updateThumbnails(activeIndex) {
        if (!thumbnailContainer) return;
        
        thumbnailContainer.innerHTML = '';
        currentImages.forEach((imgUrl, idx) => {
            const thumb = document.createElement('img');
            thumb.src = imgUrl;
            thumb.classList.add('thumbnail');
            if (idx === activeIndex) {
                thumb.classList.add('active-thumbnail');
            }
            
            thumb.onclick = function() {
                currentIndex = idx;
                showImage(currentIndex);
            };
            
            thumbnailContainer.appendChild(thumb);
        });
    }

    if (nextBtn) {
        nextBtn.onclick = function() {
            if (currentImages.length > 0) {
                currentIndex = (currentIndex + 1) % currentImages.length;
                showImage(currentIndex);
            }
        };
    }

    if (prevBtn) {
        prevBtn.onclick = function() {
            if (currentImages.length > 0) {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                showImage(currentIndex);
            }
        };
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            lightbox.style.display = "none";
        };
    }

    lightbox.onclick = function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    };

    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === "block") {
            if (e.key === 'Escape') {
                lightbox.style.display = "none";
            } else if (e.key === 'ArrowRight') {
                if (nextBtn) nextBtn.onclick();
            } else if (e.key === 'ArrowLeft') {
                if (prevBtn) prevBtn.onclick();
            }
        }
    });
});

// ========== MOBILE MENU FUNCTIONALITY ==========
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if(bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}
if(close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}