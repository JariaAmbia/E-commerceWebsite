
let productsByCategory = {};
// FEATURED PRODUCTS 
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

    // Take  4 items 
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

//  NEW ARRIVALS 
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

//  LIGHTBOX 
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
    
    //  Separate rotate button handler for lightbox 
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

//  ROTATE BUTTON FOR SHOP PAGE (Outside lightbox) 
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
// Complete Admin Panel with Login System for Blog Page
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "1234";
    const SESSION_KEY = 'admin_session';
    const BLOG_KEY = 'blogPosts';
    
    // Default blog posts (matching your HTML)
    const defaultPosts = [
        {
            id: '1',
            title: "Stylish t-shirt with a comfortable fit and premium quality fabric.",
            description: "The t-shirt feels very smooth on the skin and is perfect for daily wear. Its color and design look trendy, making it a great choice for casual outfits",
            image: "image/blog1.jpg",
            date: "13/01"
        },
        {
            id: '2',
            title: "How to style a Quiff",
            description: "To style a quiff, start by applying a light product for texture and volume to slightly damp hair, then blow‑dry while lifting the front section upward and backward to create height and shape.",
            image: "image/blog2.png",
            date: "13/01"
        },
        {
            id: '3',
            title: "Must-Have skater girl items.",
            description: "Skater girls always need the essentials to stay stylish and comfortable on their boards. From durable sneakers to trendy graphic tees, these items make skating fun and effortless.",
            image: "image/blog3.png",
            date: "13/01"
        },
        {
            id: '4',
            title: "Runway inspired trends.",
            description: "Fashion lovers can bring high-end runway looks into their everyday wardrobe. Bold prints, statement accessories, and chic silhouettes make any outfit stand out.",
            image: "image/b7.png",
            date: "13/01"
        },
        {
            id: '5',
            title: "AW20 menswear trends",
            description: "Autumn/Winter 2020 menswear showcased rich textures and layered outfits. Oversized coats, tailored suits, and earthy tones defined the season's style.",
            image: "image/blog4.jpg",
            date: "13/01"
        }
    ];
    
    // State
    let isLoggedIn = false;
    let blogPosts = [];
    
    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        checkLoginStatus();
        loadPosts();
        setupAdminPanel();
        displayBlogPosts();
        updateAdminIcon();
        injectStyles();
        
        // Remove duplicate admin button and use the one in navbar
        const floatingBtn = document.getElementById('admin-icon');
        if (floatingBtn && floatingBtn.style.position === 'fixed') {
            floatingBtn.remove(); // Remove floating button, use navbar one instead
        }
    }
    
    function checkLoginStatus() {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
            try {
                const data = JSON.parse(session);
                if (data.expires > Date.now()) {
                    isLoggedIn = true;
                } else {
                    localStorage.removeItem(SESSION_KEY);
                    isLoggedIn = false;
                }
            } catch(e) {
                isLoggedIn = false;
            }
        }
    }
    
    function saveLoginSession() {
        const session = {
            loggedIn: true,
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        isLoggedIn = true;
        updateAdminIcon();
    }
    
    function logout() {
        localStorage.removeItem(SESSION_KEY);
        isLoggedIn = false;
        updateAdminIcon();
        closeAdminPanel();
        showToast('Logged out successfully', 'success');
    }
    
    function loadPosts() {
        const stored = localStorage.getItem(BLOG_KEY);
        if (stored) {
            blogPosts = JSON.parse(stored);
        } else {
            blogPosts = [...defaultPosts];
            localStorage.setItem(BLOG_KEY, JSON.stringify(blogPosts));
        }
    }
    
    function savePosts() {
        localStorage.setItem(BLOG_KEY, JSON.stringify(blogPosts));
    }
    
    function updateAdminIcon() {
        const adminIcon = document.getElementById('admin-icon');
        const mobileAdminIcon = document.getElementById('mobile-admin');
        
        if (adminIcon) {
            const icon = adminIcon.querySelector('i');
            if (icon) {
                if (isLoggedIn) {
                    icon.style.color = '#2ecc71';
                    adminIcon.title = 'Admin Panel (Logged in)';
                } else {
                    icon.style.color = '#e74c3c';
                    adminIcon.title = 'Admin Login (Click to login)';
                }
            }
        }
        
        if (mobileAdminIcon) {
            const icon = mobileAdminIcon.querySelector('i');
            if (icon) {
                if (isLoggedIn) {
                    icon.style.color = '#2ecc71';
                } else {
                    icon.style.color = '#e74c3c';
                }
            }
        }
    }
    
    // ============================================
    // BLOG DISPLAY
    // ============================================
    function displayBlogPosts() {
        const blogContainer = document.getElementById('blog');
        if (!blogContainer) return;
        
        if (blogPosts.length === 0) {
            blogContainer.innerHTML = '<div style="text-align:center; padding:60px;"><h3>No blog posts yet</h3><p>Check back soon!</p></div>';
            return;
        }
        
        blogContainer.innerHTML = blogPosts.map(post => `
            <div class="blog-box" data-id="${post.id}">
                <div class="blog-img">
                    <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" onerror="this.src='image/blog1.jpg'">
                </div>
                <div class="blog-details">
                    <h4>${escapeHtml(post.title)}</h4>
                    <p>${escapeHtml(post.description.substring(0, 120))}${post.description.length > 120 ? '...' : ''}</p>
                    <a href="#">CONTINUE READING</a>
                </div>
                <h1>${escapeHtml(post.date)}</h1>
            </div>
        `).join('');
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
    
    // ============================================
    // ADMIN PANEL SETUP
    // ============================================
    function setupAdminPanel() {
        const adminModal = document.getElementById('admin-modal');
        const adminOverlay = document.getElementById('admin-overlay');
        const adminIcon = document.getElementById('admin-icon');
        const mobileAdminIcon = document.getElementById('mobile-admin');
        const closeBtn = document.querySelector('.admin-close');
        
        // Open panel function
        function openPanel() {
            if (!isLoggedIn) {
                showLoginModal();
                return;
            }
            if (adminModal && adminOverlay) {
                adminModal.style.display = 'block';
                adminOverlay.style.display = 'block';
                renderAdminPosts();
                addLogoutButtonToPanel();
            }
        }
        
        // Attach click events
        if (adminIcon) adminIcon.onclick = openPanel;
        if (mobileAdminIcon) mobileAdminIcon.onclick = openPanel;
        
        // Close panel
        if (closeBtn) closeBtn.onclick = closeAdminPanel;
        if (adminOverlay) adminOverlay.onclick = closeAdminPanel;
        
        // Setup create post form
        const createForm = document.getElementById('create-post-form');
        if (createForm) {
            createForm.addEventListener('submit', handleCreatePost);
        }
        
        // Setup tabs
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active-tab'));
                this.classList.add('active');
                const target = document.getElementById(tabId);
                if (target) target.classList.add('active-tab');
                
                if (tabId === 'manage-tab' && isLoggedIn) {
                    renderAdminPosts();
                }
            });
        });
    }
    
    function closeAdminPanel() {
        const adminModal = document.getElementById('admin-modal');
        const adminOverlay = document.getElementById('admin-overlay');
        if (adminModal) adminModal.style.display = 'none';
        if (adminOverlay) adminOverlay.style.display = 'none';
    }
    
    function addLogoutButtonToPanel() {
        const adminHeader = document.querySelector('.admin-modal-header');
        if (adminHeader && !document.getElementById('panel-logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'panel-logout-btn';
            logoutBtn.innerHTML = '🚪 Logout';
            logoutBtn.style.cssText = `
                background: #dc3545;
                color: white;
                border: none;
                padding: 6px 15px;
                border-radius: 20px;
                cursor: pointer;
                margin-left: 15px;
                font-size: 13px;
            `;
            logoutBtn.onclick = () => {
                logout();
                renderAdminPosts();
                closeAdminPanel();
            };
            adminHeader.appendChild(logoutBtn);
        }
    }
    
    function renderAdminPosts() {
        const postsList = document.getElementById('posts-list');
        if (!postsList) return;
        
        if (!isLoggedIn) {
            postsList.innerHTML = `
                <div style="text-align:center; padding:50px 20px;">
                    <i class="fas fa-lock" style="font-size:48px; color:#ccc;"></i>
                    <h3 style="margin:15px 0 10px;">Login Required</h3>
                    <p style="color:#666;">Please login to manage blog posts</p>
                    <button onclick="window.showLoginModalFromGlobal()" style="background:#088178; color:white; border:none; padding:10px 25px; border-radius:25px; cursor:pointer; margin-top:15px;">
                        Login Now
                    </button>
                </div>
            `;
            return;
        }
        
        if (blogPosts.length === 0) {
            postsList.innerHTML = '<p style="text-align:center; padding:40px;">No posts yet. Create your first post!</p>';
            return;
        }
        
        postsList.innerHTML = blogPosts.map((post, index) => `
            <div style="background:#f8f9fa; border-radius:10px; padding:15px; margin-bottom:12px; display:flex; gap:15px; align-items:center; border:1px solid #e9ecef;">
                <img src="${escapeHtml(post.image)}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;" onerror="this.src='image/blog1.jpg'">
                <div style="flex:1;">
                    <h4 style="margin:0 0 5px; font-size:14px;">${escapeHtml(post.title.substring(0, 50))}${post.title.length > 50 ? '...' : ''}</h4>
                    <p style="font-size:12px; color:#666; margin:0;">📅 ${escapeHtml(post.date)}</p>
                    <p style="font-size:11px; color:#888; margin:5px 0 0;">${escapeHtml(post.description.substring(0, 60))}...</p>
                </div>
                <div>
                    <button onclick="window.editPost(${index})" style="background:#088178; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; margin-right:8px;">✏️ Edit</button>
                    <button onclick="window.deletePost(${index})" style="background:#dc3545; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    // Global functions for buttons
    window.editPost = function(index) {
        if (!isLoggedIn) {
            showToast('Please login first', 'error');
            showLoginModal();
            return;
        }
        
        const post = blogPosts[index];
        const newTitle = prompt('Edit Title:', post.title);
        if (newTitle && newTitle.trim()) post.title = newTitle;
        
        const newDesc = prompt('Edit Description:', post.description);
        if (newDesc && newDesc.trim()) post.description = newDesc;
        
        const newImage = prompt('Edit Image URL:', post.image);
        if (newImage && newImage.trim()) post.image = newImage;
        
        const newDate = prompt('Edit Date (DD/MM):', post.date);
        if (newDate && newDate.trim()) post.date = newDate;
        
        savePosts();
        displayBlogPosts();
        renderAdminPosts();
        showToast('Post updated!', 'success');
    };
    
    window.deletePost = function(index) {
        if (!isLoggedIn) {
            showToast('Please login first', 'error');
            showLoginModal();
            return;
        }
        
        if (confirm('Delete this post permanently?')) {
            blogPosts.splice(index, 1);
            savePosts();
            displayBlogPosts();
            renderAdminPosts();
            showToast('Post deleted!', 'success');
        }
    };
    
    function handleCreatePost(e) {
        e.preventDefault();
        
        if (!isLoggedIn) {
            showToast('Please login to create posts!', 'error');
            showLoginModal();
            return;
        }
        
        const title = document.getElementById('post-title')?.value;
        const description = document.getElementById('post-description')?.value;
        const image = document.getElementById('post-image')?.value;
        const date = document.getElementById('post-date')?.value;
        
        if (!title || !description || !image || !date) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        const newPost = {
            id: Date.now().toString(),
            title: title,
            description: description,
            image: image,
            date: date
        };
        
        blogPosts.unshift(newPost);
        savePosts();
        displayBlogPosts();
        renderAdminPosts();
        document.getElementById('create-post-form').reset();
        showToast('Post created successfully!', 'success');
    }
    
    // ============================================
    // LOGIN MODAL
    // ============================================
    window.showLoginModalFromGlobal = showLoginModal;
    
    function showLoginModal() {
        // Remove existing modal
        const existingModal = document.querySelector('.custom-login-modal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'custom-login-modal';
        modal.innerHTML = `
            <div class="login-modal-overlay2"></div>
            <div class="login-modal-container2">
                <div class="login-modal-header2">
                    <div class="login-icon2">👑</div>
                    <h2>Admin Login</h2>
                    <p>Enter your credentials to manage blog posts</p>
                    <button class="login-close-btn2">&times;</button>
                </div>
                <div class="login-modal-body2">
                    <div class="login-error-msg2" style="display:none;"></div>
                    <div class="login-input-group2">
                        <label>Username</label>
                        <input type="text" id="login-username2" placeholder="admin" autocomplete="off">
                    </div>
                    <div class="login-input-group2">
                        <label>Password</label>
                        <input type="password" id="login-password2" placeholder="••••••">
                    </div>
                    <button class="login-submit-btn2">Login to Dashboard</button>
                    <p class="login-hint2">Hint: admin / 1234</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => modal.remove();
        modal.querySelector('.login-close-btn2').onclick = closeModal;
        modal.querySelector('.login-modal-overlay2').onclick = closeModal;
        
        const attemptLogin = () => {
            const username = document.getElementById('login-username2').value;
            const password = document.getElementById('login-password2').value;
            const errorDiv = modal.querySelector('.login-error-msg2');
            
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                saveLoginSession();
                closeModal();
                showToast('Welcome Admin!', 'success');
                // Open admin panel after login
                const adminModal = document.getElementById('admin-modal');
                const adminOverlay = document.getElementById('admin-overlay');
                if (adminModal && adminOverlay) {
                    adminModal.style.display = 'block';
                    adminOverlay.style.display = 'block';
                    renderAdminPosts();
                    addLogoutButtonToPanel();
                }
            } else {
                errorDiv.textContent = 'Wrong username or password! Use: admin / 1234';
                errorDiv.style.display = 'block';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            }
        };
        
        modal.querySelector('.login-submit-btn2').onclick = attemptLogin;
        modal.querySelector('#login-password2').onkeypress = (e) => {
            if (e.key === 'Enter') attemptLogin();
        };
    }
    
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `custom-toast2 toast-${type}2`;
        toast.innerHTML = `
            <div class="toast-content2">
                <span class="toast-icon2">${type === 'success' ? '✓' : '✗'}</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // STYLES
    // ============================================
    function injectStyles() {
        const styles = `
            <style>
                /* Login Modal */
                .custom-login-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 100000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .login-modal-overlay2 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);
                }
                .login-modal-container2 {
                    position: relative;
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 380px;
                    animation: modalFadeIn2 0.3s ease;
                    overflow: hidden;
                }
                @keyframes modalFadeIn2 {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .login-modal-header2 {
                    background: linear-gradient(135deg, #088178, #065c56);
                    color: white;
                    padding: 25px 20px;
                    text-align: center;
                    position: relative;
                }
                .login-icon2 {
                    font-size: 45px;
                    margin-bottom: 10px;
                }
                .login-modal-header2 h2 {
                    margin: 0 0 5px;
                    font-size: 22px;
                }
                .login-modal-header2 p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 12px;
                }
                .login-close-btn2 {
                    position: absolute;
                    top: 12px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 26px;
                    cursor: pointer;
                }
                .login-modal-body2 {
                    padding: 24px;
                }
                .login-input-group2 {
                    margin-bottom: 16px;
                }
                .login-input-group2 label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 600;
                    font-size: 13px;
                    color: #333;
                }
                .login-input-group2 input {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                }
                .login-input-group2 input:focus {
                    outline: none;
                    border-color: #088178;
                }
                .login-error-msg2 {
                    background: #fee2e2;
                    color: #dc2626;
                    padding: 10px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 12px;
                }
                .login-submit-btn2 {
                    width: 100%;
                    padding: 12px;
                    background: #088178;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 5px;
                }
                .login-submit-btn2:hover {
                    background: #065c56;
                }
                .login-hint2 {
                    text-align: center;
                    margin-top: 15px;
                    font-size: 11px;
                    color: #999;
                }
                
                /* Toast */
                .custom-toast2 {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 100000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                }
                .custom-toast2.show {
                    transform: translateX(0);
                }
                .toast-content2 {
                    background: white;
                    padding: 10px 18px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .toast-success2 {
                    border-left: 3px solid #2ecc71;
                }
                .toast-error2 {
                    border-left: 3px solid #e74c3c;
                }
                .toast-icon2 {
                    font-weight: bold;
                }
                .toast-success2 .toast-icon2 {
                    color: #2ecc71;
                }
                .toast-error2 .toast-icon2 {
                    color: #e74c3c;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Start everything
    init();
});

