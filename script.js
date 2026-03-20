// Get multiple clothing categories
Promise.all([
    fetch("https://dummyjson.com/products/category/mens-shirts?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-dresses?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/mens-shoes?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-shoes?limit=10").then(res => res.json())
])
.then(([shirts, dresses, shoes, womensShoes]) => {
    const container = document.getElementById("productContainer"); // Kept as productContainer
    container.innerHTML = '';

    // Take only 4 items from each category
    const shirtsProducts = shirts.products.slice(0, 4);
    const dressesProducts = dresses.products.slice(0, 4);
    const shoesProducts = shoes.products.slice(0, 4);
    const womensShoesProducts = womensShoes.products.slice(0, 4);
    
    // Combine all products
    const allProducts = [
        ...shirtsProducts,
        ...dressesProducts,
        ...shoesProducts,
        ...womensShoesProducts
    ];
    
    // Display all products without category headings
    allProducts.forEach(product => {
        // Format category name for display
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
// Lightbox functionality with product details
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const counter = document.getElementById("lightbox-counter");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    
    // Product details elements
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

    // Open lightbox when clicking product image
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains('product-image')) {
            const productDiv = e.target.closest('.pro');
            
            // Get all product data from the div
            const title = productDiv.querySelector('h5').textContent;
            const category = productDiv.querySelector('.des span').textContent;
            const price = productDiv.querySelector('h4').textContent;
            
            // Store current product data
            currentProduct = {
                title: title,
                category: category,
                price: price,
                description: "Premium quality product with excellent craftsmanship. Made from high-quality materials for long-lasting comfort and style. Perfect for any occasion.",
                rating: 4.5,
                stock: Math.floor(Math.random() * 20) + 1
            };
            
            // Get images
            const allImages = productDiv.querySelectorAll('img[src]');
            currentImages = [...new Set(Array.from(allImages).map(img => img.src))];
            
            currentIndex = currentImages.indexOf(e.target.src);
            if (currentIndex === -1) currentIndex = 0;
            
            showImage(currentIndex);
            updateProductDetails(currentProduct);
            lightbox.style.display = "block";
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
        
        // Generate stars
        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        productStars.textContent = stars;
        
        productRating.textContent = `(${product.rating} stars)`;
        
        // Stock status
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

    // Navigation buttons
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

    // Close button
    if (closeBtn) {
        closeBtn.onclick = function() {
            lightbox.style.display = "none";
        };
    }

    // Click outside to close
    lightbox.onclick = function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    };

    // Keyboard navigation
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
// Wait for HTML to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Fetch clothes from API
    fetch("https://fakestoreapi.com/products/category/women's%20clothing")
    .then(res => res.json())
    .then(womenClothes => {
        
        fetch("https://fakestoreapi.com/products/category/men's%20clothing")
        .then(res => res.json())
        .then(menClothes => {
            
            // Combine both categories
            const allClothes = [...womenClothes, ...menClothes];
            
            // Take first 8 items
            const selected = allClothes.slice(0, 8);
            
            const container = document.getElementById("newArrivalsContainer");
            
            // Clear container
            container.innerHTML = '';
            
            // Display products
            selected.forEach(product => {
                
                // Generate star rating
                const rating = Math.round(product.rating.rate);
                let stars = '';
                for(let i = 1; i <= 5; i++) {
                    if(i <= rating) {
                        stars += '<i class="fas fa-star"></i>';
                    } else {
                        stars += '<i class="far fa-star"></i>';
                    }
                }
                
                const productCard = `
                <div class="pro">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="des">
                        <span>${product.category}</span>
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
            
            console.log("Products loaded successfully!");
        })
        .catch(error => {
            console.error("Error loading men's clothes:", error);
        });
        
    })
    .catch(error => {
        console.error("Error loading women's clothes:", error);
        
        // Fallback products if API fails
        const container = document.getElementById("newArrivalsContainer");
        container.innerHTML = '<p style="color: red; text-align: center;">Failed to load products. Please try again later.</p>';
    });

});