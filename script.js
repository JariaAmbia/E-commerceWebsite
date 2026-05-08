
// Store products by category for related products
let productsByCategory = {};
// ========== SECTION 1: FEATURED PRODUCTS (4 items per category) ==========
Promise.all([
    fetch("https://dummyjson.com/products/category/mens-shirts?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-dresses?limit=10").catch(() => ({products: []})),
    fetch("https://dummyjson.com/products/category/mens-shoes?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-shoes?limit=10").then(res => res.json())
])
.then(([shirts, dresses, shoes, womensShoes]) => {
        productsByCategory = {
        'mens-shirts': shirts.products || [],
        'womens-dresses': dresses.products || [],
        'mens-shoes': shoes.products || [],
        'womens-shoes': womensShoes.products || []
    };
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
<div class="pro" id="product-${product.id}">
    <img src="${product.images[0]}" alt="${product.title}" class="product-image">
    <!-- HIDDEN IMAGES - For rotate button (different angles of same product) -->
    <div style="display: none;" class="product-all-images">
        ${product.images.map(img => `<img src="${img}" class="hidden-product-image">`).join('')}
    </div>
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
        ${showColors ? `
<div class="product-rotate">
    <span class="rotate-btn" title="View more angles">
        <i class="fa-solid fa-rotate"></i>
    </span>
</div>
` : ''}
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

// ========== LIGHTBOX WITH RELATED PRODUCTS (Fixed - Shows clicked product first) ==========
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
    
    let currentRelatedProducts = [];
    let currentProductImages = [];
    let currentIndex = 0;
    let currentRotateIndex = 0;
// Open lightbox when clicking product image
document.addEventListener("click", function(e) {
    if (e.target.classList.contains('product-image')) {
        const productDiv = e.target.closest('.pro');
        
        const clickedTitle = productDiv.querySelector('h5').textContent;
        const clickedCategory = productDiv.querySelector('.des span').textContent;
        const clickedPrice = productDiv.querySelector('h4').textContent;
        const clickedProductId = productDiv.id ? parseInt(productDiv.id.replace('product-', '')) : null;
        
        // Get clicked product's multi-angle images
        const hiddenContainer = productDiv.querySelector('.product-all-images');
        if (hiddenContainer) {
            const hiddenImages = hiddenContainer.querySelectorAll('img');
            currentProductImages = [...new Set(Array.from(hiddenImages).map(img => img.src))];
            currentRotateIndex = 0;
        }
        
        // Determine category
        let productCategoryKey = '';
        if (clickedCategory.includes("Men's Shirts")) productCategoryKey = 'mens-shirts';
        else if (clickedCategory.includes("Women's Dresses")) productCategoryKey = 'womens-dresses';
        else if (clickedCategory.includes("Men's Shoes")) productCategoryKey = 'mens-shoes';
        else if (clickedCategory.includes("Women's Shoes")) productCategoryKey = 'womens-shoes';
        
        // For New Arrivals (not in productsByCategory)
        if (productsByCategory[productCategoryKey] && productsByCategory[productCategoryKey].length > 0) {
            currentRelatedProducts = [...productsByCategory[productCategoryKey]];
            currentIndex = currentRelatedProducts.findIndex(p => p.id === clickedProductId);
        } else {
            // Create product data for New Arrivals
            currentRelatedProducts = [{
                id: Date.now(),
                title: clickedTitle,
                category: clickedCategory,
                price: parseFloat(clickedPrice.replace('$', '')),
                images: [productDiv.querySelector('.product-image').src],
                rating: 4.5
            }];
            currentIndex = 0;
        }
        
        if (currentIndex === -1) currentIndex = 0;
        
        showProductInLightbox(currentIndex);
        lightbox.style.display = "block";
    }
});
   
    function showProductInLightbox(index) {
        if (index < 0 || index >= currentRelatedProducts.length) return;
        
        const product = currentRelatedProducts[index];
        currentIndex = index;
        
        productTitle.textContent = product.title;
        productCategory.textContent = product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        productDescription.textContent = "Premium quality product with excellent craftsmanship. Made from high-quality materials for long-lasting comfort and style.";
        productPrice.textContent = `$${product.price}`;
        
        if (product.images && product.images.length > 0) {
            currentProductImages = product.images;
            currentRotateIndex = 0;
            lightboxImg.src = currentProductImages[0];
        }
        
        counter.textContent = `${index + 1} / ${currentRelatedProducts.length}`;
        
       productStock.textContent = '✓ In Stock';
       productStock.className = 'stock-status';
        const rating = product.rating || 4.5;
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
        productStars.textContent = stars;
        productRating.textContent = `(${rating} stars)`;
        
        updateThumbnails(index);
    }
    
    function updateThumbnails(activeIndex) {
        if (!thumbnailContainer) return;
        thumbnailContainer.innerHTML = '';
        
        currentRelatedProducts.forEach((product, idx) => {
            const thumb = document.createElement('img');
            thumb.src = product.images[0];
            thumb.classList.add('thumbnail');
            if (idx === activeIndex) {
                thumb.classList.add('active-thumbnail');
            }
            
            thumb.onclick = () => showProductInLightbox(idx);
            thumbnailContainer.appendChild(thumb);
        });
    }
    
    // FIXED: Separate rotate button handler for lightbox ONLY
    document.addEventListener('click', function(e) {
        const rotateBtn = e.target.closest('.rotate-btn');
        if (rotateBtn && lightbox.style.display === "block") {
            e.stopPropagation();
            if (currentProductImages.length > 1) {
                currentRotateIndex = (currentRotateIndex + 1) % currentProductImages.length;
                lightboxImg.style.opacity = '0.5';
                setTimeout(() => {
                    lightboxImg.src = currentProductImages[currentRotateIndex];
                    lightboxImg.style.opacity = '1';
                }, 150);
            }
        }
    });
    
    // Navigation buttons
    if (nextBtn) {
        nextBtn.onclick = function() {
            if (currentRelatedProducts.length > 0 && currentIndex < currentRelatedProducts.length - 1) {
                showProductInLightbox(currentIndex + 1);
            }
        };
    }
    
    if (prevBtn) {
        prevBtn.onclick = function() {
            if (currentRelatedProducts.length > 0 && currentIndex > 0) {
                showProductInLightbox(currentIndex - 1);
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

// ========== ROTATE BUTTON FOR SHOP PAGE (Outside lightbox) ==========
document.addEventListener('click', function(e) {
    const rotateBtn = e.target.closest('.rotate-btn');
    if (rotateBtn && lightbox.style.display !== "block") {
        const isShopPage = window.location.pathname.includes('shop.html') || 
                          window.location.href.includes('shop.html');
        
        if (!isShopPage) {
            e.target.style.transform = 'scale(1.2)';
            setTimeout(() => e.target.style.transform = '', 200);
            return;
        }
        
        const productDiv = rotateBtn.closest('.pro');
        const productImg = productDiv.querySelector('.product-image');
        
        // Get hidden images for this product
        const hiddenContainer = productDiv.querySelector('.product-all-images');
        if (hiddenContainer) {
            const hiddenImages = hiddenContainer.querySelectorAll('img');
            const productImages = [...new Set(Array.from(hiddenImages).map(img => img.src))];
            
            if (productImages.length > 1) {
                let currentSrc = productImg.src;
                let currentIndex = productImages.indexOf(currentSrc);
                let nextIndex = (currentIndex + 1) % productImages.length;
                
                productImg.style.opacity = '0.5';
                setTimeout(() => {
                    productImg.src = productImages[nextIndex];
                    productImg.style.opacity = '1';
                }, 150);
            } else {
                productImg.style.transform = 'scale(0.95)';
                setTimeout(() => productImg.style.transform = '', 200);
            }
        } else {
            // Fallback to old method
            let currentSrc = productImg.src;
            let match = currentSrc.match(/\/(\d+)\.webp$/);
            
            if (match) {
                let currentIdx = parseInt(match[1]);
                let nextIdx = (currentIdx % 4) + 1;
                let newSrc = currentSrc.replace(`/${currentIdx}.webp`, `/${nextIdx}.webp`);
                
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
    }
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
// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Default blog posts
    const defaultPosts = [
        {
            title: "Stylish t-shirt with a comfortable fit and premium quality fabric.",
            description: "The t-shirt feels very smooth on the skin and is perfect for daily wear.",
            image: "image/blog1.jpg",
            date: "13/01"
        },
        {
            title: "How to style a Quiff",
            description: "To style a quiff, start by applying a light product for texture and volume.",
            image: "image/blog2.png",
            date: "13/01"
        },
        {
            title: "Must-Have skater girl items.",
            description: "Skater girls always need the essentials to stay stylish and comfortable.",
            image: "image/blog3.png",
            date: "13/01"
        },
        {
            title: "Runway inspired trends.",
            description: "Fashion lovers can bring high-end runway looks into their everyday wardrobe.",
            image: "image/b7.png",
            date: "13/01"
        },
        {
            title: "AW20 menswear trends",
            description: "Autumn/Winter 2020 menswear showcased rich textures and layered outfits.",
            image: "image/blog4.jpg",
            date: "13/01"
        }
    ];
    
    // Load or initialize posts
    let blogPosts = JSON.parse(localStorage.getItem('blogPosts'));
    if (!blogPosts || blogPosts.length === 0) {
        blogPosts = [...defaultPosts];
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    }
    
    // Display blog posts
    function displayBlogPosts() {
        const blogContainer = document.getElementById('blog');
        if (!blogContainer) return;
        
        blogContainer.innerHTML = '';
        blogPosts.forEach(post => {
            blogContainer.innerHTML += `
            <div class="blog-box">
                <div class="blog-img">
                    <img src="${post.image}" alt="${post.title}" onerror="this.src='image/blog1.jpg'">
                </div>
                <div class="blog-details">
                    <h4>${escapeHtml(post.title)}</h4>
                    <p>${escapeHtml(post.description)}</p>
                    <a href="#">CONTINUE READING</a>
                </div>
                <h1>${escapeHtml(post.date)}</h1>
            </div>
            `;
        });
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Display posts in admin panel
    function displayAdminPosts() {
        const postsList = document.getElementById('posts-list');
        if (!postsList) return;
        
        if (blogPosts.length === 0) {
            postsList.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">No posts yet.</p>';
            return;
        }
        
        postsList.innerHTML = '';
        blogPosts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.className = 'admin-post-item';
            postDiv.innerHTML = `
                <div class="admin-post-info">
                    <h4>${escapeHtml(post.title.substring(0, 40))}${post.title.length > 40 ? '...' : ''}</h4>
                    <p>📅 ${escapeHtml(post.date)}</p>
                    <small>${escapeHtml(post.description.substring(0, 50))}...</small>
                </div>
                <div class="admin-post-actions">
                    <button class="admin-edit-btn" data-index="${index}">✏️ Edit</button>
                    <button class="admin-delete-btn" data-index="${index}">🗑️ Delete</button>
                </div>
            `;
            postsList.appendChild(postDiv);
        });
        
        // Delete posts
        document.querySelectorAll('.admin-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('Delete this post?')) {
                    blogPosts.splice(index, 1);
                    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
                    displayAdminPosts();
                    displayBlogPosts();
                    alert('Post deleted!');
                }
            });
        });
        
        // Edit posts with form modal
        document.querySelectorAll('.admin-edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const post = blogPosts[index];
                
                // Create edit modal (centered popup)
                const editModal = document.createElement('div');
                editModal.className = 'admin-modal';
                editModal.style.display = 'flex';
                editModal.style.alignItems = 'center';
                editModal.style.justifyContent = 'center';
                editModal.style.background = 'rgba(0,0,0,0.6)';
                editModal.style.right = 'auto';
                editModal.style.width = '100%';
                editModal.style.animation = 'slideDown 0.3s ease';
                editModal.innerHTML = `
                    <div class="admin-modal-content" style="max-width: 500px; margin: 0; border-radius: 15px;">
                        <div class="admin-modal-header">
                            <h2><i class="fas fa-edit"></i> Edit Post</h2>
                            <span class="edit-close" style="font-size:35px; cursor:pointer;">&times;</span>
                        </div>
                        <div class="admin-modal-body">
                            <input type="text" id="edit-title" placeholder="Title" value="${escapeHtml(post.title).replace(/"/g, '&quot;')}" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                            <textarea id="edit-desc" placeholder="Description" rows="3" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">${escapeHtml(post.description)}</textarea>
                            <input type="text" id="edit-image" placeholder="Image URL" value="${escapeHtml(post.image)}" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                            <input type="text" id="edit-date" placeholder="Date" value="${escapeHtml(post.date)}" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                            <button id="save-edit" style="background:#27ae60; color:white; border:none; padding:12px; width:100%; border-radius:8px; cursor:pointer;">Save Changes</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(editModal);
                
                // Close edit modal
                editModal.querySelector('.edit-close').onclick = () => editModal.remove();
                editModal.onclick = (e) => { if(e.target === editModal) editModal.remove(); };
                
                // Save edited post
                document.getElementById('save-edit').onclick = () => {
                    const newTitle = document.getElementById('edit-title').value;
                    const newDesc = document.getElementById('edit-desc').value;
                    const newImage = document.getElementById('edit-image').value;
                    const newDate = document.getElementById('edit-date').value;
                    
                    if(newTitle && newDesc && newImage && newDate) {
                        blogPosts[index] = {
                            title: newTitle,
                            description: newDesc,
                            image: newImage,
                            date: newDate
                        };
                        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
                        displayAdminPosts();
                        displayBlogPosts();
                        editModal.remove();
                        alert('Post updated!');
                    } else {
                        alert('Please fill all fields');
                    }
                };
            });
        });
    }
    
    // Create new post
    const createForm = document.getElementById('create-post-form');
    if(createForm) {
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('post-title').value;
            const description = document.getElementById('post-description').value;
            const image = document.getElementById('post-image').value;
            const date = document.getElementById('post-date').value;
            
            if(!title || !description || !image || !date) {
                alert('Please fill all fields');
                return;
            }
            
            blogPosts.unshift({title, description, image, date});
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
            displayBlogPosts();
            displayAdminPosts();
            createForm.reset();
            alert('Post created!');
        });
    }
    
    // Panel controls (slide from right)
    const adminModal = document.getElementById('admin-modal');
    const adminOverlay = document.getElementById('admin-overlay');
    const adminIcon = document.getElementById('admin-icon');
    const closeBtn = document.querySelector('.admin-close');
    
    function openPanel() {
        adminModal.style.display = 'block';
        adminOverlay.style.display = 'block';
        displayAdminPosts();
    }
    
    function closePanel() {
        adminModal.style.display = 'none';
        adminOverlay.style.display = 'none';
    }
    
    if(adminIcon) {
        adminIcon.onclick = openPanel;
    }
    
    if(closeBtn) {
        closeBtn.onclick = closePanel;
    }
    
    if(adminOverlay) {
        adminOverlay.onclick = closePanel;
    }
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active-tab'));
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active-tab');
        });
    });
    
    // Initial display
    displayBlogPosts();
});

// ========== SIMPLE CART SYSTEM - SAFE VERSION ==========
// This version will NOT break your existing functionality

// Wait for everything to load first
window.addEventListener('load', function() {
    
    // Get cart from storage
    function getCart() {
        const cart = localStorage.getItem('simpleCart');
        return cart ? JSON.parse(cart) : [];
    }
    
    // Save cart
    function saveCart(cart) {
        localStorage.setItem('simpleCart', JSON.stringify(cart));
    }
    
    // Add to cart function
    window.addToCartFunction = function() {
        // Get product details from lightbox
        const title = document.getElementById('product-title')?.innerText;
        const priceText = document.getElementById('product-price')?.innerText;
        const image = document.getElementById('lightbox-img')?.src;
        
        if (!title || !priceText) {
            alert('Could not get product details');
            return;
        }
        
        const price = parseFloat(priceText.replace('$', ''));
        
        let cart = getCart();
        
        // Check if product exists
        const existing = cart.find(item => item.title === title);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: Date.now(),
                title: title,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        saveCart(cart);
        
        // Show notification
        const notif = document.createElement('div');
        notif.textContent = title + ' added to cart!';
        notif.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#088178;color:white;padding:10px 20px;border-radius:5px;z-index:9999;';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
        
        // Update cart count if on cart page
        if (window.location.pathname.includes('cart.html')) {
            location.reload();
        }
    };
    
    // Attach to the add to cart button
    function attachButton() {
        const btn = document.querySelector('.add-to-cart-btn');
        if (btn && !btn.hasAttribute('data-attached')) {
            btn.setAttribute('data-attached', 'true');
            btn.onclick = function(e) {
                e.preventDefault();
                window.addToCartFunction();
            };
        }
    }
    
    // Keep trying to attach the button (in case lightbox loads late)
    attachButton();
    setInterval(attachButton, 500);
    
    // ========== CART PAGE DISPLAY ==========
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
    
    function displayCart() {
        const cart = getCart();
        const tbody = document.querySelector('#cart tbody');
        
        if (!tbody) return;
        
        if (cart.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Your cart is empty</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><button onclick="removeItem(${index})" style="background:none;border:none;color:red;cursor:pointer">✖</button></td>
                <td><img src="${item.image}" width="50"></td>
                <td>${item.title}</td>
                <td>$${item.price}</td>
                <td><input type="number" value="${item.quantity}" min="1" onchange="updateQty(${index}, this.value)" style="width:60px"></td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;
        });
        
        // Update totals
        const shipping = subtotal > 0 ? 20 : 0;
        const total = subtotal + shipping;
        
        const subtotalCell = document.querySelector('#subtotal table tr:first-child td:last-child');
        const totalCell = document.querySelector('#subtotal table tr:last-child td:last-child strong');
        
        if (subtotalCell) subtotalCell.innerHTML = `$${subtotal.toFixed(2)}`;
        if (totalCell) totalCell.innerHTML = `$${total.toFixed(2)}`;
    }
    
    // Global functions for cart page
    window.removeItem = function(index) {
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        displayCart();
    };
    
    window.updateQty = function(index, newQty) {
        let cart = getCart();
        cart[index].quantity = parseInt(newQty);
        saveCart(cart);
        displayCart();
    };
    
    // Fix: Make sure your existing product loading still works
    console.log('Cart system loaded - products should display normally');
    
});


// Coupon functionality
document.addEventListener('DOMContentLoaded', function() {
    const applyBtn = document.querySelector('#coupon .normal');
    const couponInput = document.querySelector('#coupon input[type="text"]');
    let discount = 0;
    
    function updateTotal() {
        let subtotal = 129.50;
        const shipping = 20.00;
        
        const discountAmount = (subtotal * discount) / 100;
        const newSubtotal = subtotal - discountAmount;
        const finalTotal = newSubtotal + shipping;
        
        const rows = document.querySelectorAll('#subtotal table tr');
        if (rows[0]) rows[0].cells[1].innerHTML = `$${newSubtotal.toFixed(2)}`;
        if (rows[2]) rows[2].cells[1].innerHTML = `<strong>$${finalTotal.toFixed(2)}</strong>`;
        
        // Show discount message
        console.log(`${discount}% discount applied`);
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const couponCode = couponInput.value.toUpperCase();
            
            // 5% to 50% discounts
            if (couponCode === 'SAVE5') {
                discount = 5;
                updateTotal();
                alert('5% discount applied!');
            }
            else if (couponCode === 'SAVE10') {
                discount = 10;
                updateTotal();
                alert('10% discount applied!');
            }
            else if (couponCode === 'SAVE15') {
                discount = 15;
                updateTotal();
                alert('15% discount applied!');
            }
            else if (couponCode === 'SAVE20') {
                discount = 20;
                updateTotal();
                alert('20% discount applied!');
            }
            else if (couponCode === 'SAVE25') {
                discount = 25;
                updateTotal();
                alert('25% discount applied!');
            }
            else if (couponCode === 'SAVE30') {
                discount = 30;
                updateTotal();
                alert('30% discount applied!');
            }
            else if (couponCode === 'SAVE35') {
                discount = 35;
                updateTotal();
                alert('35% discount applied!');
            }
            else if (couponCode === 'SAVE40') {
                discount = 40;
                updateTotal();
                alert('40% discount applied!');
            }
            else if (couponCode === 'SAVE45') {
                discount = 45;
                updateTotal();
                alert('45% discount applied!');
            }
            else if (couponCode === 'SAVE50') {
                discount = 50;
                updateTotal();
                alert('50% discount applied!');
            }
            else if (couponCode === '0%' || couponCode === 'ZERO' || couponCode === 'NOOFF') {
                discount = 0;
                updateTotal();
                alert('0% discount applied! Your total remains $149.50');
            }
            else if (couponCode === '') {
                alert('Please enter a coupon code');
            }
            else {
                alert('Invalid coupon code! Try: SAVE5, SAVE10, SAVE15, SAVE20, SAVE25, SAVE30, SAVE35, SAVE40, SAVE45, SAVE50');
            }
            
            couponInput.value = '';
        });
    }
});
// Proceed to Checkout functionality
const checkoutBtn = document.querySelector('#subtotal .normal:last-child');
    
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if cart is empty
        const cartItems = document.querySelectorAll('#cart tbody tr');
        const totalAmount = document.querySelector('#subtotal table tr:last-child td:last-child').innerText;
        
        if (cartItems.length === 0) {
            alert(' Your cart is empty! Please add some items before checkout.');
            return;
        }
        
        // Show confirmation
        const confirmCheckout = confirm(` Proceed to Checkout?\n\nTotal Amount: ${totalAmount}\n\nClick OK to continue.`);
        
        if (confirmCheckout) {
            // Success message
            alert(` Order placed successfully!\n\nTotal: ${totalAmount}\n\nThank you for shopping with us!`);
            
            // Optional: Redirect to checkout page
            // window.location.href = "checkout.html";
            
            // Optional: Clear cart after checkout
            // cartItems.forEach(row => row.remove());
            // updateTotal(0);
        }
    });
}