// Also keep your existing product and cart code here...
// (Your existing products, cart, contact form, etc. code continues below)
// CART SYSTEM - 

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
    
    // Keep trying to attach the button 
    attachButton();
    setInterval(attachButton, 500);
    
    //  CART PAGE DISPLAY 
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
            
            
        }
    });
}

// Contact Form 
const contactForm = document.querySelector('.Form-details form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = contactForm.querySelector('input[placeholder="Name"]')?.value || '';
        const email = contactForm.querySelector('input[placeholder="E-mail"]')?.value || '';
        const subject = contactForm.querySelector('input[placeholder="Subject"]')?.value || '';
        const message = contactForm.querySelector('textarea[placeholder="Your Message"]')?.value || '';
        const date = new Date().toLocaleString();
        
        // Get existing messages from localStorage
        let allMessages = localStorage.getItem('allContactMessages') || '';
        
        // Add new message
        const newMessage = `
========================================
NEW MESSAGE - ${date}
========================================
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
----------------------------------------
        `;
        
        allMessages += newMessage;
        
        // Save to localStorage
        localStorage.setItem('allContactMessages', allMessages);
        
        // Also save count
        let messageCount = parseInt(localStorage.getItem('messageCount') || '0');
        messageCount++;
        localStorage.setItem('messageCount', messageCount);
        
        // Clear form
        contactForm.reset();
        
        // Show confirmation
        alert(`✓ Message #${messageCount} saved! Download the file to see all messages.`);
    });
}

