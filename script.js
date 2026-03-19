// Get multiple clothing Catagories
Promise.all([
    fetch("https://dummyjson.com/products/category/mens-shirts?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-dresses?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/mens-shoes?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-shoes?limit=10").then(res => res.json())
])
.then(([shirts, dresses, shoes, womensShoes]) => {
    const container = document.getElementById("productContainer");
    container.innerHTML = '';

    // Helper function to add products
    function addCategoryProducts(products, categoryName) {
        if (products.length > 0) {
            // Add category heading
            container.innerHTML += `<h3 class="category-heading">${categoryName}</h3>`;
            
            // Add products in this category
            products.forEach(product => {
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
        }
    }

    // Add categories in the order you want
    addCategoryProducts(shirts.products, "Men's Shirts");
    addCategoryProducts(dresses.products, "Women's Dresses");
    addCategoryProducts(shoes.products, "Men's Shoes");
    addCategoryProducts(womensShoes.products, "Women's Shoes");
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
});# Many types item are added in this ConvolverNode
# What do you need from here
// new comment added