// Function to download ALL messages (add a button for this)
function downloadAllMessages() {
    const allMessages = localStorage.getItem('allContactMessages');
    
    if (!allMessages || allMessages.trim() === '') {
        alert('No messages yet!');
        return;
    }
    
    const messageCount = localStorage.getItem('messageCount') || '0';
    const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    const header = `CONTACT FORM MESSAGES
Total Messages: ${messageCount}
Last Updated: ${new Date().toLocaleString()}
========================================\n`;
    
    const blob = new Blob([header + allMessages], {type: 'text/plain'});
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `all-contact-messages-${date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Downloaded ${messageCount} messages!`);
}

// Add a "Download All Messages" button to your page
function addDownloadButton() {
    const formSection = document.querySelector('.Form-details');
    if (formSection && !document.querySelector('#downloadMessagesBtn')) {
        const btn = document.createElement('button');
        btn.id = 'downloadMessagesBtn';
        btn.textContent = '📥 Download All Messages';
        btn.className = 'normal';
        btn.style.marginTop = '20px';
        btn.style.background = '#088178';
        btn.onclick = downloadAllMessages;
        
        // Insert after the form
        const form = formSection.querySelector('form');
        if (form) {
            form.after(btn);
        }
    }
}

// Add button when page loads
if (document.querySelector('.Form-details')) {
    setTimeout(addDownloadButton, 100);
}

//  SIGN UP / LOGIN SYSTEM 

// Function to check login status and update icon
function updateIconStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const icon = document.querySelector('#lg-account a i');
    if(icon) {
        if(isLoggedIn) {
            icon.style.color = '#088178';
            icon.style.fontWeight = 'bold';
        } else {
            icon.style.color = '#000';
            icon.style.fontWeight = 'normal';
        }
    }
}

// Show login/signup popup
function showAuthPopup() {
    // Remove existing modal if any
    const oldModal = document.querySelector('.modal');
    if(oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-box">
            <span class="close">&times;</span>
            <h2 id="form-title">Sign Up</h2>
            <input type="text" id="name" placeholder="Full Name">
            <input type="email" id="email" placeholder="Email">
            <input type="password" id="password" placeholder="Password">
            <button id="submit-btn">Sign Up</button>
            <p id="toggle-text">Already have an account? <a id="toggle">Login</a></p>
        </div>
    `;
    document.body.appendChild(modal);
    
    let isLogin = false;
    const title = document.getElementById('form-title');
    const nameField = document.getElementById('name');
    const submitBtn = document.getElementById('submit-btn');
    
    // Toggle between login and signup
    const toggleLink = document.getElementById('toggle');
    toggleLink.onclick = function(e) {
        e.preventDefault();
        isLogin = !isLogin;
        if(isLogin) {
            title.innerText = 'Login';
            nameField.style.display = 'none';
            submitBtn.innerText = 'Login';
            document.getElementById('toggle-text').innerHTML = `Don't have an account? <a id="toggle">Sign Up</a>`;
        } else {
            title.innerText = 'Sign Up';
            nameField.style.display = 'block';
            submitBtn.innerText = 'Sign Up';
            document.getElementById('toggle-text').innerHTML = `Already have an account? <a id="toggle">Login</a>`;
        }
        // Re-attach event to new toggle link
        document.getElementById('toggle').onclick = toggleLink.onclick;
    };
    
    // Submit button
    submitBtn.onclick = function() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if(!email || !password) {
            alert('Please fill email and password');
            return;
        }
        
        if(isLogin) {
            // LOGIN
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if(user) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userEmail', email);
                alert(`Welcome back ${user.name}!`);
                modal.remove();
                updateIconStatus();
                location.reload();
            } else {
                alert('Invalid email or password');
            }
        } else {
            // SIGN UP
            const name = document.getElementById('name').value.trim();
            if(!name) {
                alert('Please enter your name');
                return;
            }
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if(users.find(u => u.email === email)) {
                alert('Email already exists! Please login.');
                return;
            }
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            alert(`Welcome ${name}!`);
            modal.remove();
            updateIconStatus();
            location.reload();
        }
    };
    
    // Close modal
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
}

// Show user menu when logged in
function showUserMenu() {
    // Remove existing modal if any
    const oldModal = document.querySelector('.modal');
    if(oldModal) oldModal.remove();
    
    const userName = localStorage.getItem('userName');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-box">
            <span class="close">&times;</span>
            <h2>Welcome, ${userName}!</h2>
            <p style="margin: 20px 0; color: #666;">You are logged in as ${localStorage.getItem('userEmail')}</p>
            <button id="logout-btn" style="background:#dc3545;">Logout</button>
            <button id="close-btn" style="background:#6c757d; margin-top:10px;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('logout-btn').onclick = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        alert('Logged out successfully!');
        modal.remove();
        updateIconStatus();
        location.reload();
    };
    
    document.getElementById('close-btn').onclick = () => modal.remove();
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
}

// Handle icon click - MAIN FUNCTION
function handleAccountClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if(isLoggedIn) {
        showUserMenu();
    } else {
        showAuthPopup();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    const accountIcon = document.getElementById('lg-account');
    
    if(accountIcon) {
        // Remove any existing listeners
        const newIcon = accountIcon.cloneNode(true);
        accountIcon.parentNode.replaceChild(newIcon, accountIcon);
        
        // Add new listener
        newIcon.addEventListener('click', handleAccountClick);
    }
    
    updateIconStatus();
});

// DELIVERY TRACKING SYSTEM
const steps = [

    document.getElementById("step1"),
    document.getElementById("step2"),
    document.getElementById("step3"),
    document.getElementById("step4")

];


const lines = [

    document.getElementById("line1"),
    document.getElementById("line2"),
    document.getElementById("line3")

];



const nextBtn = document.getElementById("nextBtn");

const backBtn = document.getElementById("backBtn");


let currentStep = 0;


// NEXT BUTTON


nextBtn.addEventListener("click", () => {

  
    if(currentStep < steps.length - 1){

       
        currentStep++;

        
        steps[currentStep].classList.add("active");

      
        lines[currentStep - 1].classList.add("active-line");

    }

    //  Delivered 
    if(currentStep === steps.length - 1){

        nextBtn.innerText = "Order Delivered";

        nextBtn.style.background = "green";

    }else{

        nextBtn.innerText = "Update Delivery Status";

        nextBtn.style.background = "#088178";

    }

});



// BACK BUTTON//

backBtn.addEventListener("click", () => {

  
    if(currentStep > 0){

       
        steps[currentStep].classList.remove("active");

      
        lines[currentStep - 1].classList.remove("active-line");

     
        currentStep--;

    }

   
    nextBtn.innerText = "Update Delivery Status";

    nextBtn.style.background = "#088178";

});
